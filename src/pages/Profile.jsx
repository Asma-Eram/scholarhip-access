import React, { useState } from 'react'
import { 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  CreditCard, 
  FileText, 
  Award, 
  RefreshCw, 
  Download, 
  ExternalLink,
  UserCheck,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Lock
} from 'lucide-react'
import './Profile.css'

export default function Profile({ activeStudent, lang = 'en', onToast }) {
  const [syncing, setSyncing] = useState(false)
  const student = activeStudent || {}

  const handleSync = () => {
    setSyncing(true)
    onToast?.('Contacting DigiLocker & National Academic Depository...', 'info')
    setTimeout(() => {
      setSyncing(false)
      onToast?.('All 5 credentials verified against State e-District & UIDAI!', 'success')
    }, 1200)
  }

  const handleDownloadSummary = () => {
    onToast?.('Downloading Cryptographically Verified Student Credential Summary (PDF)...', 'success')
  }

  return (
    <div className="profile-container fade-in">
      {/* Top Banner / Hero Card */}
      <div className="gov-card profile-hero-card">
        <div className="profile-hero-inner">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-circle">
              {student.avatarInitials || 'AS'}
            </div>
            <span className="profile-online-badge" title="Identity Verified & Active">
              <CheckCircle2 size={16} />
            </span>
          </div>

          <div className="profile-hero-details">
            <div className="profile-tags-row">
              <span className="badge badge-success">
                <ShieldCheck size={12} /> DigiLocker Verified Scholar
              </span>
              <span className="badge badge-primary">
                Aadhaar e-KYC Active
              </span>
              <span className="badge badge-neutral">
                Category: General / Open Merit
              </span>
            </div>

            <h1 className="profile-fullname">{student.name || 'Ananya Sharma'}</h1>
            <p className="profile-headline">
              {student.academicProgram || 'B.Tech in Computer Science & Engineering'} • {student.institution || 'National Institute of Technology (NIT) Jamshedpur'}
            </p>

            <div className="profile-meta-chips">
              <div className="meta-chip">
                <span className="meta-label">Roll Number:</span>
                <span className="meta-val">2023UGCS042</span>
              </div>
              <div className="meta-chip">
                <span className="meta-label">APAAR ID:</span>
                <span className="meta-val">{student.apaarId || 'APAAR-2023-JH-77192'}</span>
              </div>
              <div className="meta-chip">
                <span className="meta-label">Academic Status:</span>
                <span className="meta-val text-success">Regular Full-Time (Year 3)</span>
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleSync}
              disabled={syncing}
            >
              <RefreshCw size={14} className={syncing ? 'spinning-sync' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync DigiLocker'}</span>
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleDownloadSummary}
            >
              <Download size={14} />
              <span>Download Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Credential Layout */}
      <div className="profile-grid">
        {/* Card 1: Academic Credentials */}
        <div className="gov-card profile-section-card">
          <div className="profile-card-header">
            <div className="icon-badge bg-blue-tint">
              <GraduationCap size={18} />
            </div>
            <div>
              <h2 className="profile-card-title">Academic & Institutional Profile</h2>
              <p className="profile-card-sub">Verified by AISHE & Dean Academic Affairs</p>
            </div>
          </div>

          <div className="profile-field-list">
            <div className="profile-field-row">
              <span className="field-label">Institution</span>
              <span className="field-value font-semibold">National Institute of Technology (NIT) Jamshedpur</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">AISHE Code</span>
              <span className="field-value">U-0205 (NIRF Top 100 INI)</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">Program & Branch</span>
              <span className="field-value">B.Tech - Computer Science & Engineering</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">Current Standing</span>
              <span className="field-value">Semester 5 (3rd Year)</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">Cumulative GPA (CGPA)</span>
              <span className="field-value font-bold text-success">8.85 / 10.0 (AISHE Verified)</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">Class XII Senior Secondary</span>
              <span className="field-value font-bold">94.2% (CBSE Central Board)</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">Biometric Attendance</span>
              <span className="field-value font-bold text-success">88.5% (Above 75% Norm)</span>
            </div>
          </div>
        </div>

        {/* Card 2: DigiLocker Verified Documents */}
        <div className="gov-card profile-section-card">
          <div className="profile-card-header">
            <div className="icon-badge bg-purple-tint">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="profile-card-title">Digital Credentials & Certificates</h2>
              <p className="profile-card-sub">Zero-Touch Cryptographic Verification</p>
            </div>
          </div>

          <div className="profile-doc-list">
            <div className="profile-doc-item">
              <div className="doc-icon-wrap">
                <CheckCircle2 size={16} className="text-success" />
              </div>
              <div className="doc-info">
                <div className="doc-name">Aadhaar Identity (UIDAI e-KYC)</div>
                <div className="doc-sub">UIDAI • Linked with Aadhaar Seeding</div>
              </div>
              <span className="badge badge-sm badge-success">Verified</span>
            </div>

            <div className="profile-doc-item">
              <div className="doc-icon-wrap">
                <CheckCircle2 size={16} className="text-success" />
              </div>
              <div className="doc-info">
                <div className="doc-name">State Domicile Certificate</div>
                <div className="doc-sub">JH/DOM/2024/491028 • Revenue Dept.</div>
              </div>
              <span className="badge badge-sm badge-success">Verified</span>
            </div>

            <div className="profile-doc-item">
              <div className="doc-icon-wrap">
                <CheckCircle2 size={16} className="text-success" />
              </div>
              <div className="doc-info">
                <div className="doc-name">Annual Income Certificate</div>
                <div className="doc-sub">JH/INC/2025/110482 • ₹2,10,000 / year</div>
              </div>
              <span className="badge badge-sm badge-success">Verified</span>
            </div>

            <div className="profile-doc-item">
              <div className="doc-icon-wrap">
                <CheckCircle2 size={16} className="text-success" />
              </div>
              <div className="doc-info">
                <div className="doc-name">Class XII Board Marksheet</div>
                <div className="doc-sub">CBSE/2024/881290 • 94.2% Marks Verified</div>
              </div>
              <span className="badge badge-sm badge-success">Verified</span>
            </div>

            <div className="profile-doc-item">
              <div className="doc-icon-wrap">
                <CheckCircle2 size={16} className="text-success" />
              </div>
              <div className="doc-info">
                <div className="doc-name">APAAR One Nation Student ID</div>
                <div className="doc-sub">APAAR-2023-JH-77192 • Min. of Education</div>
              </div>
              <span className="badge badge-sm badge-success">Lifetime Valid</span>
            </div>
          </div>
        </div>

        {/* Card 3: Banking & DBT Details */}
        <div className="gov-card profile-section-card">
          <div className="profile-card-header">
            <div className="icon-badge bg-green-tint">
              <CreditCard size={18} />
            </div>
            <div>
              <h2 className="profile-card-title">Banking & DBT Direct Credit</h2>
              <p className="profile-card-sub">PFMS / NPCI Validated Account</p>
            </div>
          </div>

          <div className="profile-field-list">
            <div className="profile-field-row">
              <span className="field-label">Beneficiary Bank</span>
              <span className="field-value font-semibold">State Bank of India</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">Branch</span>
              <span className="field-value">NIT Jamshedpur Campus Branch</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">Bank Account</span>
              <span className="field-value font-mono">XXXX-XXXX-8910</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">IFSC Code</span>
              <span className="field-value font-mono">SBIN0001882</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">NPCI Aadhaar Seeding</span>
              <span className="field-value font-bold text-success">
                Active & Seeded (DBT Ready)
              </span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">Last Disbursed Grant</span>
              <span className="field-value font-bold text-primary">₹20,000 (Central Sector CSSS)</span>
            </div>
            <div className="profile-field-row">
              <span className="field-label">PFMS UTR Number</span>
              <span className="field-value font-mono text-xs">RBI2026091298412</span>
            </div>
          </div>

          <div className="dbt-shield-notice">
            <ShieldCheck size={16} className="text-success" />
            <span>Funds are transferred directly from Government of India to your Aadhaar-seeded bank account with zero middleman deductions.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
