import { useState } from 'react'
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  UserCheck, 
  FileText, 
  XCircle, 
  Send, 
  ShieldCheck, 
  Clock, 
  Users, 
  Award, 
  Download,
  AlertCircle
} from 'lucide-react'
import { AISHE_DIRECTORY, COLLEGE_APPLICATION_STORE } from '../data/aisheData'
import './CollegeAdminPortal.css'

export default function CollegeAdminPortal({ lang, onToast }) {
  const [selectedAishe, setSelectedAishe] = useState('U-0205') // Default: NIT Jamshedpur
  const [applications, setApplications] = useState(COLLEGE_APPLICATION_STORE)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'pending' | 'approved' | 'deficiency'
  const [selectedApp, setSelectedApp] = useState(null)
  const [deficiencyReason, setDeficiencyReason] = useState('Fee receipt mismatch with current academic session')

  const currentCollege = AISHE_DIRECTORY.find(c => c.aisheCode === selectedAishe) || AISHE_DIRECTORY[0]

  // Filter apps belonging to this college
  const filteredApps = applications.filter(app => {
    const matchesCollege = app.aisheCode === selectedAishe
    const matchesStatus = statusFilter === 'ALL' || app.collegeStatus === statusFilter
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCollege && matchesStatus && matchesSearch
  })

  const handleApprove = (appId) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          collegeStatus: 'approved',
          status: 'verified_by_college',
          remarks: `Bonafide enrollment & course fees certified by ${currentCollege.nodalOfficer.name} on ${new Date().toLocaleDateString('en-GB')}. Forwarded to State Tribal Welfare Directorate.`
        }
      }
      return a
    }))
    setSelectedApp(null)
    onToast?.(`Application ${appId} Approved & Certified by College Nodal Desk!`, 'success')
  }

  const handleFlagDeficiency = (appId) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          collegeStatus: 'deficiency',
          status: 'deficiency_flagged',
          remarks: `Deficiency Raised by College: ${deficiencyReason}. Student notified to re-upload.`
        }
      }
      return a
    }))
    setSelectedApp(null)
    onToast?.(`Deficiency Notice dispatched to student for ${appId}`, 'warning')
  }

  return (
    <div className="college-portal-view fade-in">
      {/* Top Banner: AISHE Institute Selector & Stats */}
      <div className="gov-card college-header-card">
        <div className="college-header-top">
          <div className="college-identity">
            <div className="aishe-badge">
              <Building2 size={24} />
            </div>
            <div>
              <div className="portal-tag">MoTA AISHE Institute Verification Node</div>
              <h1 className="college-name">{currentCollege.name}</h1>
              <div className="college-meta">
                <span>AISHE Code: <strong>{currentCollege.aisheCode}</strong></span> • 
                <span>Ranking: <strong>{currentCollege.ranking}</strong></span> • 
                <span>Nodal Officer: <strong>{currentCollege.nodalOfficer.name}</strong> ({currentCollege.nodalOfficer.email})</span>
              </div>
            </div>
          </div>

          <div className="institute-switcher">
            <label>Switch Institute Context:</label>
            <select 
              value={selectedAishe} 
              onChange={(e) => { setSelectedAishe(e.target.value); setSelectedApp(null); }}
              className="aishe-select"
            >
              {AISHE_DIRECTORY.map(c => (
                <option key={c.aisheCode} value={c.aisheCode}>
                  {c.name} ({c.aisheCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick KPI Metrics */}
        <div className="college-kpi-grid">
          <div className="kpi-box">
            <span className="kpi-num">{applications.filter(a => a.aisheCode === selectedAishe).length}</span>
            <span className="kpi-label">Total Submissions</span>
          </div>
          <div className="kpi-box kpi-pending">
            <span className="kpi-num">{applications.filter(a => a.aisheCode === selectedAishe && a.collegeStatus === 'pending').length}</span>
            <span className="kpi-label">Awaiting Verification</span>
          </div>
          <div className="kpi-box kpi-approved">
            <span className="kpi-num">{applications.filter(a => a.aisheCode === selectedAishe && a.collegeStatus === 'approved').length}</span>
            <span className="kpi-label">Certified Bonafide</span>
          </div>
          <div className="kpi-box kpi-deficiency">
            <span className="kpi-num">{applications.filter(a => a.aisheCode === selectedAishe && a.collegeStatus === 'deficiency').length}</span>
            <span className="kpi-label">Deficiencies Flagged</span>
          </div>
        </div>
      </div>

      {/* Main Verification Workstation */}
      <div className="gov-card college-table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by student name, roll no, or App ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            <button 
              className={`filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All Records
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending Approval
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('approved')}
            >
              Certified
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'deficiency' ? 'active' : ''}`}
              onClick={() => setStatusFilter('deficiency')}
            >
              Flagged Deficiencies
            </button>
          </div>
        </div>

        {/* Applications Verification Table */}
        <div className="table-responsive">
          <table className="college-table">
            <thead>
              <tr>
                <th>App ID & Date</th>
                <th>Student Details</th>
                <th>Roll No / APAAR</th>
                <th>Scheme & Claim</th>
                <th>DigiLocker Status</th>
                <th>Verification Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No applications matching current filters for {currentCollege.name}.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div className="app-id-bold">{app.id}</div>
                      <div className="app-date">{app.appliedDate}</div>
                    </td>
                    <td>
                      <div className="student-name-cell">{app.studentName}</div>
                      <div className="caste-cert-text">Caste: {app.casteCertNo}</div>
                    </td>
                    <td>
                      <div className="roll-badge">{app.rollNumber}</div>
                      <div className="apaar-text">{app.apaarId}</div>
                    </td>
                    <td>
                      <div className="scheme-cell-name">{app.schemeName}</div>
                      <div className="fee-claim-text">{app.totalFeeClaimed}</div>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        <ShieldCheck size={12} /> DigiLocker Validated
                      </span>
                      <div className="inc-status">{app.incomeAmount}</div>
                    </td>
                    <td>
                      <span className={`badge ${app.collegeStatus === 'approved' ? 'badge-success' : app.collegeStatus === 'deficiency' ? 'badge-warning' : 'badge-neutral'}`}>
                        {app.collegeStatus === 'approved' ? 'Bonafide Certified' : app.collegeStatus === 'deficiency' ? 'Deficiency Raised' : 'Pending Review'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-xs action-review-btn"
                        onClick={() => setSelectedApp(app)}
                      >
                        Inspect & Action
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Certification Drawer/Modal */}
      {selectedApp && (
        <div className="modal-overlay fade-in" onClick={() => setSelectedApp(null)}>
          <div className="college-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <div>
                <span className="badge badge-primary">Institutional Bonafide Validation</span>
                <h2>{selectedApp.studentName} — {selectedApp.rollNumber}</h2>
                <p>Application ID: <strong>{selectedApp.id}</strong></p>
              </div>
              <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
            </div>

            <div className="review-modal-body">
              <div className="checklist-box">
                <h3>Institutional Verification Checklist</h3>
                <div className="chk-row">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Student currently enrolled in <strong>{selectedApp.courseName}</strong></span>
                </div>
                <div className="chk-row">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Biometric Attendance: <strong>{selectedApp.attendancePercentage}</strong> (&ge; 75% MoTA mandatory guideline)</span>
                </div>
                <div className="chk-row">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>DigiLocker ST Caste Certificate verified against State Registry</span>
                </div>
                <div className="chk-row">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Claimed Tuition Fee: <strong>{selectedApp.totalFeeClaimed}</strong> conforms to Institute fee gazette</span>
                </div>
              </div>

              <div className="deficiency-section">
                <label>Flag Issue / Request Student Clarification:</label>
                <select 
                  value={deficiencyReason} 
                  onChange={(e) => setDeficiencyReason(e.target.value)}
                  className="deficiency-select"
                >
                  <option value="Fee receipt mismatch with current academic session">Fee receipt mismatch with current academic session</option>
                  <option value="Bonafide certificate signature expired/illegible">Bonafide certificate signature expired/illegible</option>
                  <option value="Attendance percentage falls below 75% threshold">Attendance percentage falls below 75% threshold</option>
                  <option value="Course registered on portal differs from Institute ERP database">Course registered on portal differs from Institute ERP database</option>
                </select>
              </div>

              <div className="review-actions">
                <button 
                  className="btn btn-warning"
                  onClick={() => handleFlagDeficiency(selectedApp.id)}
                >
                  <AlertTriangle size={15} /> Flag Deficiency to Student
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleApprove(selectedApp.id)}
                >
                  <CheckCircle2 size={15} /> Digitally Certify & Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
