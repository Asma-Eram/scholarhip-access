import { useState } from 'react'
import { 
  LayoutDashboard, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Users, 
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  Building2,
  FileCheck2,
  Compass,
  FileSpreadsheet
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './Sidebar.css'

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  lang, 
  deficiencyCount, 
  activeStudent,
  collapsed: externalCollapsed,
  setCollapsed: externalSetCollapsed,
  userRole,
  setUserRole
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed
  const setCollapsed = externalSetCollapsed || setInternalCollapsed
  const t = I18N[lang] || I18N.en

  const studentNavItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'schemes', label: 'All Scholarships', icon: Compass },
    { id: 'tracker', label: 'Live Application Tracker', icon: Clock, badge: deficiencyCount > 0 ? `${deficiencyCount} Alert` : null },
    { id: 'documents', label: 'DigiLocker Vault', icon: ShieldCheck },
    { id: 'eligibility', label: 'Smart Grant Matcher', icon: Sparkles, isAI: true },
    { id: 'family', label: 'Household & Siblings', icon: Users },
  ]

  const adminNavItems = [
    { id: 'college', label: 'Institutional Desk', icon: Building2 },
    { id: 'schemes', label: 'All Scheme Directives', icon: Compass },
    { id: 'tracker', label: 'Central Tracking Audit', icon: Clock },
    { id: 'documents', label: 'Document Registry', icon: ShieldCheck },
  ]

  const navItems = userRole === 'admin' ? adminNavItems : studentNavItems

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`} aria-label="Portal Navigation Sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-icon" aria-hidden="true">
          <GraduationCap size={22} className="logo-cap-icon" aria-hidden="true" />
          <span className="logo-sparkle-dot" />
        </div>
        {!collapsed && (
          <div className="brand-text">
            <div className="brand-name">ScholarBridge</div>
            <div className="brand-tagline">National Scholarship Gateway</div>
          </div>
        )}
      </div>

      {/* Profile Card / Context Banner */}
      {!collapsed && (
        <div className="sidebar-user-card">
          {userRole === 'admin' ? (
            <div className="admin-context-box">
              <div className="admin-avatar-badge">
                <Building2 size={16} />
              </div>
              <div className="admin-info-text">
                <div className="admin-name">College Nodal Desk</div>
                <div className="admin-sub">AISHE Code: U-0205 (NIT Jamshedpur)</div>
              </div>
            </div>
          ) : (
            <div className="student-context-box">
              <div className="student-avatar">{activeStudent.avatarInitials || 'ST'}</div>
              <div className="student-info-text">
                <div className="student-name">{activeStudent.name}</div>
                <div className="student-sub">{activeStudent.educationLevel}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <nav className="sidebar-nav" aria-label="Main Navigation">
        <div className="nav-section-label">
          {!collapsed && (userRole === 'admin' ? 'VERIFICATION MODULES' : 'MAIN MENU')}
        </div>
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${isActive ? 'active-sidebar-btn' : ''}`}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={19} className="sidebar-nav-icon" aria-hidden="true" />
              {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
              {item.badge && !collapsed && (
                <span className="sidebar-badge-warning">{item.badge}</span>
              )}
              {item.isAI && !collapsed && (
                <span className="sidebar-ai-pill">AI</span>
              )}
            </button>
          )
        })}

        {/* AI Advisor Tool for Students */}
        {userRole === 'student' && (
          <>
            <div className="nav-divider" />
            <div className="nav-section-label">{!collapsed && 'SMART ASSISTANCE'}</div>
            <button
              className={`sidebar-nav-btn ${activeTab === 'assistant' ? 'active-sidebar-btn' : ''}`}
              onClick={() => setActiveTab('assistant')}
              aria-label="AI Policy Advisor"
              aria-current={activeTab === 'assistant' ? 'page' : undefined}
              title={collapsed ? 'AI Scholarship Sahayak' : undefined}
            >
              <Bot size={19} className="sidebar-nav-icon text-primary" aria-hidden="true" />
              {!collapsed && <span className="sidebar-nav-label">AI Policy Advisor</span>}
              {!collapsed && <span className="sidebar-ai-pill">24/7</span>}
            </button>
          </>
        )}
      </nav>

      {/* Bottom Footer / Collapse Toggle */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="digilocker-trust-card">
            <div className="trust-icon-row">
              <ShieldCheck size={16} className="text-success" aria-hidden="true" />
              <span>DigiLocker & PFMS Integrated</span>
            </div>
            <p className="trust-desc">Zero-Touch Verification • 100% GFR Rule 11 Audit Trail</p>
          </div>
        )}

        <button 
          className="collapse-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={17} aria-hidden="true" /> : <ChevronLeft size={17} aria-hidden="true" />}
          {!collapsed && <span className="collapse-text">Collapse Menu</span>}
        </button>
      </div>
    </aside>
  )
}
