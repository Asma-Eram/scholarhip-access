import { useState } from 'react'
import { 
  Languages, 
  Users, 
  Bell, 
  ShieldCheck, 
  ChevronDown, 
  CheckCircle2,
  Search,
  Sparkles,
  Building2,
  GraduationCap,
  Shield,
  ExternalLink,
  RotateCcw,
  Upload
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './Header.css'

export default function Header({ 
  lang, 
  setLang, 
  activeStudent, 
  setActiveStudent, 
  household, 
  notifications,
  onOpenNotifications,
  activeTabLabel,
  onNavigate,
  userRole,
  setUserRole,
  onResetDemo,
  onOpenDocumentUpload
}) {
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showMemberMenu, setShowMemberMenu] = useState(false)
  const t = I18N[lang] || I18N.en
  const unreadCount = notifications?.filter(n => !n.read)?.length || 0

  const handleRoleToggle = (newRole) => {
    setUserRole(newRole)
    if (newRole === 'admin') {
      onNavigate?.('college')
    } else {
      onNavigate?.('dashboard')
    }
  }

  return (
    <header className="top-header">
      {/* Top Academic Accent Line */}
      <div className="sb-accent-bar" />

      <div className="header-inner">
        {/* Left: Brand Identity & Active Page Title */}
        <div className="header-left-section">
          <div className="page-context">
            <div className="portal-breadcrumb">
              <span className="portal-category-tag">
                {userRole === 'admin' ? 'INSTITUTIONAL DESK' : 'SCHOLARSHIP PORTAL'}
              </span>
              <span className="breadcrumb-slash">/</span>
              <span className="breadcrumb-current">{activeTabLabel}</span>
            </div>
            <h1 className="current-page-title">{activeTabLabel}</h1>
          </div>
        </div>

        {/* Center: Dual Role Switcher (Student vs Admin Desk) */}
        <div className="header-center-section">
          <div className="role-switch-pill-group" role="tablist" aria-label="Portal Mode Switcher">
            <button
              className={`role-pill-btn ${userRole === 'student' ? 'active-role-pill' : ''}`}
              onClick={() => handleRoleToggle('student')}
              aria-label="Switch to Student Portal"
              title="Switch to Student Scholarship Discovery & Tracking"
            >
              <GraduationCap size={15} />
              <span>Student Portal</span>
            </button>
            <button
              className={`role-pill-btn ${userRole === 'admin' ? 'active-role-pill' : ''}`}
              onClick={() => handleRoleToggle('admin')}
              aria-label="Switch to College Admin Desk"
              title="Switch to College Nodal Officer / Admin Verification Desk"
            >
              <Building2 size={15} />
              <span>College Admin Desk</span>
              <span className="admin-status-dot" />
            </button>
          </div>
        </div>

        {/* Right: Actions, DigiLocker Badge, Language & Notifications */}
        <div className="header-controls">
          {/* DigiLocker Status Indicator */}
          <div className="digilocker-header-badge" title="DigiLocker Cryptographic Service Active" role="status" aria-label="DigiLocker service active">
            <ShieldCheck size={15} className="digilocker-icon" />
            <span className="digilocker-text">DigiLocker Active</span>
            <span className="live-ping-dot" />
          </div>

          {/* Direct Document Upload Action (OCR & Manual) */}
          {userRole === 'student' && (
            <button 
              className="header-pill upload-quick-btn"
              onClick={() => onOpenDocumentUpload ? onOpenDocumentUpload() : onNavigate?.('schemes')}
              aria-label="Upload documents for OCR verification"
              title="Upload scanned certificates (PDF/JPG) or verify via DigiLocker"
            >
              <Upload size={14} />
              <span className="pill-label">Upload Documents (OCR)</span>
            </button>
          )}

          {/* Student Profile Pill (When in Student Mode) */}
          {userRole === 'student' && activeStudent && (
            <button 
              className="header-pill member-switch-pill"
              onClick={() => onNavigate?.('profile')}
              aria-label={`Student profile: ${activeStudent.name}. Click to view credentials.`}
              title="View My Profile & Credentials"
            >
              <div className="mini-avatar" aria-hidden="true">{activeStudent.avatarInitials || 'AS'}</div>
              <div className="mini-student-info">
                <span className="mini-student-name">{activeStudent.name?.split(' ')[0] || 'Ananya'}</span>
                <span className="mini-student-status">Active</span>
              </div>
            </button>
          )}

          {/* Notifications Bell */}
          <button 
            className="header-pill notif-pill"
            onClick={onOpenNotifications}
            aria-label={`View notifications, ${unreadCount} unread`}
            title={`${unreadCount} notifications`}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {/* Reset Demo Data Button */}
          {onResetDemo && (
            <button 
              className="header-pill reset-demo-pill"
              onClick={onResetDemo}
              aria-label="Reset demo data"
              title="Reset data back to initial demo state"
            >
              <RotateCcw size={14} />
              <span className="pill-label">{lang === 'hi' ? 'रीसेट डेमो' : 'Reset Demo'}</span>
            </button>
          )}

          {/* Language Selector (English & Hindi only) */}
          <div className="dropdown-wrap">
            <button 
              className="header-pill lang-pill"
              onClick={() => { setShowLangMenu(!showLangMenu); setShowMemberMenu(false); }}
              aria-label="Change portal language"
              title="Change Language"
              aria-expanded={showLangMenu}
            >
              <Languages size={15} />
              <span className="pill-label">
                {lang === 'hi' ? 'हिन्दी' : 'English'}
              </span>
              <ChevronDown size={12} className={showLangMenu ? 'arrow-flipped' : ''} aria-hidden="true" />
            </button>

            {showLangMenu && (
              <div className="dropdown-panel lang-panel fade-in">
                {[
                  { code: 'en', label: 'English', sub: 'Standard Portal Language' },
                  { code: 'hi', label: 'हिंदी (Hindi)', sub: 'National Language' }
                ].map(item => (
                  <button
                    key={item.code}
                    className={`lang-item ${lang === item.code ? 'active-lang-item' : ''}`}
                    onClick={() => {
                      setLang(item.code);
                      setShowLangMenu(false);
                    }}
                  >
                    <div>
                      <div className="lang-label">{item.label}</div>
                      <div className="lang-sub">{item.sub}</div>
                    </div>
                    {lang === item.code && <CheckCircle2 size={14} className="text-success" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
