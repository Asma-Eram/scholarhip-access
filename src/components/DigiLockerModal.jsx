import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Lock, 
  FileCheck, 
  QrCode, 
  Building2, 
  ExternalLink,
  Fingerprint
} from 'lucide-react'
import './DigiLockerModal.css'

export default function DigiLockerModal({
  isOpen,
  onClose,
  application,
  student,
  lang = 'en',
  onConfirmResolution
}) {
  const [step, setStep] = useState(1) // 1: Overview, 2: In-Progress Sync, 3: Verified Result
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setIsSyncing(false)
      setActiveStepIndex(0)
    }
  }, [isOpen])

  if (!isOpen || !application) return null

  const isHindi = lang === 'hi'

  const deficiency = application.deficiencies?.[0] || {
    id: 'DEF-INC-01',
    message: isHindi 
      ? 'सत्र 2025-26 के लिए अद्यतन वार्षिक पारिवारिक आय प्रमाण पत्र डिजिटल मुहर के साथ प्रस्तुत करें।'
      : 'Updated FY 2025-26 Annual Parental Income Certificate requested with valid digital seal.'
  }

  const VERIFICATION_STEPS = [
    {
      title: isHindi ? 'आधार बायोमेट्रिक एवं ई-केवाईसी सत्यापन' : 'Aadhaar Biometric & e-KYC Verification',
      detail: isHindi ? `आधार कार्ड: ${student?.aadhaarMasked || 'XXXX-XXXX-4521'} • नाम: ${student?.name}` : `Aadhaar: ${student?.aadhaarMasked || 'XXXX-XXXX-4521'} • Name: ${student?.name}`
    },
    {
      title: isHindi ? 'राज्य ई-डिस्ट्रिक्ट एवं राजस्व सर्वर से पूछताछ' : 'Querying State e-District & Revenue Registry',
      detail: isHindi ? 'झारखंड डिजिटल ई-प्रमाणपत्र रिपोजिटरी (API v2.4)' : 'State Digital e-Certificates Repository (API v2.4)'
    },
    {
      title: isHindi ? 'क्रिप्टोग्राफिक SHA-256 डिजिटल हस्ताक्षर जांच' : 'Cryptographic SHA-256 Hash & Digital Signature Check',
      detail: isHindi ? 'सक्षम अधिकारी (SDM / तहसीलदार) द्वारा हस्ताक्षरित' : 'Certified by Competent Authority (SDM / Tehsildar)'
    },
    {
      title: isHindi ? 'एनपीसीआई डीबीटी मैपर एवं छात्रवृत्ति अनुपालन' : 'NPCI DBT Mapper & Scholarship Compliance',
      detail: isHindi ? 'खाता आधार से सक्रिय रूप से लिंक है' : 'Bank account active and Aadhaar seeded for DBT'
    }
  ]

  const handleStartVerification = () => {
    setStep(2)
    setIsSyncing(true)
    setActiveStepIndex(0)

    // Simulate animated step-by-step verification
    const timer1 = setTimeout(() => setActiveStepIndex(1), 600)
    const timer2 = setTimeout(() => setActiveStepIndex(2), 1200)
    const timer3 = setTimeout(() => setActiveStepIndex(3), 1800)
    const timer4 = setTimeout(() => {
      setIsSyncing(false)
      setStep(3)
    }, 2400)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }

  const handleApplyResolution = () => {
    onConfirmResolution(application.id)
    onClose()
  }

  return createPortal(
    <div className="digilocker-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="digilocker-modal-card fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Official DigiLocker Header */}
        <div className="digilocker-modal-header">
          <div className="digilocker-brand-row">
            <div className="digilocker-emblem-badge">
              <ShieldCheck size={22} className="shield-icon" />
            </div>
            <div>
              <div className="digilocker-brand-title">DigiLocker</div>
              <div className="digilocker-brand-sub">
                {isHindi ? 'राष्ट्रीय ई-गवर्नेंस प्रभाग (NeGD) • इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी मंत्रालय' : 'National e-Governance Division (NeGD) • Ministry of Electronics & IT'}
              </div>
            </div>
          </div>
          <button className="digilocker-close-btn" onClick={onClose} aria-label="Close DigiLocker verification">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="digilocker-modal-body">
          {step === 1 && (
            <div className="digilocker-step-overview">
              <div className="deficiency-notice-box">
                <div className="deficiency-notice-header">
                  <AlertTriangle size={16} className="warning-icon" />
                  <span>{isHindi ? 'कार्रवाई आवश्यक: नोडल अधिकारी द्वारा अनुरोधित' : 'Action Required: Flagged by Nodal Officer'}</span>
                </div>
                <div className="deficiency-notice-body">
                  <strong>{isHindi ? 'आवेदन संख्या:' : 'Application ID:'}</strong> {application.id}
                  <p className="deficiency-msg">{deficiency.message}</p>
                </div>
              </div>

              <div className="digilocker-doc-info">
                <div className="doc-info-title">
                  <FileCheck size={18} />
                  <span>{isHindi ? 'डिज़िलॉकर में उपलब्ध मान्य दस्तावेज़:' : 'Available Verified Document in DigiLocker Vault:'}</span>
                </div>
                <div className="doc-preview-pill">
                  <div className="doc-pill-left">
                    <span className="doc-type-badge">CERT-INC-2026</span>
                    <strong>{isHindi ? 'वार्षिक पारिवारिक आय प्रमाण पत्र (2025-26)' : 'Annual Parental Income Certificate (FY 2025-26)'}</strong>
                    <span className="doc-issuer">{isHindi ? 'जारीकर्ता: राजस्व विभाग, झारखंड सरकार' : 'Issuer: Revenue Department, Govt of Jharkhand'}</span>
                  </div>
                  <div className="doc-pill-right">
                    <span className="badge badge-success">
                      <CheckCircle2 size={12} /> {isHindi ? 'डिजिटल रूप से हस्ताक्षरित' : 'Digitally Signed'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="digilocker-consent-note">
                <Lock size={14} />
                <span>
                  {isHindi 
                    ? 'आप डिज़िलॉकर को अपने सत्यापित आय प्रमाण पत्र को सीधे राज्य नोडल अधिकारी को सुरक्षित क्रिप्टोग्राफिक टोकन के साथ साझा करने की सहमति दे रहे हैं।' 
                    : 'You authorize DigiLocker to share your digitally verified income certificate directly with the State Nodal Officer via secure cryptographic token.'}
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="digilocker-syncing-state">
              <div className="sync-spinner-center">
                <RefreshCw size={36} className="spinning-sync" />
              </div>
              <h3 className="sync-title">
                {isHindi ? 'डिजिलॉकर क्रिप्टोग्राफिक सत्यापन जारी है...' : 'Verifying Credentials via National DigiLocker API...'}
              </h3>
              <p className="sync-subtitle">
                {isHindi ? 'सरकारी रिपोजिटरी से डिजिटल हस्ताक्षर की पुष्टि की जा रही है' : 'Validating SHA-256 hash against official government registries'}
              </p>

              <div className="verification-stepper">
                {VERIFICATION_STEPS.map((st, idx) => {
                  const isDone = idx < activeStepIndex
                  const isCurrent = idx === activeStepIndex
                  return (
                    <div key={idx} className={`stepper-row ${isDone ? 'done' : isCurrent ? 'current' : 'pending'}`}>
                      <div className="stepper-circle">
                        {isDone ? <CheckCircle2 size={14} /> : isCurrent ? <RefreshCw size={14} className="spinning-sync" /> : idx + 1}
                      </div>
                      <div className="stepper-text">
                        <div className="stepper-title">{st.title}</div>
                        <div className="stepper-detail">{st.detail}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="digilocker-verified-result">
              <div className="success-banner-box">
                <CheckCircle2 size={32} className="success-icon-large" />
                <h3>{isHindi ? 'सत्यापन सफलतापूर्वक पूर्ण हुआ!' : 'Cryptographic Verification Passed!'}</h3>
                <p>
                  {isHindi 
                    ? 'दस्तावेज़ की प्रामाणिकता डिजिटल रूप से सिद्ध हो चुकी है। यह प्रमाणपत्र सीधे आपके छात्रवृत्ति आवेदन से लिंक कर दिया गया है।'
                    : 'The authenticity of your document is verified with NeGD digital signature and linked to your scholarship application.'}
                </p>
              </div>

              {/* Digital Certificate Receipt Card */}
              <div className="cert-preview-card">
                <div className="cert-card-header">
                  <div className="cert-header-left">
                    <Fingerprint size={16} />
                    <span>{isHindi ? 'डिजिलॉकर ई-सत्यापित प्रमाणपत्र' : 'DigiLocker e-Verified Record'}</span>
                  </div>
                  <span className="cert-valid-tag">{isHindi ? 'वैध एवं प्रमाणित' : 'Valid & Certified'}</span>
                </div>

                <div className="cert-grid">
                  <div className="cert-item">
                    <span className="lbl">{isHindi ? 'प्रमाणपत्र संख्या:' : 'Certificate No:'}</span>
                    <strong className="val">JH/INC/2026/009182</strong>
                  </div>
                  <div className="cert-item">
                    <span className="lbl">{isHindi ? 'लाभार्थी नाम:' : 'Beneficiary Name:'}</span>
                    <strong className="val">{student?.name || 'Ananya Sharma'}</strong>
                  </div>
                  <div className="cert-item">
                    <span className="lbl">{isHindi ? 'वार्षिक पारिवारिक आय:' : 'Annual Family Income:'}</span>
                    <strong className="val">₹2,10,000 / annum</strong>
                  </div>
                  <div className="cert-item">
                    <span className="lbl">{isHindi ? 'जारीकर्ता प्राधिकरण:' : 'Issuing Authority:'}</span>
                    <strong className="val">{isHindi ? 'उप-विभागीय मजिस्ट्रेट (SDM)' : 'Sub-Divisional Magistrate (SDM)'}</strong>
                  </div>
                </div>

                <div className="cert-stamp-footer">
                  <div className="cert-hash">
                    <QrCode size={36} />
                    <div>
                      <div className="hash-lbl">SHA-256 Digital Fingerprint</div>
                      <code className="hash-code">e7b9...4a12 (NeGD Verified)</code>
                    </div>
                  </div>
                  <div className="cert-dbt-ready">
                    <ShieldCheck size={16} color="var(--success-600)" />
                    <span>{isHindi ? 'डीबीटी भुगतान हेतु पात्र' : 'DBT Payment Compliant'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="digilocker-modal-footer">
          {step === 1 && (
            <>
              <button className="btn btn-secondary" onClick={onClose}>
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button className="btn btn-primary btn-digilocker-cta" onClick={handleStartVerification}>
                <ShieldCheck size={16} />
                <span>{isHindi ? 'डिज़िलॉकर लाइव सिंक से सत्यापित करें' : 'Verify & Sync via DigiLocker'}</span>
              </button>
            </>
          )}

          {step === 2 && (
            <button className="btn btn-secondary" disabled>
              <RefreshCw size={14} className="spinning-sync" />
              <span>{isHindi ? 'सत्यापन प्रगति पर है...' : 'Verifying with NeGD Server...'}</span>
            </button>
          )}

          {step === 3 && (
            <>
              <button className="btn btn-secondary" onClick={onClose}>
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
              <button className="btn btn-primary btn-digilocker-cta" onClick={handleApplyResolution}>
                <CheckCircle2 size={16} />
                <span>{isHindi ? 'स्वीकृति भेजें एवं आपत्ति समाप्त करें' : 'Resolve Deficiency & Resume State Review'}</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>,
    document.body
  )
}
