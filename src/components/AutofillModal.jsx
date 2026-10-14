import { useState } from 'react'
import { createPortal } from 'react-dom'
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  AlertCircle, 
  ArrowRight, 
  X,
  Sparkles,
  Lock,
  Clock
} from 'lucide-react'
import { DIGILOCKER_VAULT } from '../data/scholarshipData'
import { AISHE_DIRECTORY } from '../data/aisheData'
import './AutofillModal.css'

export default function AutofillModal({ 
  scheme, 
  student, 
  lang, 
  onClose, 
  onSubmitApplication 
}) {
  const [selectedAishe, setSelectedAishe] = useState('U-0205') // Default: NIT Jamshedpur
  const [rollNo, setRollNo] = useState(student.id === 'student_priya' ? '2023UGCS042' : student.id === 'student_birsa' ? 'EMRS-2024-IX-019' : '2025PGTRL008')
  const [consentGiven, setConsentGiven] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCollege = AISHE_DIRECTORY.find(c => c.aisheCode === selectedAishe) || AISHE_DIRECTORY[0]
  const domicileDoc = DIGILOCKER_VAULT.find(d => d.id === 'DOC-DOM-01') || DIGILOCKER_VAULT[0]
  const incomeDoc = DIGILOCKER_VAULT.find(d => d.id === 'DOC-INC-03')
  const apaarDoc = DIGILOCKER_VAULT.find(d => d.id === 'DOC-APAAR-05')
  const aadhaarDoc = DIGILOCKER_VAULT.find(d => d.id === 'DOC-AADHAAR-02')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!consentGiven) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmitApplication({
        schemeId: scheme.id,
        schemeName: scheme.name,
        aisheCode: selectedCollege.aisheCode,
        collegeName: selectedCollege.name,
        rollNumber: rollNo,
        tuitionFeeClaim: selectedCollege.annualTuitionFee,
        studentId: student.id,
        studentName: student.name,
        apaarId: student.apaarId || 'APAAR-2023-JH-77192',
        digilockerSynced: true
      })
    }, 900)
  }

  const modalContent = (
    <div className="autofill-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="autofill-scheme-title">
      <div className="autofill-modal-card fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Pinned Modal Header */}
        <div className="autofill-modal-header">
          <div className="header-badge-title">
            <span className="badge badge-success">
              <Sparkles size={12} aria-hidden="true" /> DigiLocker Zero-Touch Autofill
            </span>
            <h2 id="autofill-scheme-title">{scheme.name}</h2>
            <p className="scheme-subtitle">
              Application for <strong>{student.name}</strong> • Scheme Code: <strong>{scheme.code || 'SCH-GATEWAY'}</strong>
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Form Container with Scrollable Body and Pinned Footer */}
        <form onSubmit={handleSubmit} className="autofill-form-wrap">
          
          <div className="autofill-scroll-body">
            {/* Direct Workflow Notice */}
            <div className="workflow-notice-box">
              <Clock size={16} className="text-primary" />
              <span>
                <strong>Zero-Touch Verification:</strong> Submitting will automatically generate your certified digital application and forward it to <strong>{selectedCollege.name} Nodal Desk</strong> for Level-1 Bonafide inspection and approval.
              </span>
            </div>

            {/* Section 1: DigiLocker Verified Identity */}
            <div className="autofill-section">
              <div className="section-title-row">
                <ShieldCheck size={18} className="sec-icon text-success" />
                <h3>1. DigiLocker & Identity Verified Data</h3>
                <span className="source-tag">Auto-Pulled & Cryptographically Verified</span>
              </div>

              <div className="grid-2-col">
                <div className="field-group">
                  <label>Applicant Full Name</label>
                  <div className="verified-input-wrapper">
                    <input type="text" value={student.name} readOnly />
                    <CheckCircle2 size={16} className="valid-chk" />
                  </div>
                </div>

                <div className="field-group">
                  <label>Aadhaar e-KYC (Linked to NPCI DBT)</label>
                  <div className="verified-input-wrapper">
                    <input type="text" value={student.aadhaarMasked || 'XXXX-XXXX-4521'} readOnly />
                    <CheckCircle2 size={16} className="valid-chk" />
                  </div>
                </div>

                <div className="field-group">
                  <label>State Domicile Certificate Ref.</label>
                  <div className="verified-input-wrapper">
                    <input type="text" value={`${domicileDoc?.certNumber || 'JH/DOM/2024/491028'} (DigiLocker Synced)`} readOnly />
                    <CheckCircle2 size={16} className="valid-chk" />
                  </div>
                  <span className="sub-helper">Issuing Authority: {domicileDoc?.issuer || 'State Revenue / e-District'}</span>
                </div>

                <div className="field-group">
                  <label>Parental Income Certificate</label>
                  <div className="verified-input-wrapper">
                    <input type="text" value={`${incomeDoc?.certNumber || 'JH/INC/2025/110482'} (₹1,85,000/yr)`} readOnly />
                    <CheckCircle2 size={16} className="valid-chk" />
                  </div>
                  <span className="sub-helper">Within &le; ₹2.50L Central Guideline Cap</span>
                </div>
              </div>
            </div>

            {/* Section 2: College & Academic Enrollment */}
            <div className="autofill-section">
              <div className="section-title-row">
                <Building2 size={18} className="sec-icon text-primary" />
                <h3>2. Institutional & Course Information</h3>
                <span className="source-tag">AISHE Directory Synced</span>
              </div>

              <div className="grid-2-col">
                <div className="field-group full-span">
                  <label>Recognized Institution (AISHE Code)</label>
                  <select 
                    value={selectedAishe} 
                    onChange={(e) => setSelectedAishe(e.target.value)}
                    className="college-select"
                  >
                    {AISHE_DIRECTORY.map(c => (
                      <option key={c.aisheCode} value={c.aisheCode}>
                        {c.name} ({c.aisheCode} - {c.state})
                      </option>
                    ))}
                  </select>
                  <span className="sub-helper">Institutional Nodal Officer: {selectedCollege.nodalOfficer.name} ({selectedCollege.nodalOfficer.email})</span>
                </div>

                <div className="field-group">
                  <label>Institutional Roll / Registration No.</label>
                  <input 
                    type="text" 
                    value={rollNo} 
                    onChange={(e) => setRollNo(e.target.value)}
                    required 
                    className="editable-input"
                  />
                </div>

                <div className="field-group">
                  <label>APAAR / ABC Academic ID</label>
                  <div className="verified-input-wrapper">
                    <input type="text" value={student.apaarId || 'APAAR-2023-JH-77192'} readOnly />
                    <CheckCircle2 size={16} className="valid-chk" />
                  </div>
                </div>

                <div className="field-group full-span highlight-box">
                  <div className="box-row">
                    <div>
                      <strong>Standard Verified Tuition Fee:</strong> {selectedCollege.annualTuitionFee}
                    </div>
                    <div>
                      <strong>Institute Category:</strong> {selectedCollege.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Student Consent & Anti-Fraud Declarations */}
            <div className="consent-box">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={consentGiven} 
                  onChange={(e) => setConsentGiven(e.target.checked)} 
                />
                <span>
                  I authorize ScholarBridge to forward my DigiLocker verified certificates, Aadhaar e-KYC token, and APAAR academic credentials to <strong>{selectedCollege.name}</strong> and Central Scholarship Directorate for Level-1 automated inspection and approval.
                </span>
              </label>
            </div>
          </div>

          {/* Pinned Action Footer */}
          <div className="autofill-modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary submit-autofill-btn"
              disabled={!consentGiven || isSubmitting}
            >
              {isSubmitting ? (
                <span>Forwarding to Institute Desk...</span>
              ) : (
                <>
                  <Lock size={15} />
                  <span>One-Click Verify & Submit Application</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent
}
