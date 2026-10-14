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
  Clock,
  Upload,
  FileText,
  Printer,
  FileCheck,
  Scan,
  RefreshCw,
  Landmark,
  Check
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
  const [activeMode, setActiveMode] = useState('digilocker') // 'digilocker' | 'manual'
  const [selectedAishe, setSelectedAishe] = useState('U-0205') // Default: NIT Jamshedpur
  const [rollNo, setRollNo] = useState(student.id === 'student_priya' ? '2023UGCS042' : student.id === 'student_birsa' ? 'EMRS-2024-IX-019' : '2025PGTRL008')
  const [consentGiven, setConsentGiven] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Manual Upload OCR state
  const [manualDocs, setManualDocs] = useState({
    income: { uploaded: false, fileName: '', certNo: '', amount: '', scanning: false },
    bonafide: { uploaded: false, fileName: '', institute: '', roll: '', scanning: false },
    marksheet: { uploaded: false, fileName: '', percentage: '', board: '', scanning: false },
    idProof: { uploaded: false, fileName: '', idNumber: '', scanning: false }
  })
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState('')

  const selectedCollege = AISHE_DIRECTORY.find(c => c.aisheCode === selectedAishe) || AISHE_DIRECTORY[0]
  const domicileDoc = DIGILOCKER_VAULT.find(d => d.id === 'DOC-DOM-01') || DIGILOCKER_VAULT[0]
  const incomeDoc = DIGILOCKER_VAULT.find(d => d.id === 'DOC-INC-03')
  const isDirectProvider = scheme.verificationType === 'direct_provider'

  // Simulate instant OCR extraction on file upload
  const handleSimulateUpload = (docType) => {
    setManualDocs(prev => ({
      ...prev,
      [docType]: { ...prev[docType], scanning: true }
    }))
    setOcrSuccessMsg('')

    setTimeout(() => {
      let extractedData = {}
      if (docType === 'income') {
        extractedData = {
          uploaded: true,
          fileName: 'Income_Certificate_Tehsildar.pdf',
          certNo: 'JH/INC/2026/902184',
          amount: '₹1,95,000 / annum',
          scanning: false
        }
      } else if (docType === 'bonafide') {
        extractedData = {
          uploaded: true,
          fileName: 'College_Bonafide_FeeReceipt.pdf',
          institute: selectedCollege.name,
          roll: rollNo || '2023UGCS042',
          scanning: false
        }
      } else if (docType === 'marksheet') {
        extractedData = {
          uploaded: true,
          fileName: 'Qualifying_Marksheet_Class12.pdf',
          percentage: '89.4%',
          board: 'CBSE Senior Secondary Board',
          scanning: false
        }
      } else if (docType === 'idProof') {
        extractedData = {
          uploaded: true,
          fileName: 'Aadhaar_National_ID.pdf',
          idNumber: 'XXXX-XXXX-4521',
          scanning: false
        }
      }

      setManualDocs(prev => ({
        ...prev,
        [docType]: extractedData
      }))
      setOcrSuccessMsg(`✨ OCR Vision Engine: Extracted valid credentials from ${docType.toUpperCase()} document (Confidence: 99.4%)`)
    }, 700)
  }

  const handleSimulateAllUploads = () => {
    handleSimulateUpload('income')
    handleSimulateUpload('bonafide')
    handleSimulateUpload('marksheet')
    handleSimulateUpload('idProof')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!consentGiven) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmitApplication({
        schemeId: scheme.id,
        schemeName: scheme.name,
        verificationType: scheme.verificationType || 'college',
        officialUrl: scheme.officialUrl || 'https://scholarships.gov.in',
        aisheCode: selectedCollege.aisheCode,
        collegeName: selectedCollege.name,
        rollNumber: rollNo,
        tuitionFeeClaim: selectedCollege.annualTuitionFee,
        studentId: student.id,
        studentName: student.name,
        apaarId: student.apaarId || 'APAAR-2023-JH-77192',
        digilockerSynced: activeMode === 'digilocker',
        applicationMode: activeMode,
        manualDocs: activeMode === 'manual' ? manualDocs : null
      })
    }, 900)
  }

  const handlePrintSlip = () => {
    window.print()
  }

  const modalContent = (
    <div className="autofill-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="autofill-scheme-title">
      <div className="autofill-modal-card fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Pinned Modal Header */}
        <div className="autofill-modal-header">
          <div className="header-badge-title">
            <div className="modal-top-badges">
              <span className="badge badge-success">
                <Sparkles size={12} aria-hidden="true" /> Real-World Scholarship Gateway
              </span>
              {isDirectProvider ? (
                <span className="badge badge-direct-provider">
                  <Building2 size={12} /> Direct Foundation Scheme
                </span>
              ) : (
                <span className="badge badge-college-approval">
                  <Landmark size={12} /> College Desk Verification Required
                </span>
              )}
            </div>
            <h2 id="autofill-scheme-title">{scheme.name}</h2>
            <p className="scheme-subtitle">
              Application for <strong>{student.name}</strong> • Scheme Code: <strong>{scheme.code || 'SCH-GATEWAY'}</strong>
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Dual Mode Application Switcher Tabs */}
        <div className="app-mode-tabs-row" role="tablist">
          <button 
            type="button" 
            role="tab"
            aria-selected={activeMode === 'digilocker'}
            className={`mode-tab-btn ${activeMode === 'digilocker' ? 'active-mode' : ''}`}
            onClick={() => setActiveMode('digilocker')}
          >
            <ShieldCheck size={16} className="tab-icon" />
            <div className="tab-label-wrap">
              <span className="tab-title">⚡ 1-Click DigiLocker Auto-Pull</span>
              <span className="tab-sub">Instant zero-paper pull from Aadhaar, ABC & e-District</span>
            </div>
          </button>

          <button 
            type="button" 
            role="tab"
            aria-selected={activeMode === 'manual'}
            className={`mode-tab-btn ${activeMode === 'manual' ? 'active-mode' : ''}`}
            onClick={() => setActiveMode('manual')}
          >
            <Upload size={16} className="tab-icon" />
            <div className="tab-label-wrap">
              <span className="tab-title">📁 Manual Certificate Upload</span>
              <span className="tab-sub">Upload PDF/JPG certificates with instant OCR Auto-Fill</span>
            </div>
          </button>
        </div>

        {/* Form Container with Scrollable Body and Pinned Footer */}
        <form onSubmit={handleSubmit} className="autofill-form-wrap">
          
          <div className="autofill-scroll-body">
            
            {/* Smart Routing Notice */}
            {isDirectProvider ? (
              <div className="workflow-notice-box direct-provider-box">
                <Building2 size={18} className="text-success flex-shrink-0" />
                <div className="notice-body">
                  <strong>Direct Philanthropic / Corporate Scheme:</strong>
                  <span> This grant is funded directly by <strong>{scheme.shortName || 'Foundation'}</strong>. Upon submission, your verified digital dossier goes straight to the Foundation Trust Scrutiny Committee. <strong>Institutional Nodal Officer approval is NOT required.</strong></span>
                </div>
              </div>
            ) : (
              <div className="workflow-notice-box college-approval-box">
                <Clock size={18} className="text-primary flex-shrink-0" />
                <div className="notice-body">
                  <strong>Level-1 Institutional Bonafide Mandatory:</strong>
                  <span> Under Central NSP & State scholarship regulations, this grant requires verification by your College Nodal Officer at <strong>{selectedCollege.name}</strong> before advancing to state/central disbursement.</span>
                </div>
              </div>
            )}

            {/* TAB 1: DIGILOCKER AUTO-PULL MODE */}
            {activeMode === 'digilocker' && (
              <div className="autofill-section">
                <div className="section-title-row">
                  <ShieldCheck size={18} className="sec-icon text-success" />
                  <h3>1. DigiLocker Cryptographically Verified Data</h3>
                  <span className="source-tag">Auto-Pulled & Verified</span>
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
            )}

            {/* TAB 2: MANUAL DOCUMENT UPLOAD & OCR EXTRACTION */}
            {activeMode === 'manual' && (
              <div className="autofill-section manual-upload-section">
                <div className="section-title-row">
                  <Upload size={18} className="sec-icon text-primary" />
                  <h3>1. Upload Supporting Certificates (PDF / JPG)</h3>
                  <span className="source-tag">Instant OCR Extraction</span>
                </div>

                <div className="manual-upload-preset-bar">
                  <p className="upload-guide-text">
                    Don’t have DigiLocker? Upload your scanned certificates below. Our AI OCR parser extracts the certificate numbers, income figures, and roll numbers directly.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-secondary load-preset-btn"
                    onClick={handleSimulateAllUploads}
                  >
                    <Scan size={14} />
                    <span>Auto-Attach Sample Certified Dossier</span>
                  </button>
                </div>

                {ocrSuccessMsg && (
                  <div className="ocr-alert-pill fade-in">
                    <CheckCircle2 size={15} />
                    <span>{ocrSuccessMsg}</span>
                  </div>
                )}

                <div className="upload-cards-grid">
                  {/* Income Certificate Upload */}
                  <div className={`doc-upload-card ${manualDocs.income.uploaded ? 'uploaded' : ''}`}>
                    <div className="doc-upload-header">
                      <FileText size={18} className="doc-type-icon" />
                      <div>
                        <div className="doc-title">Income Certificate (Tehsildar / SDO)</div>
                        <div className="doc-desc">Max 5MB • PDF, PNG, JPG</div>
                      </div>
                    </div>
                    {manualDocs.income.scanning ? (
                      <div className="upload-scanning-box">
                        <RefreshCw size={14} className="spin-icon" />
                        <span>OCR Scanning document...</span>
                      </div>
                    ) : manualDocs.income.uploaded ? (
                      <div className="upload-extracted-meta">
                        <span className="badge badge-success"><Check size={12} /> {manualDocs.income.fileName}</span>
                        <div className="meta-line"><strong>Cert No:</strong> {manualDocs.income.certNo}</div>
                        <div className="meta-line"><strong>Extracted Income:</strong> {manualDocs.income.amount}</div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="upload-dropzone-btn"
                        onClick={() => handleSimulateUpload('income')}
                      >
                        <Upload size={14} />
                        <span>Select or Drop Income File</span>
                      </button>
                    )}
                  </div>

                  {/* College Bonafide / Fee Receipt */}
                  <div className={`doc-upload-card ${manualDocs.bonafide.uploaded ? 'uploaded' : ''}`}>
                    <div className="doc-upload-header">
                      <FileCheck size={18} className="doc-type-icon" />
                      <div>
                        <div className="doc-title">College Bonafide / Fee Receipt</div>
                        <div className="doc-desc">Current Academic Year Fee Proof</div>
                      </div>
                    </div>
                    {manualDocs.bonafide.scanning ? (
                      <div className="upload-scanning-box">
                        <RefreshCw size={14} className="spin-icon" />
                        <span>OCR Scanning document...</span>
                      </div>
                    ) : manualDocs.bonafide.uploaded ? (
                      <div className="upload-extracted-meta">
                        <span className="badge badge-success"><Check size={12} /> {manualDocs.bonafide.fileName}</span>
                        <div className="meta-line"><strong>Roll No:</strong> {manualDocs.bonafide.roll}</div>
                        <div className="meta-line"><strong>Institute:</strong> {manualDocs.bonafide.institute}</div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="upload-dropzone-btn"
                        onClick={() => handleSimulateUpload('bonafide')}
                      >
                        <Upload size={14} />
                        <span>Select or Drop Fee Slip</span>
                      </button>
                    )}
                  </div>

                  {/* Marksheet Upload */}
                  <div className={`doc-upload-card ${manualDocs.marksheet.uploaded ? 'uploaded' : ''}`}>
                    <div className="doc-upload-header">
                      <FileText size={18} className="doc-type-icon" />
                      <div>
                        <div className="doc-title">Qualifying Marksheet / Transcript</div>
                        <div className="doc-desc">Class 12th or Previous Semester</div>
                      </div>
                    </div>
                    {manualDocs.marksheet.scanning ? (
                      <div className="upload-scanning-box">
                        <RefreshCw size={14} className="spin-icon" />
                        <span>OCR Scanning document...</span>
                      </div>
                    ) : manualDocs.marksheet.uploaded ? (
                      <div className="upload-extracted-meta">
                        <span className="badge badge-success"><Check size={12} /> {manualDocs.marksheet.fileName}</span>
                        <div className="meta-line"><strong>Aggregate:</strong> {manualDocs.marksheet.percentage}</div>
                        <div className="meta-line"><strong>Board:</strong> {manualDocs.marksheet.board}</div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="upload-dropzone-btn"
                        onClick={() => handleSimulateUpload('marksheet')}
                      >
                        <Upload size={14} />
                        <span>Select or Drop Marksheet</span>
                      </button>
                    )}
                  </div>

                  {/* National ID / Aadhaar */}
                  <div className={`doc-upload-card ${manualDocs.idProof.uploaded ? 'uploaded' : ''}`}>
                    <div className="doc-upload-header">
                      <ShieldCheck size={18} className="doc-type-icon" />
                      <div>
                        <div className="doc-title">National Identity / Aadhaar Card</div>
                        <div className="doc-desc">Government Issued Photo ID</div>
                      </div>
                    </div>
                    {manualDocs.idProof.scanning ? (
                      <div className="upload-scanning-box">
                        <RefreshCw size={14} className="spin-icon" />
                        <span>OCR Scanning document...</span>
                      </div>
                    ) : manualDocs.idProof.uploaded ? (
                      <div className="upload-extracted-meta">
                        <span className="badge badge-success"><Check size={12} /> {manualDocs.idProof.fileName}</span>
                        <div className="meta-line"><strong>Identity Ref:</strong> {manualDocs.idProof.idNumber}</div>
                        <div className="meta-line"><strong>Verified By:</strong> UIDAI Token Check</div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="upload-dropzone-btn"
                        onClick={() => handleSimulateUpload('idProof')}
                      >
                        <Upload size={14} />
                        <span>Select or Drop Identity Document</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: College & Academic Enrollment */}
            <div className="autofill-section">
              <div className="section-title-row">
                <Building2 size={18} className="sec-icon text-primary" />
                <h3>2. Institutional & Course Information</h3>
                <span className="source-tag">AISHE Directory Synced</span>
              </div>

              <div className="grid-2-col">
                <div className="field-group full-span">
                  <label>
                    Recognized Institution (AISHE Code)
                    {isDirectProvider && <span className="helper-pill">Reference for Direct Grant</span>}
                  </label>
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
                  <span className="sub-helper">
                    Institutional Nodal Desk: {selectedCollege.nodalOfficer.name} ({selectedCollege.nodalOfficer.email})
                  </span>
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
                  {isDirectProvider ? (
                    <>I certify that the {activeMode === 'digilocker' ? 'DigiLocker verified credentials' : 'uploaded scanned documents'} and APAAR academic records submitted are genuine and authorize direct transmission to the <strong>{scheme.shortName || 'Scholarship Foundation'}</strong> Scrutiny Board.</>
                  ) : (
                    <>I authorize ScholarBridge to forward my {activeMode === 'digilocker' ? 'DigiLocker verified certificates' : 'scanned certified documents'}, Aadhaar e-KYC token, and APAAR credentials to <strong>{selectedCollege.name}</strong> and Central Scholarship Directorate for Level-1 inspection and approval.</>
                  )}
                </span>
              </label>
            </div>

            {/* Printable Application Slip Summary (Visible for Printing or Quick Preview) */}
            <div className="print-summary-card">
              <div className="print-card-header">
                <Printer size={15} className="text-secondary" />
                <span>Certified Application Slip Preview</span>
              </div>
              <div className="print-card-content">
                <div className="slip-meta-grid">
                  <div><strong>Applicant:</strong> {student.name}</div>
                  <div><strong>Scheme:</strong> {scheme.shortName || scheme.name}</div>
                  <div><strong>Routing:</strong> {isDirectProvider ? 'Direct to Foundation Trust' : `College Desk (${selectedCollege.aisheCode})`}</div>
                  <div><strong>Verification Mode:</strong> {activeMode === 'digilocker' ? 'DigiLocker Zero-Touch Hash' : 'Verified Scanned OCR'}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Pinned Action Footer */}
          <div className="autofill-modal-footer">
            <div className="footer-left-actions">
              <button type="button" className="btn btn-secondary print-action-btn" onClick={handlePrintSlip}>
                <Printer size={15} />
                <span>Print Application Slip</span>
              </button>
            </div>
            
            <div className="footer-right-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary submit-autofill-btn"
                disabled={!consentGiven || isSubmitting}
              >
                {isSubmitting ? (
                  <span>Transmitting Application...</span>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>{isDirectProvider ? 'Submit Directly to Foundation' : 'Submit & Forward to College Desk'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent
}
