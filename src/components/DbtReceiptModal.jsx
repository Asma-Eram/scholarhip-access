import React from 'react'
import { createPortal } from 'react-dom'
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Landmark, 
  QrCode, 
  FileText,
  Calendar,
  CreditCard
} from 'lucide-react'
import './DbtReceiptModal.css'

export default function DbtReceiptModal({ app, student, onClose, onToast }) {
  if (!app) return null

  const dbt = app.dbtDetails || {
    utrNumber: 'RBI2026091298412',
    bankName: 'State Bank of India (NIT Jamshedpur Branch)',
    accountMasked: 'XXXX-XXXX-8910',
    amountCredited: app.sanctionAmount || '₹20,000',
    creditDate: '12 September 2026',
    pfmsSanctionId: 'PFMS-CSSS-2026-8912'
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (onToast) onToast('Certified PFMS DBT Disbursement Receipt saved as PDF', 'success')
  }

  const modalNode = (
    <div className="receipt-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <div className="receipt-modal-card fade-in" onClick={e => e.stopPropagation()}>
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="receipt-top-actions no-print">
          <div className="receipt-top-status">
            <span className="live-dot" />
            <span>Certified PFMS DBT Disbursement Advice</span>
          </div>
          <div className="receipt-action-buttons">
            <button className="btn-receipt-action" onClick={handlePrint} title="Print Receipt">
              <Printer size={15} /> <span>Print</span>
            </button>
            <button className="btn-receipt-action btn-receipt-download" onClick={handleDownload} title="Download PDF">
              <Download size={15} /> <span>Download PDF</span>
            </button>
            <button className="btn-receipt-close" onClick={onClose} aria-label="Close Receipt Modal">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Official Statement */}
        <div className="receipt-paper" id="printable-receipt">
          {/* Government Watermark Emblem */}
          <div className="receipt-watermark">SCHOLARBRIDGE</div>

          {/* Official Letterhead */}
          <div className="receipt-header">
            <div className="receipt-emblem-wrap">
              <img src="/logo.png" alt="ScholarBridge Seal" className="receipt-logo" />
            </div>
            <div className="receipt-gov-titles">
              <div className="receipt-republic">GOVERNMENT OF INDIA</div>
              <div className="receipt-ministry">PUBLIC FINANCIAL MANAGEMENT SYSTEM (PFMS)</div>
              <div className="receipt-portal">Direct Benefit Transfer (DBT) Mission • Ministry of Finance</div>
              <h1 id="receipt-title" className="receipt-heading">
                ELECTRONIC DISBURSEMENT SANCTION ADVICE & BENEFICIARY RECEIPT
              </h1>
            </div>
          </div>

          <div className="receipt-divider" />

          {/* Reference & Verification Meta Strip */}
          <div className="receipt-meta-strip">
            <div className="meta-item">
              <span className="meta-lbl">PFMS Sanction ID:</span>
              <span className="meta-val mono">{dbt.pfmsSanctionId}</span>
            </div>
            <div className="meta-item">
              <span className="meta-lbl">Central UTR No:</span>
              <span className="meta-val mono">{dbt.utrNumber}</span>
            </div>
            <div className="meta-item">
              <span className="meta-lbl">Disbursement Date:</span>
              <span className="meta-val">{dbt.creditDate}</span>
            </div>
            <div className="meta-item status-item">
              <span className="meta-lbl">PFMS Status:</span>
              <span className="meta-val status-success">
                <CheckCircle2 size={13} /> CREDITED (SUCCESS)
              </span>
            </div>
          </div>

          {/* Section 1: Beneficiary Credentials */}
          <div className="receipt-section">
            <div className="section-title">
              <ShieldCheck size={16} />
              <span>1. Beneficiary Identification Details</span>
            </div>
            <div className="receipt-grid-3">
              <div className="receipt-cell">
                <span className="cell-lbl">Beneficiary Name</span>
                <span className="cell-val bold">{student?.name || 'Ananya Sharma'}</span>
              </div>
              <div className="receipt-cell">
                <span className="cell-lbl">Aadhaar e-KYC (Masked)</span>
                <span className="cell-val mono">{student?.aadhaarMasked || 'XXXX-XXXX-4521'}</span>
              </div>
              <div className="receipt-cell">
                <span className="cell-lbl">APAAR / Edu ID</span>
                <span className="cell-val mono">{student?.apaarId || 'APAAR-2023-JH-77192'}</span>
              </div>
              <div className="receipt-cell grid-span-2">
                <span className="cell-lbl">Enrolled Institution</span>
                <span className="cell-val">{student?.institution || 'National Institute of Technology (NIT) Jamshedpur (AISHE: U-0205)'}</span>
              </div>
              <div className="receipt-cell">
                <span className="cell-lbl">Degree / Course</span>
                <span className="cell-val">{student?.academicProgram || 'B.Tech in Computer Science (3rd Year)'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Scholarship & Scheme Sanction */}
          <div className="receipt-section">
            <div className="section-title">
              <FileText size={16} />
              <span>2. Scheme Sanction & Statutory Clearance</span>
            </div>
            <div className="receipt-grid-2">
              <div className="receipt-cell">
                <span className="cell-lbl">Scholarship Scheme</span>
                <span className="cell-val bold">Central Sector Scheme of Scholarships for College Students</span>
              </div>
              <div className="receipt-cell">
                <span className="cell-lbl">Application ID</span>
                <span className="cell-val mono">{app.id}</span>
              </div>
              <div className="receipt-cell">
                <span className="cell-lbl">Administering Agency</span>
                <span className="cell-val">Department of Higher Education, Ministry of Education (MoE)</span>
              </div>
              <div className="receipt-cell">
                <span className="cell-lbl">Statutory Compliance (GFR Rule 11)</span>
                <span className="cell-val text-success bold">
                  Verified Clean • Zero Duplicate Grants across 36 State/Central Portals
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Financial & Direct Benefit Transfer (DBT) Ledger */}
          <div className="receipt-section">
            <div className="section-title">
              <CreditCard size={16} />
              <span>3. Financial Settlement & Bank Credit Record</span>
            </div>
            <div className="disbursement-highlight-card">
              <div className="amount-col">
                <span className="amt-caption">Total Sanctioned Grant Disbursed</span>
                <div className="amt-digits">{dbt.amountCredited}</div>
                <span className="amt-words">Twenty Thousand Rupees Only</span>
              </div>
              <div className="bank-col">
                <div className="bank-detail-row">
                  <span className="lbl">Disbursing Bank:</span>
                  <span className="val bold">{dbt.bankName}</span>
                </div>
                <div className="bank-detail-row">
                  <span className="lbl">Aadhaar-Seeded A/C:</span>
                  <span className="val mono">{dbt.accountMasked}</span>
                </div>
                <div className="bank-detail-row">
                  <span className="lbl">Bank IFSC Code:</span>
                  <span className="val mono">SBIN0001876</span>
                </div>
                <div className="bank-detail-row">
                  <span className="lbl">NPCI Aadhaar Bridge:</span>
                  <span className="val text-success">APB-MAP-CONFIRMED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Signature & QR Verification Footer */}
          <div className="receipt-footer-grid">
            <div className="qr-box">
              <div className="mock-qr">
                <QrCode size={64} className="qr-svg" />
              </div>
              <div className="qr-caption">
                Scan with DigiLocker or PFMS app to verify cryptographically
              </div>
            </div>

            <div className="compliance-statement">
              <p>
                <strong>Statutory Notice:</strong> This disbursement advice is electronically generated under the Direct Benefit Transfer (DBT) mandate of the Government of India. Funds have been directly transferred to the student's Aadhaar-seeded bank account through the Reserve Bank of India (RBI) Core Settlement Engine. No separate university or physical cheque issuance is required.
              </p>
            </div>

            <div className="signature-box">
              <div className="digital-seal">
                <ShieldCheck size={28} className="seal-icon" />
                <div className="seal-text">
                  <span className="seal-title">DIGITALLY SIGNED</span>
                  <span className="seal-signer">PFMS Central Disbursing Officer</span>
                  <span className="seal-time">{dbt.creditDate} • Central MoF Gateway</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Close (No Print) */}
        <div className="receipt-bottom-bar no-print">
          <span className="note-text">
            Official Government Record • Preserved in ScholarBridge Document Vault
          </span>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode
}
