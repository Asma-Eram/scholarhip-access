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

export default function SchemesPage({ 
  activeStudent, 
  lang, 
  onTriggerConflict, 
  onDirectApply,
  onSubmitAutofillApp
}) {
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSchemeId, setExpandedSchemeId] = useState(null)
  const [autofillTargetScheme, setAutofillTargetScheme] = useState(null)
  const t = I18N[lang] || I18N.en

  const categories = [
    { id: 'ALL', label: 'All Scholarships' },
    { id: 'Central Sector', label: 'Central Sector (Govt)' },
    { id: 'Women in STEM', label: 'Women in STEM' },
    { id: 'Research & Innovation', label: 'Research & Fellowships' },
    { id: 'Corporate / CSR Grants', label: 'Corporate & CSR Grants' },
    { id: 'International Higher Education', label: 'Study Abroad (Top 500)' },
    { id: 'Higher Secondary & College', label: 'Post-Matric & College' }
  ]

  const filteredSchemes = SCHEMES.filter(scheme => {
    const matchesCategory = filterCategory === 'ALL' || 
      scheme.category === filterCategory ||
      (filterCategory === 'Central Sector' && (scheme.portal === 'NSP' || scheme.category?.includes('Central')))

    const matchesQuery = 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.targetGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesQuery
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
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by scholarship title, engineering, medicine, degree level, or eligibility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="scheme-search-field"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-chips-row">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-chip-btn ${filterCategory === cat.id ? 'active-chip' : ''}`}
              onClick={() => setFilterCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Results Header Count */}
      <div className="results-meta-bar">
        <span className="results-count-text">
          Showing <strong>{filteredSchemes.length}</strong> verified scholarship programs
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

          return (
            <div key={scheme.id} className="gov-card scheme-card">
              {/* Card Header Top */}
              <div className="scheme-card-header">
                <div className="scheme-badges-wrap">
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
                      <span>1-Click Apply with DigiLocker</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
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
