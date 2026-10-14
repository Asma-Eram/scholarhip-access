import { useState } from 'react'
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Landmark, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Building2,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  BookOpen
} from 'lucide-react'
import { SCHEMES, CONFLICT_RULES, I18N } from '../data/scholarshipData'
import AutofillModal from '../components/AutofillModal'
import './SchemesPage.css'

export function checkSchemeQualification(student, scheme) {
  const studentLevel = (student?.educationLevel || 'Under-Graduate').toLowerCase()
  const studentProgram = (student?.academicProgram || 'B.Tech in CSE').toLowerCase()
  const text = (scheme.id + ' ' + scheme.targetGroup + ' ' + scheme.description + ' ' + (scheme.eligibilityCriteria || []).join(' ')).toLowerCase()
  const streams = scheme.applicableStreams || []

  // 1. School Level (Pre-Matric, NMMS)
  if (scheme.id === 'pre-matric' || scheme.id === 'nmms-merit' || streams.includes('school') || streams.includes('class9')) {
    if (studentLevel.includes('school') || studentLevel.includes('secondary')) {
      return { eligible: true, badge: 'Eligible (School Level Match)' }
    }
    return {
      eligible: false,
      badge: 'Not Eligible (Requires Class IX–XII)',
      reason: 'Open only to School Students (Class 9–12). You are currently enrolled in Undergraduate College.'
    }
  }

  // 2. Doctoral / Research (Ph.D / M.Phil)
  if (scheme.id === 'nfst' || scheme.id === 'pmrf' || streams.includes('phd') || streams.includes('doctoral')) {
    if (studentLevel.includes('phd') || studentLevel.includes('doctoral') || studentProgram.includes('phd')) {
      return { eligible: true, badge: 'Eligible (Doctoral Level Match)' }
    }
    return {
      eligible: false,
      badge: 'Not Eligible (Requires Ph.D / PG)',
      reason: 'Exclusively for registered full-time Ph.D / Master’s research scholars. Your current level is Under-Graduate.'
    }
  }

  // 3. Overseas / Study Abroad
  if (scheme.id === 'nos' || streams.includes('study_abroad')) {
    return {
      eligible: false,
      badge: 'Requires Foreign University Offer',
      reason: 'Mandatory unconditional admission offer letter from QS World Top 500 foreign university.'
    }
  }

  // 4. Basic / Natural Sciences Specific (e.g. DST INSPIRE SHE)
  if (scheme.id === 'dst-inspire' || (streams.includes('bsc') && !streams.includes('btech') && !streams.includes('general_ug'))) {
    if (studentProgram.includes('b.sc') || studentProgram.includes('m.sc') || studentProgram.includes('basic sciences')) {
      return { eligible: true, badge: 'Eligible (B.Sc / M.Sc Science Match)' }
    }
    return {
      eligible: false,
      badge: 'Stream Mismatch (Requires B.Sc / M.Sc)',
      reason: 'Exclusively for B.Sc/M.Sc Natural & Basic Sciences. Engineering/B.Tech is not covered under DST INSPIRE-SHE.'
    }
  }

  // 5. Medical & Health Sciences (e.g. MBBS, BDS, Nursing)
  if (scheme.id === 'health-sciences-merit' || (streams.includes('mbbs') && !streams.includes('btech') && !streams.includes('general_ug'))) {
    if (studentProgram.includes('mbbs') || studentProgram.includes('bds') || studentProgram.includes('nursing') || studentProgram.includes('medical')) {
      return { eligible: true, badge: 'Eligible (Medical Stream Match)' }
    }
    return {
      eligible: false,
      badge: 'Stream Mismatch (Requires MBBS/Health Sciences)',
      reason: 'Exclusively for MBBS, BDS, B.Pharm, and Nursing degrees. Current enrollment: Engineering / B.Tech.'
    }
  }

  // 6. Commerce & Management Specific (e.g. Aditya Birla UG)
  if (scheme.id === 'aditya-birla-ug' || (streams.includes('bcom') && !streams.includes('btech') && !streams.includes('general_ug'))) {
    if (studentProgram.includes('b.com') || studentProgram.includes('bba') || studentProgram.includes('commerce') || studentProgram.includes('economics')) {
      return { eligible: true, badge: 'Eligible (Commerce Degree Match)' }
    }
    return {
      eligible: false,
      badge: 'Stream Mismatch (Requires B.Com/BBA)',
      reason: 'Exclusively for Commerce, BBA, and Economics students. Current enrollment: B.Tech in CSE.'
    }
  }

  // 7. General UG, Engineering, B.Tech, Women in STEM (LIC, Tata, CSSS, Post-Matric, Top Class, Pragati)
  return {
    eligible: true,
    badge: 'Eligible (Degree & Level Match)'
  }
}

export default function SchemesPage({ 
  activeStudent, 
  lang, 
  onTriggerConflict, 
  onDirectApply,
  onSubmitAutofillApp
}) {
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [eligibilityFilter, setEligibilityFilter] = useState('ALL') // 'ALL' | 'ELIGIBLE_ONLY' | 'INELIGIBLE_ONLY'
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSchemeId, setExpandedSchemeId] = useState(null)
  const [autofillTargetScheme, setAutofillTargetScheme] = useState(null)
  const t = I18N[lang] || I18N.en

  const categories = [
    { id: 'ALL', label: 'All Schemes (16)' },
    { id: 'Central Sector', label: '🏛️ Central Govt & NSP' },
    { id: 'Corporate / CSR Grants', label: '🏢 Corporate & CSR Grants' },
    { id: 'Commerce', label: '📊 Commerce & Business (B.Com/BBA)' },
    { id: 'Pure Sciences', label: '🔬 Basic Sciences (B.Sc)' },
    { id: 'Medical', label: '🩺 Medical & Allied Health' },
    { id: 'Women in STEM', label: '👩‍🎓 Women in STEM' },
    { id: 'School Education', label: '🎒 School (Class 9–12)' },
    { id: 'Research & Innovation', label: '🎓 Ph.D & Fellowships' },
    { id: 'International Higher Education', label: '✈️ Study Abroad (Top 500)' }
  ]

  const evaluatedSchemes = SCHEMES.map(scheme => ({
    ...scheme,
    qualificationCheck: checkSchemeQualification(activeStudent, scheme)
  }))

  const filteredSchemes = evaluatedSchemes.filter(scheme => {
    const streams = scheme.applicableStreams || []
    const matchesCategory = filterCategory === 'ALL' || 
      scheme.category === filterCategory ||
      (filterCategory === 'Central Sector' && (scheme.portal === 'NSP' || scheme.category?.includes('Central'))) ||
      (filterCategory === 'Corporate / CSR Grants' && (scheme.category?.includes('Corporate') || scheme.verificationType === 'direct_provider')) ||
      (filterCategory === 'Commerce' && (streams.includes('bcom') || streams.includes('bba') || scheme.category?.includes('Commerce'))) ||
      (filterCategory === 'Pure Sciences' && (streams.includes('bsc') || scheme.category?.includes('Sciences'))) ||
      (filterCategory === 'Medical' && (streams.includes('mbbs') || scheme.category?.includes('Medical'))) ||
      (filterCategory === 'School Education' && (streams.includes('school') || scheme.category?.includes('School')))

    const q = searchQuery.toLowerCase().trim()
    const streamsText = (scheme.applicableStreams || []).join(' ').toLowerCase()
    const criteriaText = (scheme.eligibilityCriteria || []).join(' ').toLowerCase()
    const matchesQuery = !q ||
      scheme.name.toLowerCase().includes(q) ||
      scheme.description.toLowerCase().includes(q) ||
      scheme.shortName.toLowerCase().includes(q) ||
      scheme.targetGroup.toLowerCase().includes(q) ||
      scheme.category.toLowerCase().includes(q) ||
      scheme.portal.toLowerCase().includes(q) ||
      (scheme.verificationType || '').toLowerCase().includes(q) ||
      streamsText.includes(q) ||
      criteriaText.includes(q)

    const matchesEligibility = 
      eligibilityFilter === 'ALL' ||
      (eligibilityFilter === 'ELIGIBLE_ONLY' && scheme.qualificationCheck.eligible) ||
      (eligibilityFilter === 'INELIGIBLE_ONLY' && !scheme.qualificationCheck.eligible)
    
    return matchesCategory && matchesQuery && matchesEligibility
  })

  const handleApplyClick = (scheme) => {
    // If conflict engine flags multiple simultaneous grants
    const conflictResult = CONFLICT_RULES?.evaluateApplicationConflict 
      ? CONFLICT_RULES.evaluateApplicationConflict(activeStudent, scheme.id)
      : { hasConflict: false }

    if (conflictResult.hasConflict) {
      onTriggerConflict(scheme.id)
    } else {
      // Launch DigiLocker Zero-Touch Autofill Modal
      setAutofillTargetScheme(scheme)
    }
  }

  const handleAutofillSubmit = (appData) => {
    setAutofillTargetScheme(null)
    if (onSubmitAutofillApp) {
      onSubmitAutofillApp(appData)
    } else if (onDirectApply) {
      onDirectApply({ id: appData.schemeId, name: appData.schemeName })
    }
  }

  const toggleExpand = (id) => {
    setExpandedSchemeId(prev => prev === id ? null : id)
  }

  return (
    <div className="schemes-view fade-in">
      {/* Hero Discovery Header */}
      <section className="schemes-hero-card">
        <div className="hero-badge-row">
          <span className="badge badge-primary">
            <Sparkles size={13} /> Universal Financial Aid Directory
          </span>
          <span className="badge badge-digilocker">
            <ShieldCheck size={13} /> DigiLocker 1-Click Verification Enabled
          </span>
        </div>

        <h1 className="schemes-hero-heading">Explore National & Corporate Scholarships</h1>
        <p className="schemes-hero-sub">
          Unified scholarship gateway connecting students with Central Government, AICTE, state endowments, and premier philanthropic grants. Zero physical queues with instant cryptographic verification.
        </p>

        {/* Search & Category Filter Toolbar */}
        <div className="schemes-search-bar-wrap">
          <div className="search-input-box">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input 
              type="text" 
              placeholder="Search by scholarship title, engineering, medicine, degree level, or eligibility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="scheme-search-field"
              aria-label="Search scholarships by title, degree level, or eligibility"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Clear search input">×</button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-chips-row" role="tablist" aria-label="Scholarship categories">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-chip-btn ${filterCategory === cat.id ? 'active-chip' : ''}`}
              onClick={() => setFilterCategory(cat.id)}
              aria-pressed={filterCategory === cat.id}
              role="tab"
              aria-selected={filterCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Degree Match & Qualification Quick Filter */}
        <div className="eligibility-toggle-bar">
          <div className="filter-lead-text">
            <GraduationCap size={16} className="text-primary" />
            <span><strong>Student Qualification:</strong> {activeStudent?.educationLevel || 'Under-Graduate'} • {activeStudent?.academicProgram || 'B.Tech in CSE'}</span>
          </div>
          <div className="filter-btns-wrap" role="group" aria-label="Filter by Qualification Match">
            <button
              type="button"
              className={`eligibility-filter-btn ${eligibilityFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setEligibilityFilter('ALL')}
            >
              All Levels ({evaluatedSchemes.length})
            </button>
            <button
              type="button"
              className={`eligibility-filter-btn ${eligibilityFilter === 'ELIGIBLE_ONLY' ? 'active' : ''}`}
              onClick={() => setEligibilityFilter('ELIGIBLE_ONLY')}
            >
              <CheckCircle2 size={13} className="text-success" />
              <span>Eligible for My Level ({evaluatedSchemes.filter(s => s.qualificationCheck.eligible).length})</span>
            </button>
            <button
              type="button"
              className={`eligibility-filter-btn ${eligibilityFilter === 'INELIGIBLE_ONLY' ? 'active' : ''}`}
              onClick={() => setEligibilityFilter('INELIGIBLE_ONLY')}
            >
              <AlertCircle size={13} className="text-danger" />
              <span>Other Levels / Ineligible ({evaluatedSchemes.filter(s => !s.qualificationCheck.eligible).length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Results Header Count */}
      <div className="results-meta-bar">
        <span className="results-count-text">
          Showing <strong>{filteredSchemes.length}</strong> scholarship programs
          {eligibilityFilter === 'ELIGIBLE_ONLY' && ' (Filtered: Matched for Undergraduate Level)'}
          {eligibilityFilter === 'INELIGIBLE_ONLY' && ' (Filtered: Higher / Ineligible Qualifications)'}
        </span>
        <span className="real-time-sync-tag">
          <span className="sync-pulse" /> Live Portal Directives Active
        </span>
      </div>

      {/* Scholarships Grid */}
      <div className="schemes-cards-grid">
        {filteredSchemes.map(scheme => {
          const isExpanded = expandedSchemeId === scheme.id
          const hasActiveApp = activeStudent?.applications?.some(a => a.schemeId === scheme.id)
          const isEligible = scheme.qualificationCheck.eligible

          return (
            <div key={scheme.id} className="gov-card scheme-card">
              {/* Card Header Top */}
              <div className="scheme-card-header">
                <div className="scheme-badges-wrap">
                  {isEligible ? (
                    <span className="badge badge-success">
                      <CheckCircle2 size={12} /> {scheme.qualificationCheck.badge}
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      <AlertCircle size={12} /> {scheme.qualificationCheck.badge}
                    </span>
                  )}
                  {scheme.verificationType === 'direct_provider' ? (
                    <span className="badge badge-direct-provider" title="Direct Philanthropic/CSR Grant - Disbursed directly without institutional nodal desk approval">
                      <Building2 size={12} /> Direct to Foundation
                    </span>
                  ) : (
                    <span className="badge badge-college-approval" title="Government NSP/State Scheme - Requires verification by College AISHE Nodal Officer">
                      <Landmark size={12} /> College Verification
                    </span>
                  )}
                  <span className="badge badge-primary">{scheme.category}</span>
                  <span className="portal-code-tag">{scheme.portal}</span>
                </div>
                <div className="deadline-badge">
                  <Calendar size={13} />
                  <span>Deadline: {scheme.deadline}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="scheme-title-block">
                <h2 className="scheme-name">{scheme.name}</h2>
                <p className="scheme-desc">{scheme.description}</p>
              </div>

              {/* Ineligible Explanation Notice */}
              {!isEligible && (
                <div className="ineligible-reason-box">
                  <AlertCircle size={15} className="ineligible-icon" />
                  <span><strong>Qualification Note:</strong> {scheme.qualificationCheck.reason}</span>
                </div>
              )}

              {/* Highlight Metrics */}
              <div className="scheme-metrics-box">
                <div className="metric-cell">
                  <span className="metric-label">Financial Grant</span>
                  <span className="metric-val text-royal">{scheme.amountRange}</span>
                </div>
                <div className="metric-cell">
                  <span className="metric-label">Target Scholar Level</span>
                  <span className="metric-val">{scheme.targetGroup}</span>
                </div>
              </div>

              {/* Expandable Details Accordion */}
              {isExpanded && (
                <div className="scheme-expanded-details fade-in">
                  <div className="details-section">
                    <h4 className="details-title"><BookOpen size={14} /> Key Eligibility Rules</h4>
                    <ul className="criteria-list">
                      {scheme.eligibilityCriteria?.map((crit, idx) => (
                        <li key={idx}><CheckCircle2 size={13} className="text-success" /> <span>{crit}</span></li>
                      ))}
                    </ul>
                  </div>

                  <div className="details-section">
                    <h4 className="details-title"><ShieldCheck size={14} /> DigiLocker Synced Credentials</h4>
                    <div className="docs-chips-wrap">
                      {scheme.mandatoryDocuments?.map((doc, idx) => (
                        <span key={idx} className="doc-chip">
                          <CheckCircle2 size={12} className="text-success" /> {doc.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="scheme-card-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary details-toggle-btn"
                  onClick={() => toggleExpand(scheme.id)}
                >
                  <span>{isExpanded ? 'Hide Details' : 'View Guidelines'}</span>
                  {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {scheme.officialUrl && (
                  <a 
                    href={scheme.officialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary official-portal-btn"
                    title={`Visit official website: ${scheme.officialUrl}`}
                  >
                    <span>Official Portal</span>
                    <Globe size={13} />
                  </a>
                )}

                {!isEligible ? (
                  <button
                    type="button"
                    className="btn btn-ineligible"
                    disabled
                    title={scheme.qualificationCheck.reason}
                  >
                    <AlertCircle size={14} />
                    <span>Ineligible for Current Level</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`btn ${hasActiveApp ? 'btn-secondary' : 'btn-primary apply-action-btn'}`}
                    onClick={() => handleApplyClick(scheme)}
                  >
                    {hasActiveApp ? (
                      <>
                        <span>View Active Application</span>
                        <ArrowRight size={15} />
                      </>
                    ) : (
                      <>
                        <Zap size={15} className="zap-icon" />
                        <span>1-Click Apply</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* DigiLocker Zero-Touch Autofill Modal */}
      {autofillTargetScheme && (
        <AutofillModal
          scheme={autofillTargetScheme}
          student={activeStudent}
          lang={lang}
          onClose={() => setAutofillTargetScheme(null)}
          onSubmitApplication={handleAutofillSubmit}
        />
      )}
    </div>
  )
}
