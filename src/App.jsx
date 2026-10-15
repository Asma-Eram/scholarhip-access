import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import MobileNav from './components/MobileNav'
import OfflineBanner from './components/OfflineBanner'
import ConflictModal from './components/ConflictModal'
import HelpSupportModal from './components/HelpSupportModal'
import DigiLockerModal from './components/DigiLockerModal'
import Dashboard from './pages/Dashboard'
import SchemesPage from './pages/SchemesPage'
import ApplicationTracker from './pages/ApplicationTracker'
import DocumentVault from './pages/DocumentVault'
import Profile from './pages/Profile'
import GrievanceAssistant from './pages/GrievanceAssistant'
import EligibilityFinder from './pages/EligibilityFinder'
import CollegeAdminPortal from './pages/CollegeAdminPortal'
import Login from './pages/Login'
import { HOUSEHOLD_DATA, SCHEMES, CONFLICT_RULES, I18N } from './data/scholarshipData'
import { COLLEGE_APPLICATION_STORE } from './data/aisheData'
import { 
  getLocalizedStudent, 
  getLocalizedHousehold, 
  getLocalizedNotifications 
} from './data/localizationEngine'
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  Bell, 
  Users, 
  ShieldCheck
} from 'lucide-react'
import './App.css'

// Helper functions for persistent state management
const loadStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

const saveStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e)
  }
}

export default function App() {
  const [userRole, setUserRole] = useState(() => loadStorage('sb_userRole', 'student'))
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [household, setHousehold] = useState(() => loadStorage('sb_household', HOUSEHOLD_DATA))
  const [activeStudent, setActiveStudent] = useState(() => {
    const storedHousehold = loadStorage('sb_household', HOUSEHOLD_DATA)
    const storedStudent = loadStorage('sb_activeStudent', null)
    if (storedStudent && storedHousehold?.members?.some(m => m.id === storedStudent.id)) {
      return storedHousehold.members.find(m => m.id === storedStudent.id)
    }
    return storedHousehold.members[0]
  })
  const [collegeApplications, setCollegeApplications] = useState(() => loadStorage('sb_collegeApps', COLLEGE_APPLICATION_STORE))
  const [lang, setLang] = useState(() => {
    const stored = loadStorage('sb_lang', 'en')
    return stored === 'hi' ? 'hi' : 'en'
  })
  const [activeTab, setActiveTab] = useState(() => loadStorage('sb_activeTab', 'dashboard'))
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine)
  const [toasts, setToasts] = useState([])
  const [conflictTargetScheme, setConflictTargetScheme] = useState(null)
  const [conflictData, setConflictData] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false)
  const [showHelpSupportModal, setShowHelpSupportModal] = useState(false)
  const [digiLockerModalApp, setDigiLockerModalApp] = useState(null)
  const [openDossierTrigger, setOpenDossierTrigger] = useState(0)

  // Sync state changes to localStorage
  useEffect(() => saveStorage('sb_household', household), [household])
  useEffect(() => saveStorage('sb_activeStudent', activeStudent), [activeStudent])
  useEffect(() => saveStorage('sb_collegeApps', collegeApplications), [collegeApplications])
  useEffect(() => saveStorage('sb_lang', lang), [lang])
  useEffect(() => saveStorage('sb_userRole', userRole), [userRole])
  useEffect(() => saveStorage('sb_activeTab', activeTab), [activeTab])

  // Real-time network online/offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setOfflineMode(false)
      const queue = loadStorage('sb_offlineQueue', [])
      if (queue.length > 0) {
        addToast(`Internet restored! Synchronized ${queue.length} cached offline actions.`, 'success')
        saveStorage('sb_offlineQueue', [])
      } else {
        addToast(lang === 'hi' ? 'इंटरनेट कनेक्शन पुनः स्थापित हो गया।' : 'Internet connection restored.', 'info')
      }
    }
    const handleOffline = () => {
      setOfflineMode(true)
      addToast(lang === 'hi' ? 'ऑफ़लाइन मोड सक्रिय — स्थानीय कैश और PWA सक्षम।' : 'Offline Mode active — local storage & PWA cache enabled.', 'warning')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [lang])

  const notifications = getLocalizedNotifications(lang)
  const localizedActiveStudent = getLocalizedStudent(activeStudent, lang)
  const localizedHousehold = getLocalizedHousehold(household, lang)

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const handleTriggerConflict = (targetSchemeId) => {
    const targetScheme = SCHEMES.find(s => s.id === targetSchemeId)
    const auditResult = CONFLICT_RULES.evaluateApplicationConflict(activeStudent, targetSchemeId)
    if (auditResult.hasConflict) {
      setConflictTargetScheme(targetScheme)
      setConflictData(auditResult)
    } else {
      addToast(t.eligibilityConfirmed || `Eligibility verified for ${targetScheme.name}. You may proceed!`, 'success')
      setActiveTab('tracker')
    }
  }

  const handleRelinquishAndProceed = () => {
    if (!conflictTargetScheme) return
    const newApp = {
      id: `APP-CENTRAL-2026-${conflictTargetScheme.shortName.toUpperCase().replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      schemeId: conflictTargetScheme.id,
      portal: conflictTargetScheme.portal,
      appliedDate: '2026-09-27',
      academicSession: '2026-27',
      sanctionAmount: conflictTargetScheme.amountRange,
      currentStageIndex: 1,
      status: 'under_review',
      statusText: 'Provisional Application Registered (NOC Pending)',
      statusType: 'primary',
      lastActionDate: '2026-09-27',
      stages: [
        { id: 1, title: 'DigiLocker Identity & Domicile Verification', date: '2026-09-27', done: true, remarks: 'Verified via National e-District API' },
        { id: 2, title: 'Institution Bonafide & Ranking Verification', date: null, done: false, active: true },
        { id: 3, title: 'State Higher Education Directorate Clearance', date: null, done: false },
        { id: 4, title: 'Central Sanction Committee Approval', date: null, done: false },
        { id: 5, title: 'PFMS Direct Benefit Transfer', date: null, done: false }
      ],
      dbtDetails: null,
      deficiencies: []
    }
    const updatedMembers = household.members.map(m => m.id === activeStudent.id ? { ...m, applications: [newApp, ...m.applications] } : m)
    setHousehold(prev => ({ ...prev, members: updatedMembers }))
    setActiveStudent(prev => ({ ...prev, applications: [newApp, ...prev.applications] }))
    setConflictData(null)
    setConflictTargetScheme(null)
    addToast(`${newApp.id} submitted with Automated NOC!`, 'success')
    setActiveTab('tracker')
  }

  const handleAutofillSubmit = (appData) => {
    const isDirectProvider = appData.verificationType === 'direct_provider'
    const appId = `APP-SB-2026-${(appData.schemeName?.substring(0, 3) || 'SCH').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    
    const stages = isDirectProvider ? [
      { 
        id: 1, 
        title: appData.applicationMode === 'manual' ? 'Scanned Document OCR Verification' : 'DigiLocker Identity & Marksheets Sync', 
        date: new Date().toISOString().split('T')[0], 
        done: true, 
        remarks: appData.applicationMode === 'manual' ? 'OCR Vision extracted authentic certificate hash' : 'Verified via DigiLocker Cryptographic Hash' 
      },
      { 
        id: 2, 
        title: 'Institutional Bonafide: Pre-Certified (Direct Foundation Grant)', 
        date: new Date().toISOString().split('T')[0], 
        done: true, 
        remarks: 'Direct philanthropic grant — exempt from institutional nodal officer roadblock' 
      },
      { id: 3, title: 'Foundation Trust Scrutiny Board Review', date: null, done: false, active: true },
      { id: 4, title: 'Corporate Philanthropic Grant Sanction', date: null, done: false },
      { id: 5, title: 'Direct Bank Transfer / College Ledger Credit', date: null, done: false }
    ] : [
      { 
        id: 1, 
        title: appData.applicationMode === 'manual' ? 'Scanned Document OCR Verification' : 'DigiLocker Identity & Marksheets Sync', 
        date: new Date().toISOString().split('T')[0], 
        done: true, 
        remarks: appData.applicationMode === 'manual' ? 'OCR Vision extracted authentic certificate hash' : 'Verified via DigiLocker Cryptographic Hash' 
      },
      { id: 2, title: `Institution Bonafide Verification (${appData.collegeName})`, date: null, done: false, active: true },
      { id: 3, title: 'State Directorate Clearance Audit', date: null, done: false },
      { id: 4, title: 'Central Sanction Committee Approval', date: null, done: false },
      { id: 5, title: 'PFMS Direct Benefit Transfer (DBT)', date: null, done: false }
    ]

    const newApp = {
      id: appId,
      schemeId: appData.schemeId,
      portal: isDirectProvider ? 'Direct Foundation Gateway' : 'ScholarBridge / DigiLocker Synced',
      appliedDate: new Date().toISOString().split('T')[0],
      academicSession: '2026-27',
      sanctionAmount: appData.tuitionFeeClaim || '₹1,25,000 / year',
      currentStageIndex: isDirectProvider ? 3 : 2,
      status: 'under_review',
      statusText: isDirectProvider 
        ? `Transmitted directly to ${appData.schemeName} Trust Board. (No college verification required)` 
        : `Forwarded to ${appData.collegeName} for Level-1 Bonafide Certification`,
      statusType: isDirectProvider ? 'success' : 'primary',
      lastActionDate: new Date().toISOString().split('T')[0],
      institution: appData.collegeName,
      stages: stages,
      dbtDetails: null,
      deficiencies: []
    }

    // 1. Sync into Student and Household records
    const updatedMembers = household.members.map(m => m.id === activeStudent.id ? { ...m, applications: [newApp, ...m.applications] } : m)
    setHousehold(prev => ({ ...prev, members: updatedMembers }))
    setActiveStudent(prev => ({ ...prev, applications: [newApp, ...prev.applications] }))

    // 2. If college verification is mandatory, dispatch to College Institutional Nodal Desk
    if (!isDirectProvider) {
      const newCollegeApp = {
        id: appId,
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        rollNumber: appData.rollNumber || '2023UGCS042',
        apaarId: activeStudent.apaarId || 'APAAR-2023-JH-77192',
        aadhaarMasked: activeStudent.aadhaarMasked || 'XXXX-XXXX-4521',
        schemeId: appData.schemeId,
        schemeName: appData.schemeName,
        aisheCode: appData.aisheCode || 'U-0205',
        instituteName: appData.collegeName || 'National Institute of Technology (NIT) Jamshedpur',
        courseName: activeStudent.academicProgram || 'B.Tech - Computer Science & Engineering (3rd Year)',
        totalFeeClaimed: appData.tuitionFeeClaim || '₹1,25,000 (Tuition)',
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'under_review',
        collegeStatus: 'pending',
        remarks: appData.applicationMode === 'manual' 
          ? 'Fresh submission via Verified Scanned OCR. Awaiting Institutional Nodal Officer bonafide certification.'
          : 'Fresh submission via 1-Click DigiLocker. Awaiting Institutional Nodal Officer bonafide certification.',
        attendancePercentage: '92.4%',
        bonafideValid: true,
        casteCertNo: 'JH/DOM/2024/491028',
        domicileCertNo: 'JH/DOM/2024/491028',
        incomeCertNo: 'JH/INC/2025/110482',
        incomeAmount: '₹2,10,000 / annum',
        digilockerVerified: appData.applicationMode === 'digilocker',
        isFreshSubmission: true
      }
      setCollegeApplications(prev => [newCollegeApp, ...prev])
      addToast(`Application ${appId} submitted and forwarded to ${appData.collegeName} Nodal Desk for Level-1 approval!`, 'success')
    } else {
      addToast(`Application ${appId} submitted directly to Foundation Trust (No College Desk Required)!`, 'success')
    }

    setActiveTab('tracker')
  }

  const handleCollegeApprove = (appId) => {
    // 1. Update College Desk applications
    setCollegeApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          collegeStatus: 'approved',
          status: 'verified_by_college',
          remarks: `Bonafide enrollment & course fees certified by Institute Nodal Officer on ${new Date().toLocaleDateString('en-GB')}. Forwarded to State / Central Directorate.`
        }
      }
      return a
    }))

    // 2. Automatically advance Student Live Application Tracker (Stage 2 certified!)
    const approveInApps = (apps) => apps.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'under_review',
          statusText: 'Stage 2 Certified: Bonafide Approved by College Nodal Officer',
          currentStageIndex: 3,
          stages: app.stages.map(st => {
            if (st.id === 2) {
              return { 
                ...st, 
                done: true, 
                active: false, 
                date: new Date().toISOString().split('T')[0], 
                remarks: 'Bonafide enrollment, fees & attendance certified by Institute Nodal Officer' 
              }
            }
            if (st.id === 3) {
              return { ...st, active: true }
            }
            return st
          })
        }
      }
      return app
    })

    setHousehold(prev => ({
      ...prev,
      members: prev.members.map(m => ({ ...m, applications: approveInApps(m.applications) }))
    }))
    setActiveStudent(prev => ({
      ...prev,
      applications: approveInApps(prev.applications)
    }))
    addToast(`College Nodal Desk: Certified Bonafide & Approved application ${appId}! Sent to State Clearance.`, 'success')
  }

  const handleCollegeFlagDeficiency = (appId, reason) => {
    setCollegeApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          collegeStatus: 'deficiency',
          status: 'deficiency_flagged',
          remarks: `Deficiency Raised by College: ${reason}`
        }
      }
      return a
    }))

    const flagInApps = (apps) => apps.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'action_required',
          statusText: `Deficiency Raised by College: ${reason}`,
          deficiencies: [
            { id: `DEF-CLG-${Date.now()}`, message: reason, date: new Date().toISOString().split('T')[0] }
          ]
        }
      }
      return app
    })

    setHousehold(prev => ({
      ...prev,
      members: prev.members.map(m => ({ ...m, applications: flagInApps(m.applications) }))
    }))
    setActiveStudent(prev => ({
      ...prev,
      applications: flagInApps(prev.applications)
    }))
    addToast(`College Nodal Desk: Dispatched deficiency notice for ${appId}`, 'warning')
  }

  const handleResolveDeficiency = (appId) => {
    const targetApp = activeStudent.applications?.find(a => a.id === appId) || 
      household.members.flatMap(m => m.applications || []).find(a => a.id === appId)
    
    if (targetApp) {
      setDigiLockerModalApp(targetApp)
    } else {
      handleConfirmResolveDeficiency(appId)
    }
  }

  const handleConfirmResolveDeficiency = (appId) => {
    const resolveInApps = (apps) => apps.map(app => app.id === appId ? {
      ...app,
      status: 'under_review',
      statusText: lang === 'hi' ? 'आपत्ति निवारित: राज्य समीक्षा पुनः शुरू' : 'Deficiency Cleared: State Review Resumed',
      deficiencies: [],
      stages: app.stages.map(st => st.id === 3 ? { 
        ...st, 
        done: true, 
        active: false, 
        remarks: lang === 'hi' ? 'आय प्रमाण पत्र डिज़िलॉकर द्वारा ई-सत्यापित' : 'Income certificate e-verified via DigiLocker NeGD API' 
      } : st.id === 4 ? { ...st, active: true } : st)
    } : app)

    setHousehold(prev => ({ 
      ...prev, 
      members: prev.members.map(m => m.id === activeStudent.id ? { ...m, applications: resolveInApps(m.applications) } : m) 
    }))
    setActiveStudent(prev => ({ 
      ...prev, 
      applications: resolveInApps(prev.applications) 
    }))

    if (offlineMode) {
      const q = loadStorage('sb_offlineQueue', [])
      q.push({ type: 'RESOLVE_DEFICIENCY', appId, timestamp: Date.now() })
      saveStorage('sb_offlineQueue', q)
      addToast(lang === 'hi' ? 'ऑफ़लाइन कतार में सहेजा गया! ऑनलाइन होने पर सिंक होगा।' : 'Saved to offline queue! Will sync when connection is restored.', 'info')
    } else {
      addToast(lang === 'hi' ? 'आपत्ति का निवारण हुआ! डिज़िलॉकर द्वारा ई-सत्यापित।' : 'Deficiency resolved! Income certificate cryptographically verified via DigiLocker.', 'success')
    }
  }

  const handleResetDemoData = () => {
    localStorage.removeItem('sb_household')
    localStorage.removeItem('sb_activeStudent')
    localStorage.removeItem('sb_collegeApps')
    localStorage.removeItem('sb_lang')
    localStorage.removeItem('sb_userRole')
    localStorage.removeItem('sb_activeTab')
    localStorage.removeItem('sb_offlineQueue')
    setHousehold(HOUSEHOLD_DATA)
    setActiveStudent(HOUSEHOLD_DATA.members[0])
    setCollegeApplications(COLLEGE_APPLICATION_STORE)
    setLang('en')
    setUserRole('student')
    setActiveTab('dashboard')
    addToast(lang === 'hi' ? 'डेमो डेटा सफलतापूर्वक रीसेट किया गया!' : 'Demo data reset to default successfully!', 'info')
  }

  const handleDownloadSlip = () => {
    addToast(t.downloading || 'Generating certified PFMS DBT statement (PDF)...', 'info')
    setTimeout(() => addToast(t.allRecordsSecured || 'PFMS Receipt saved to Downloads.', 'success'), 1200)
  }

  const handleOfflineSync = () => {
    addToast(t.offlineActiveMsg || 'Synchronizing offline queue with Central Scholarship Server...', 'info')
    setTimeout(() => { 
      setOfflineMode(false)
      saveStorage('sb_offlineQueue', [])
      addToast(t.lifetimeValid || 'Offline sync complete! Records reconciled.', 'success')
    }, 1200)
  }

  const deficiencyCount = activeStudent.applications?.reduce((acc, a) => acc + (a.deficiencies?.length || 0), 0) || 0
  const t = I18N[lang] || I18N.en

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Student Overview'
      case 'schemes': return 'All Scholarships Directory'
      case 'tracker': return 'Live Application Tracker'
      case 'college': return 'College Admin Desk'
      case 'documents': return 'DigiLocker Document Vault'
      case 'profile':
      case 'family': return 'My Profile & Credentials'
      case 'eligibility': return 'Smart Grant Matcher'
      case 'assistant': return 'AI Policy Advisor'
      default: return 'ScholarBridge Portal'
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <Login
          onLogin={() => {
            setIsLoggedIn(true)
            addToast(`Welcome back, ${localizedActiveStudent.name}!`, 'success')
          }}
          onToast={addToast}
        />
        {/* Toast Stack */}
        <div className="toast-stack" aria-live="polite">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast-item toast-${toast.type} fade-in`}>
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : toast.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
              <span className="toast-msg">{toast.message}</span>
              <button className="toast-x" onClick={() => setToasts(t => t.filter(x => x.id !== toast.id))}><X size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        deficiencyCount={deficiencyCount}
        activeStudent={localizedActiveStudent}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenHelpSupport={() => setShowHelpSupportModal(true)}
        onLogout={() => {
          setIsLoggedIn(false)
          addToast('Logged out of ScholarBridge session', 'info')
        }}
      />

      {/* Right Content Area */}
      <div className={`app-main-panel ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Top Header Bar */}
        <Header
          lang={lang}
          setLang={setLang}
          activeStudent={localizedActiveStudent}
          setActiveStudent={(member) => {
            const raw = household.members.find(m => m.id === member.id) || member
            setActiveStudent(raw)
          }}
          household={localizedHousehold}
          offlineMode={offlineMode}
          setOfflineMode={setOfflineMode}
          notifications={notifications}
          onOpenNotifications={() => setShowNotificationsDrawer(true)}
          activeTabLabel={getTabLabel(activeTab)}
          onNavigate={setActiveTab}
          userRole={userRole}
          setUserRole={setUserRole}
          onResetDemo={handleResetDemoData}
          onOpenDocumentUpload={() => {
            setActiveTab('schemes')
            setOpenDossierTrigger(t => t + 1)
          }}
        />

        {/* Offline Banner */}
        <OfflineBanner offlineMode={offlineMode} lang={lang} onSync={handleOfflineSync} />

        {/* Page Content */}
        <main className="page-viewport">
          {activeTab === 'dashboard' && (
            <Dashboard
              activeStudent={localizedActiveStudent}
              household={localizedHousehold}
              lang={lang}
              onNavigate={setActiveTab}
              onTriggerConflict={handleTriggerConflict}
              onResolveDeficiency={handleResolveDeficiency}
            />
          )}
          {activeTab === 'schemes' && (
            <SchemesPage
              activeStudent={localizedActiveStudent}
              lang={lang}
              onTriggerConflict={handleTriggerConflict}
              onDirectApply={(scheme) => handleTriggerConflict(scheme.id)}
              onSubmitAutofillApp={handleAutofillSubmit}
              openDossierTrigger={openDossierTrigger}
            />
          )}
          {activeTab === 'tracker' && (
            <ApplicationTracker
              activeStudent={localizedActiveStudent}
              lang={lang}
              onResolveDeficiency={handleResolveDeficiency}
              onDownloadSlip={handleDownloadSlip}
            />
          )}
          {activeTab === 'college' && (
            <CollegeAdminPortal
              lang={lang}
              onToast={addToast}
              applications={collegeApplications}
              onApprove={handleCollegeApprove}
              onFlagDeficiency={handleCollegeFlagDeficiency}
            />
          )}
          {activeTab === 'documents' && (
            <DocumentVault activeStudent={localizedActiveStudent} lang={lang} onToast={addToast} />
          )}
          {(activeTab === 'profile' || activeTab === 'family') && (
            <Profile
              activeStudent={localizedActiveStudent}
              household={localizedHousehold}
              lang={lang}
              onToast={addToast}
            />
          )}
          {activeTab === 'eligibility' && (
            <EligibilityFinder
              activeStudent={localizedActiveStudent}
              lang={lang}
              onTriggerConflict={handleTriggerConflict}
              onNavigate={setActiveTab}
              onToast={addToast}
            />
          )}
          {activeTab === 'assistant' && (
            <GrievanceAssistant activeStudent={localizedActiveStudent} lang={lang} setLang={setLang} onToast={addToast} />
          )}
        </main>
      </div>

      {/* Conflict Modal */}
      {conflictData && conflictTargetScheme && (
        <ConflictModal
          conflictData={conflictData}
          targetScheme={conflictTargetScheme}
          student={localizedActiveStudent}
          lang={lang}
          onClose={() => { setConflictData(null); setConflictTargetScheme(null); }}
          onRelinquishAndProceed={handleRelinquishAndProceed}
        />
      )}

      {/* DigiLocker Document Verification Modal */}
      {digiLockerModalApp && (
        <DigiLockerModal
          isOpen={!!digiLockerModalApp}
          onClose={() => setDigiLockerModalApp(null)}
          application={digiLockerModalApp}
          student={localizedActiveStudent}
          lang={lang}
          onConfirmResolution={handleConfirmResolveDeficiency}
        />
      )}

      {/* Help & Support Modal */}
      {showHelpSupportModal && (
        <HelpSupportModal
          lang={lang}
          onClose={() => setShowHelpSupportModal(false)}
          onNavigate={(tab) => {
            setShowHelpSupportModal(false)
            setActiveTab(tab)
          }}
        />
      )}

      {/* Notifications Drawer */}
      {showNotificationsDrawer && (
        <div className="modal-overlay fade-in" onClick={() => setShowNotificationsDrawer(false)}>
          <div className="notifications-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-row">
                <Bell size={18} />
                <h2>{t.ministry || 'Scholarship Notifications'}</h2>
              </div>
              <button className="close-btn" onClick={() => setShowNotificationsDrawer(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="drawer-list">
              {notifications.map(n => (
                <div key={n.id} className={`drawer-notif notif-${n.type}`}>
                  <div className="notif-head">
                    <span className="notif-title">{n.title}</span>
                    <span className="notif-time">{n.time}</span>
                  </div>
                  <p className="notif-body">{n.body}</p>
                </div>
              ))}
            </div>
            <button
              className="btn btn-secondary btn-full"
              onClick={() => { setShowNotificationsDrawer(false); addToast(t.lifetimeValid || 'All read', 'info'); }}
            >
              {t.verifiedDoc || 'Mark All as Read'}
            </button>
          </div>
        </div>
      )}

      {/* Toast Stack */}
      <div className="toast-stack" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item toast-${toast.type} fade-in`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : toast.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
            <span className="toast-msg">{toast.message}</span>
            <button className="toast-x" onClick={() => setToasts(t => t.filter(x => x.id !== toast.id))}><X size={13} /></button>
          </div>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang} 
        setLang={setLang}
        deficiencyCount={deficiencyCount}
      />
    </div>
  )
}
