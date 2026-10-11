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
  ExternalLink
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
  setUserRole
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
              title="Switch to Student Scholarship Discovery & Tracking"
            >
              <GraduationCap size={15} />
              <span>Student Portal</span>
            </button>
            <button
              className={`role-pill-btn ${userRole === 'admin' ? 'active-role-pill' : ''}`}
              onClick={() => handleRoleToggle('admin')}
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
          <div className="digilocker-header-badge" title="DigiLocker Cryptographic Service Active">
            <ShieldCheck size={15} className="digilocker-icon" />
            <span className="digilocker-text">DigiLocker Active</span>
            <span className="live-ping-dot" />
          </div>

          {/* Quick Find Scholarships */}
          {userRole === 'student' && (
            <button 
              className="header-pill search-quick-btn"
              onClick={() => onNavigate?.('schemes')}
              title="Browse all national, state, and merit scholarships"
            >
              <Search size={14} />
              <span className="pill-label">Find Grants</span>
            </button>
          )}

          {/* Student Profile Switcher (When in Student Mode) */}
          {userRole === 'student' && household?.members && (
            <div className="dropdown-wrap">
              <button 
                className="header-pill member-switch-pill"
                onClick={() => { setShowMemberMenu(!showMemberMenu); setShowLangMenu(false); }}
                title="Switch active student profile"
              >
                <div className="mini-avatar">{activeStudent.avatarInitials}</div>
                <div className="mini-student-info">
                  <span className="mini-student-name">{activeStudent.name.split(' ')[0]}</span>
                  <span className="mini-student-status">Active</span>
                </div>
                <ChevronDown size={12} className={showMemberMenu ? 'arrow-flipped' : ''} />
              </button>

              {showMemberMenu && (
                <div className="dropdown-panel member-panel fade-in">
                  <div className="panel-header">
                    <span className="panel-title">Registered Students</span>
                    <span className="badge badge-primary">{household.members.length}</span>
                  </div>
                  <div className="member-list">
                    {household.members.map(member => (
                      <button
                        key={member.id}
                        className={`member-item ${member.id === activeStudent.id ? 'active-member-item' : ''}`}
                        onClick={() => {
                          setActiveStudent(member);
                          setShowMemberMenu(false);
                        }}
                      >
                        <div className="member-avatar">{member.avatarInitials}</div>
                        <div className="member-item-info">
                          <div className="member-name-row">
                            <span className="member-item-name">{member.name}</span>
                            {member.id === activeStudent.id && (
                              <CheckCircle2 size={13} className="text-success" />
                            )}
                          </div>
                          <span className="member-item-meta">{member.institution || member.educationLevel}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Bell */}
          <button 
            className="header-pill notif-pill"
            onClick={onOpenNotifications}
            title={`${unreadCount} notifications`}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {/* Language Selector */}
          <div className="dropdown-wrap">
            <button 
              className="header-pill lang-pill"
              onClick={() => { setShowLangMenu(!showLangMenu); setShowMemberMenu(false); }}
              title="Change Language"
            >
              <Languages size={15} />
              <span className="pill-label">
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : lang.toUpperCase()}
              </span>
              <ChevronDown size={12} className={showLangMenu ? 'arrow-flipped' : ''} />
            </button>

            {showLangMenu && (
              <div className="dropdown-panel lang-panel fade-in">
                {[
                  { code: 'en', label: 'English', sub: 'Standard Portal Language' },
                  { code: 'hi', label: 'हिंदी (Hindi)', sub: 'National Language' },
                  { code: 'santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)', sub: 'Ol Chiki Script' },
                  { code: 'gondi', label: 'गोंडी (Gondi)', sub: 'Regional Language' }
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
