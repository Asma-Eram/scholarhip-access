import { useState } from 'react'
import { 
  GraduationCap, 
  Banknote, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  FileText, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react'
import { SCHEMES, I18N } from '../data/scholarshipData'
import './Dashboard.css'

export default function Dashboard({ 
  activeStudent, 
  household, 
  lang, 
  onNavigate, 
  onTriggerConflict, 
  onResolveDeficiency 
}) {
  const t = I18N[lang] || I18N.en

  const applications = activeStudent?.applications || []
  const primaryApp = applications[0] || null
  const totalDisbursed = applications.reduce((acc, app) => {
    if (app.dbtDetails?.amountCredited) {
      const num = parseInt(app.dbtDetails.amountCredited.replace(/[^0-9]/g, '')) || 0
      return acc + num
    }
    return acc
  }, 0)

  // Find if there is any pending action/deficiency
  const actionRequiredApp = applications.find(a => a.status === 'action_required' || a.deficiencies?.length > 0)

  // Smartly matched scholarships for the student's academic profile
  const matchedSchemes = SCHEMES.filter(s => {
    if (activeStudent?.educationLevel?.includes('College') || activeStudent?.academicProgram) {
      return ['aicte-pragati', 'csss', 'reliance-ug', 'top-class', 'pmrf'].includes(s.id)
    }
    return ['pre-matric', 'post-matric', 'csss'].includes(s.id)
  }).slice(0, 3)

  return (
    <div className="dashboard-view fade-in">
      {/* Top Welcome & Smart Action Banner */}
      <section className="dashboard-hero-banner">
        <div className="hero-content-col">
          <div className="hero-pills-row">
            <span className="badge badge-primary">
              <Sparkles size={12} /> ScholarBridge National Hub
            </span>
            <span className="badge badge-success">
              <ShieldCheck size={12} /> DigiLocker Verified Profile (5/5 Synced)
            </span>
            <span className="badge badge-neutral">
              APAAR: {activeStudent.apaarId || 'APAAR-2023-JH-77192'}
            </span>
          </div>

          <h1 className="hero-welcome-title">
            Welcome back, {activeStudent.name}!
          </h1>
          <p className="hero-welcome-sub">
            Enrolled in <strong>{activeStudent.academicProgram || 'Degree Program'}</strong> at <strong>{activeStudent.institution}</strong>. Your academic identity and credentials are cryptographically synchronized for zero-touch scholarship applications.
          </p>

          <div className="hero-actions-row">
            <button 
              className="btn btn-primary hero-btn"
              onClick={() => onNavigate('schemes')}
            >
              <Zap size={15} />
              <span>Explore All Scholarships ({SCHEMES.length})</span>
              <ArrowRight size={15} />
            </button>
            <button 
              className="btn btn-secondary hero-btn"
              onClick={() => onNavigate('eligibility')}
            >
              <Sparkles size={14} className="text-royal" />
              <span>Run Smart Eligibility Matcher</span>
            </button>
          </div>
        </div>

        <div className="hero-stats-card">
          <div className="stats-card-header">
            <span className="stats-card-label">Cumulative Disbursed Pool</span>
            <span className="stats-card-badge">PFMS DBT Confirmed</span>
          </div>
          <div className="stats-card-amount">
            {totalDisbursed > 0 ? `₹${totalDisbursed.toLocaleString('en-IN')}` : '₹48,820'}
          </div>
          <div className="stats-card-meta">
            <span>Directly remitted to Aadhaar-seeded Bank Account</span>
          </div>
          <button 
            className="stats-card-action-btn"
            onClick={() => onNavigate('tracker')}
          >
            <span>View Detailed Remittance Receipts</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Deficiency / Action Alert If Present */}
      {actionRequiredApp && (
        <div className="gov-card action-alert-card fade-in" role="alert" aria-live="polite">
          <div className="alert-icon-col">
            <AlertTriangle size={24} className="text-warning" aria-hidden="true" />
          </div>
          <div className="alert-content-col">
            <div className="alert-title-row">
              <h3 className="alert-heading">Immediate Action Required on Application {actionRequiredApp.id}</h3>
              <span className="badge badge-warning">Verification Query</span>
            </div>
            <p className="alert-desc">
              The Institutional Nodal Officer has raised an inquiry regarding your recent marksheets/fee receipt. One-click re-verify through DigiLocker to resolve this immediately without delay.
            </p>
          </div>
          <button 
            className="btn btn-warning resolve-btn"
            onClick={() => onResolveDeficiency(actionRequiredApp.id)}
            aria-label={`Resolve verification query for application ${actionRequiredApp.id} via DigiLocker`}
          >
            <ShieldCheck size={15} aria-hidden="true" />
            <span>1-Click Resolve via DigiLocker</span>
          </button>
        </div>
      )}

      {/* Key Metric KPI Cards */}
      <section className="kpi-cards-grid" aria-label="Key Scholarship Performance Indicators">
        <div 
          className="gov-card kpi-card" 
          onClick={() => onNavigate('tracker')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('tracker') }}
          aria-label={`Active Applications: ${applications.length} Submissions`}
        >
          <div className="kpi-icon-wrap bg-blue-subtle" aria-hidden="true">
            <Clock size={20} className="text-royal" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Applications</span>
            <span className="kpi-value">{applications.length} Submissions</span>
            <span className="kpi-subtext">Live audit trail & ETA</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" aria-hidden="true" />
        </div>

        <div 
          className="gov-card kpi-card" 
          onClick={() => onNavigate('schemes')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('schemes') }}
          aria-label={`Available Scholarships: ${SCHEMES.length} Active Grants`}
        >
          <div className="kpi-icon-wrap bg-green-subtle" aria-hidden="true">
            <Award size={20} className="text-success" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Available Scholarships</span>
            <span className="kpi-value">{SCHEMES.length} Active Grants</span>
            <span className="kpi-subtext">Central, STEM & Corporate</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" aria-hidden="true" />
        </div>

        <div 
          className="gov-card kpi-card" 
          onClick={() => onNavigate('documents')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('documents') }}
          aria-label="DigiLocker Synced Docs: 5 Documents Verified"
        >
          <div className="kpi-icon-wrap bg-indigo-subtle" aria-hidden="true">
            <ShieldCheck size={20} className="text-indigo" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">DigiLocker Synced Docs</span>
            <span className="kpi-value">5 Documents Verified</span>
            <span className="kpi-subtext">Aadhaar, Domicile, Income, Marks</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" aria-hidden="true" />
        </div>

        <div 
          className="gov-card kpi-card" 
          onClick={() => onNavigate('eligibility')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('eligibility') }}
          aria-label="Eligibility Shield: GFR Rule 11 Active"
        >
          <div className="kpi-icon-wrap bg-amber-subtle" aria-hidden="true">
            <Sparkles size={20} className="text-warning" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Eligibility Shield</span>
            <span className="kpi-value">GFR Rule 11 Active</span>
            <span className="kpi-subtext">Zero double-dipping conflict</span>
          </div>
          <ChevronRight size={16} className="kpi-arrow" aria-hidden="true" />
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="dashboard-columns-grid">
        {/* Left Column: Active Application Live Tracking Card */}
        <div className="dashboard-main-col">
          <div className="gov-card active-app-showcase-card">
            <div className="card-header-row">
              <div>
                <span className="card-eyebrow">ACTIVE APPLICATION STATUS</span>
                <h2 className="card-title">{primaryApp ? primaryApp.id : 'No Active Applications'}</h2>
              </div>
              {primaryApp && (
                <span className={`badge ${primaryApp.status === 'disbursed' ? 'badge-success' : 'badge-warning'}`}>
                  {primaryApp.status === 'disbursed' ? '✓ Disbursed via DBT' : 'Under Review'}
                </span>
              )}
            </div>

            {primaryApp ? (
              <div className="app-summary-body">
                <div className="app-meta-grid">
                  <div className="app-meta-item">
                    <span className="meta-label">Grant Program</span>
                    <span className="meta-val font-semibold">{primaryApp.portal || 'Central Scheme'}</span>
                  </div>
                  <div className="app-meta-item">
                    <span className="meta-label">Applied Session</span>
                    <span className="meta-val">{primaryApp.academicSession || '2026-27'}</span>
                  </div>
                  <div className="app-meta-item">
                    <span className="meta-label">Sanctioned Amount</span>
                    <span className="meta-val font-bold text-royal">{primaryApp.sanctionAmount}</span>
                  </div>
                  <div className="app-meta-item">
                    <span className="meta-label">Current Node</span>
                    <span className="meta-val font-medium">{primaryApp.statusText}</span>
                  </div>
                </div>

                {/* Mini 5-Stage Stepper Preview */}
                <div className="mini-stepper-box">
                  <div className="mini-stepper-label-row">
                    <span className="stepper-title">Verification Audit Progression</span>
                    <span className="stepper-pct">
                      {primaryApp.stages?.filter(s => s.done).length || 0} / 5 Milestones Passed
                    </span>
                  </div>
                  <div className="stepper-track-bar">
                    <div 
                      className="stepper-track-fill" 
                      style={{ 
                        width: `${((primaryApp.stages?.filter(s => s.done).length || 0) / 5) * 100}%` 
                      }} 
                    />
                  </div>
                </div>

                <div className="card-actions-row">
                  <button 
                    className="btn btn-secondary full-width"
                    onClick={() => onNavigate('tracker')}
                  >
                    <span>Open Real-Time Transparency Audit</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-app-state">
                <GraduationCap size={36} className="text-muted" />
                <h3>No Applications in Progress</h3>
                <p>Browse our catalog of verified national and corporate scholarships and apply in 30 seconds using DigiLocker.</p>
                <button className="btn btn-primary" onClick={() => onNavigate('schemes')}>
                  Browse All Scholarships
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recommended Opportunities & Quick Links */}
        <div className="dashboard-side-col">
          <div className="gov-card recommended-schemes-card">
            <div className="card-header-row">
              <div>
                <span className="card-eyebrow">MATCHED FOR YOUR PROFILE</span>
                <h3 className="card-title">Top Scholarships</h3>
              </div>
              <button className="view-all-link" onClick={() => onNavigate('schemes')}>
                View All <ArrowRight size={12} />
              </button>
            </div>

            <div className="mini-schemes-list">
              {matchedSchemes.map(scheme => (
                <div 
                  key={scheme.id} 
                  className="mini-scheme-item"
                  onClick={() => onNavigate('schemes')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('schemes') }}
                  aria-label={`View details for ${scheme.name}`}
                >
                  <div className="mini-scheme-top">
                    <span className="mini-scheme-portal">{scheme.portal}</span>
                    <span className="mini-scheme-deadline">Due: {scheme.deadline}</span>
                  </div>
                  <h4 className="mini-scheme-title">{scheme.name}</h4>
                  <div className="mini-scheme-amount">
                    <Banknote size={13} className="text-royal" aria-hidden="true" />
                    <span>{scheme.amountRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zero-Touch Transparency Pipeline Showcase */}
      <section className="gov-card transparency-banner-card" aria-label="Zero-Touch Transparency Architecture">
        <div className="transparency-header">
          <div className="transparency-title-group">
            <span className="badge badge-digilocker">
              <ShieldCheck size={13} aria-hidden="true" />
              <span>DigiLocker Zero-Touch Pipeline</span>
            </span>
            <h3 className="transparency-heading">Cryptographic Verification & GFR Rule 11 Audit Trail</h3>
          </div>
          <span className="transparency-sla-badge">Automated SLA: &lt; 72 Hours</span>
        </div>

        <div className="transparency-steps-grid">
          <div className="transparency-step-item">
            <div className="step-num-bubble" aria-hidden="true">01</div>
            <div className="step-content">
              <h4 className="step-title">DigiLocker Direct Pull</h4>
              <p className="step-desc">Aadhaar e-KYC, income certificate, and Class X/XII marksheets authenticated via cryptographic XML hash.</p>
            </div>
          </div>
          <div className="transparency-step-item">
            <div className="step-num-bubble" aria-hidden="true">02</div>
            <div className="step-content">
              <h4 className="step-title">AISHE Nodal Verification</h4>
              <p className="step-desc">Bonafide enrollment & tuition fee claims verified in 1-click by College Institutional Nodal Officers.</p>
            </div>
          </div>
          <div className="transparency-step-item">
            <div className="step-num-bubble" aria-hidden="true">03</div>
            <div className="step-content">
              <h4 className="step-title">PFMS DBT Remittance</h4>
              <p className="step-desc">Direct Benefit Transfer routed straight to Aadhaar-seeded NPCI bank account with immutable UTR receipts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
