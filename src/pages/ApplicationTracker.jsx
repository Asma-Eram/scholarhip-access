import { useState } from 'react'
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Banknote, 
  Building2, 
  Download, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  UserCheck,
  Phone,
  Mail,
  HelpCircle,
  Sparkles
} from 'lucide-react'
import { SCHEMES, I18N } from '../data/scholarshipData'
import { getLocalizedSchemes } from '../data/localizationEngine'
import { AISHE_DIRECTORY } from '../data/aisheData'
import './ApplicationTracker.css'

export default function ApplicationTracker({ 
  activeStudent, 
  lang,
  onResolveDeficiency,
  onDownloadSlip 
}) {
  const t = I18N[lang] || I18N.en
  const localizedSchemes = getLocalizedSchemes(SCHEMES, lang)
  const applications = activeStudent.applications || []
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || null)

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0]
  const schemeMeta = localizedSchemes.find(s => s.id === selectedApp?.schemeId) || {}

  const studentDisplayName = activeStudent.name

  // Resolve institute & nodal contact info
  const matchedCollege = AISHE_DIRECTORY.find(c => 
    selectedApp?.institution?.includes(c.name) || 
    activeStudent?.institution?.includes(c.name)
  ) || AISHE_DIRECTORY[0]

  if (!selectedApp) {
    return (
      <div className="gov-card empty-tracker-card">
        <Clock size={32} className="empty-icon" />
        <h3>{studentDisplayName} {t.noActiveApp || 'No Active Applications Found'}</h3>
        <p>{t.switchMemberOrExplore || 'Switch to another household member or explore all 5 schemes to apply.'}</p>
      </div>
    )
  }

  // Determine "What's Next" active guidance
  const activeStage = selectedApp.stages?.find(s => s.active) || 
    selectedApp.stages?.find(s => !s.done) || 
    selectedApp.stages?.[selectedApp.stages.length - 1]

  const isDisbursed = selectedApp.status === 'disbursed'
  const hasDeficiency = selectedApp.deficiencies?.length > 0 || selectedApp.status === 'action_required'

  return (
    <div className="tracker-view fade-in">
      <div className="tracker-header">
        <div>
          <h1 className="tracker-title">{t.trackerTitle || 'End-to-End Application & Verification Tracker'}</h1>
          <p className="tracker-sub">
            {t.trackerSub || 'Real-time synchronization across Institute, State Tribal Welfare Directorate, MoTA, and PFMS'}
          </p>
        </div>

        {/* Multi-Application Selector Tabs */}
        {applications.length > 1 && (
          <div className="app-select-pills">
            {applications.map(app => (
              <button 
                key={app.id}
                className={`app-pill-btn ${selectedApp.id === app.id ? 'active-app-pill' : ''}`}
                onClick={() => setSelectedAppId(app.id)}
              >
                <span>{app.portal}: {app.id}</span>
                <span className={`pill-dot ${app.status === 'disbursed' ? 'dot-success' : 'dot-warning'}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TRANSPARENT "WHAT'S NEXT" LIVE ACTION BANNER (PHASE 2) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={`gov-card whats-next-banner ${hasDeficiency ? 'banner-deficiency' : isDisbursed ? 'banner-disbursed' : 'banner-in-progress'}`}>
        <div className="whats-next-header-row">
          <div className="banner-icon-col">
            {hasDeficiency ? (
              <AlertTriangle size={24} className="text-warning-icon" />
            ) : isDisbursed ? (
              <CheckCircle2 size={24} className="text-success-icon" />
            ) : (
              <Clock size={24} className="text-primary-icon" />
            )}
          </div>

          <div className="banner-content-col">
            <div className="banner-label-row">
              <span className="whats-next-tag">
                {isDisbursed ? '✓ Application Cycle Complete' : hasDeficiency ? 'Action Required From Student' : 'Transparency Status & Next Step'}
              </span>
              <span className="eta-badge">
                <Calendar size={13} />
                <span>
                  {isDisbursed 
                    ? `Disbursed on ${selectedApp.lastActionDate}` 
                    : hasDeficiency 
                    ? 'Immediate Attention Required' 
                    : 'Expected Resolution: Within 4-6 Working Days'}
                </span>
              </span>
            </div>

            <h2 className="whats-next-heading">
              {isDisbursed
                ? `Scholarship Grant of ${selectedApp.sanctionAmount || 'Sanctioned Amount'} successfully credited via DBT.`
                : hasDeficiency
                ? `Deficiency Flagged: Action required to avoid delay in institutional verification.`
                : `Currently Processing: ${activeStage?.title || 'State Nodal Officer Review'}`}
            </h2>

            <p className="whats-next-desc">
              {isDisbursed ? (
                <>
                  Funds have been directly released by MoTA / PFMS into your Aadhaar-seeded bank account. Keep your UTR receipt for institutional fee submission records.
                </>
              ) : hasDeficiency ? (
                <>
                  Your College Nodal Officer or State Welfare Directorate has requested an updated document or clarification. Please re-verify via DigiLocker live sync below.
                </>
              ) : (
                <>
                  Your verified documents have been forwarded to <strong>{matchedCollege.name}</strong>. The Institutional Nodal Officer (<strong>{matchedCollege.nodalOfficer.name}</strong>) is verifying your bonafide roll enrollment and course fees. <strong>No action is required from you at this time.</strong>
                </>
              )}
            </p>

            {/* Nodal Officer Contact Bar */}
            {!isDisbursed && (
              <div className="nodal-contact-bar">
                <div className="nodal-officer-info">
                  <UserCheck size={14} className="text-muted" />
                  <span>Assigned Nodal Desk: <strong>{matchedCollege.nodalOfficer.name}</strong> ({matchedCollege.nodalOfficer.designation})</span>
                </div>
                <div className="nodal-contact-links">
                  <a href={`mailto:${matchedCollege.nodalOfficer.email}`} className="contact-link">
                    <Mail size={13} /> {matchedCollege.nodalOfficer.email}
                  </a>
                  <span className="contact-sep">•</span>
                  <span className="contact-phone">
                    <Phone size={13} /> {matchedCollege.nodalOfficer.phone}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tracker-layout-grid">
        {/* Left Column: Stage-by-Stage Verification Timeline */}
        <div className="tracker-main-col">
          <div className="gov-card timeline-card">
            <div className="timeline-header-row">
              <div>
                <span className="badge badge-primary">{selectedApp.portal}</span>
                <h2 className="timeline-scheme-title">{schemeMeta.name || selectedApp.schemeId}</h2>
                <div className="app-meta-code">{t.appId || 'Application ID:'} <strong>{selectedApp.id}</strong> ({t.session || 'Session'} {selectedApp.academicSession})</div>
              </div>
              <div className="timeline-status-tag">
                <span className={`badge ${selectedApp.status === 'disbursed' ? 'badge-success' : 'badge-warning'}`}>
                  {selectedApp.statusText}
                </span>
              </div>
            </div>

            {/* Stages Stack */}
            <div className="timeline-stages-stack">
              {selectedApp.stages.map((stage, idx) => {
                const isPassed = stage.done
                const isActive = stage.active
                const isPending = !stage.done && !stage.active

                return (
                  <div key={stage.id} className={`timeline-stage-item ${isPassed ? 'stage-passed' : isActive ? 'stage-active' : 'stage-pending'}`}>
                    <div className="stage-marker-col">
                      <div className="stage-node-circle">
                        {isPassed ? (
                          <CheckCircle2 size={16} />
                        ) : isActive ? (
                          <Clock size={16} />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      {idx < selectedApp.stages.length - 1 && <div className="stage-connector-line" />}
                    </div>

                    <div className="stage-content-col">
                      <div className="stage-title-row">
                        <h3 className="stage-name">{stage.title}</h3>
                        {stage.date && <span className="stage-date-text">{stage.date}</span>}
                      </div>

                      {stage.remarks && (
                        <p className="stage-remarks-text">{stage.remarks}</p>
                      )}

                      {isActive && (
                        <div className="active-stage-indicator">
                          <span className="pulse-ping" />
                          <span>{t.currentlyUnderProcess || 'Currently Under Verification at Institute Nodal Officer Desk'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Deficiencies Notice Card if Any */}
          {selectedApp.deficiencies?.length > 0 && (
            <div className="gov-card deficiency-resolution-card">
              <div className="def-card-top">
                <AlertTriangle size={20} className="def-warning-icon" />
                <div>
                  <h3 className="def-card-title">{t.incomeCertRequired || t.stateNodalQuery || 'Action Required: Document Verification'}</h3>
                  <p className="def-card-desc">{t.deficiencyDetail || 'The Institutional Nodal Officer requires verification of your current academic year documentation.'}</p>
                </div>
              </div>

              <div className="def-resolution-action">
                <button 
                  className="btn btn-warning"
                  onClick={() => onResolveDeficiency(selectedApp.id)}
                  aria-label="Re-verify via DigiLocker Live Sync"
                >
                  <ShieldCheck size={16} aria-hidden="true" />
                  <span>{t.reverifyDigilocker || 'Re-verify via DigiLocker Live Sync'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: PFMS DBT Payment Information & Sanction Order */}
        <div className="tracker-side-col">
          {/* DBT Disbursement Slip Card */}
          {selectedApp.dbtDetails ? (
            <div className="gov-card dbt-slip-card">
              <div className="dbt-slip-header">
                <Banknote size={20} className="dbt-icon" />
                <div>
                  <h3 className="dbt-title">{t.dbtRemittanceSlip || 'Direct Benefit Transfer (DBT) Receipt'}</h3>
                  <p className="dbt-sub">{t.pfmsVerified || 'PFMS Central Transaction Confirmed'}</p>
                </div>
              </div>

              <div className="dbt-data-stack">
                <div className="dbt-row">
                  <span className="dbt-label">{t.utrNumber || 'UTR / Transaction No:'}</span>
                  <span className="dbt-val mono">{selectedApp.dbtDetails.utrNumber}</span>
                </div>
                <div className="dbt-row">
                  <span className="dbt-label">{t.beneficiaryBank || 'Beneficiary Bank:'}</span>
                  <span className="dbt-val">{selectedApp.dbtDetails.bankName}</span>
                </div>
                <div className="dbt-row">
                  <span className="dbt-label">{t.accountCredited || 'Account Number:'}</span>
                  <span className="dbt-val mono">{selectedApp.dbtDetails.accountMasked}</span>
                </div>
                <div className="dbt-row">
                  <span className="dbt-label">{t.amountReleased || 'Amount Credited:'}</span>
                  <span className="dbt-val amount-highlight">{selectedApp.dbtDetails.amountCredited}</span>
                </div>
                <div className="dbt-row">
                  <span className="dbt-label">{t.creditDate || 'Credit Date:'}</span>
                  <span className="dbt-val">{selectedApp.dbtDetails.creditDate}</span>
                </div>
                <div className="dbt-row">
                  <span className="dbt-label">{t.pfmsSanctionId || 'Sanction Order No:'}</span>
                  <span className="dbt-val mono">{selectedApp.dbtDetails.pfmsSanctionId}</span>
                </div>
              </div>

              <button 
                className="btn btn-secondary btn-full dbt-download-btn"
                onClick={() => onDownloadSlip(selectedApp)}
                aria-label="Download PDF Sanction Receipt"
              >
                <Download size={15} aria-hidden="true" />
                <span>{t.downloadAcknowledgement || 'Download PDF Sanction Receipt'}</span>
              </button>
            </div>
          ) : (
            <div className="gov-card pending-dbt-card">
              <Building2 size={24} className="text-muted" />
              <h3>{t.disbursementPending || 'Disbursement Stage Awaiting Approval'}</h3>
              <p>
                {t.disbursementPendingDesc || 'Funds will be transferred directly to the Aadhaar-seeded bank account upon Stage 4 Central Committee Clearance.'}
              </p>
            </div>
          )}

          {/* Quick Helpline Support Box */}
          <div className="gov-card helpline-card">
            <h4><HelpCircle size={15} /> {t.needAssistance || 'Need Help with Verification?'}</h4>
            <p>{t.helplineDesc || 'Connect with the Tribal Welfare Toll-Free Grievance Cell or your institutional representative.'}</p>
            <div className="helpline-num">1800-11-7788 (Toll Free)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
