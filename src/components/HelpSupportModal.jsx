import { 
  X, 
  HelpCircle, 
  Phone, 
  Mail, 
  Clock, 
  FileQuestion, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle,
  Building2,
  CheckCircle2
} from 'lucide-react'
import './HelpSupportModal.css'

export default function HelpSupportModal({ lang, onClose, onNavigate }) {
  const faqs = [
    {
      q: 'How does DigiLocker Zero-Touch Verification work?',
      a: 'ScholarBridge securely interfaces with the DigiLocker National Gateway via Aadhaar e-KYC consent. It cryptographically fetches and verifies your Domicile Certificate, Parental Income Certificate, Class 10/12 Marksheets, and APAAR Academic Credit record, automatically mapping them to your scholarship claim.'
    },
    {
      q: 'What is the "One-Active-Scholarship" Central Policy (Rule 11/GFR 2017)?',
      a: 'Under Rule 11 of the General Financial Rules (GFR 2017), a student cannot concurrently avail multiple central or state scholarships for the same educational course. ScholarBridge provides an automated digital No-Objection Certificate (NOC) and scheme relinquishment workflow if transitioning to a higher merit fellowship.'
    },
    {
      q: 'When does the College Nodal Officer verify my application?',
      a: 'Once submitted, your application reaches your institution within 24 hours. The designated Institutional Nodal Officer verifies your bonafide admission, course fee structure, and attendance records on the Institutional Desk.'
    },
    {
      q: 'How do I resolve a flagged deficiency?',
      a: 'Navigate to the "Live Application Tracker" tab. If an issue is flagged by your college or State Higher Education Directorate (e.g. illegible seal on Income certificate), click "Re-verify via DigiLocker Live Sync" to instantly fetch an updated certified copy without visiting an office.'
    }
  ]

  return (
    <div className="modal-overlay fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
      <div className="help-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <div className="help-title-group">
            <span className="badge badge-primary"><HelpCircle size={13} /> Support & Guidance</span>
            <h2 id="help-modal-title">National Scholarship Help & Support Desk</h2>
            <p>Unified Citizen Redressal & Institutional Guidance Gateway</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close help modal">
            <X size={20} />
          </button>
        </div>

        <div className="help-modal-body">
          {/* Quick Helplines */}
          <div className="helpline-cards-grid">
            <div className="helpline-contact-box">
              <div className="contact-icon-circle tollfree">
                <Phone size={18} />
              </div>
              <div className="contact-details">
                <span className="contact-label">Toll-Free National Helpline</span>
                <span className="contact-value">1800-11-2255</span>
                <span className="contact-sub">Available Mon-Sat (9:00 AM – 6:00 PM IST)</span>
              </div>
            </div>

            <div className="helpline-contact-box">
              <div className="contact-icon-circle email">
                <Mail size={18} />
              </div>
              <div className="contact-details">
                <span className="contact-label">Official Grievance Support</span>
                <span className="contact-value">support.scholarship@gov.in</span>
                <span className="contact-sub">Average response SLA: 24 to 48 hours</span>
              </div>
            </div>

            <div className="helpline-contact-box ai-box">
              <div className="contact-icon-circle ai-icon">
                <MessageCircle size={18} />
              </div>
              <div className="contact-details">
                <span className="contact-label">24/7 AI Multilingual Advisor</span>
                <span className="contact-value">ScholarBridge AI</span>
                <button 
                  className="open-assistant-btn"
                  onClick={() => { onClose(); onNavigate?.('assistant'); }}
                >
                  Open Chatbot with Voice &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="help-faqs-section">
            <h3 className="section-heading">Frequently Asked Questions</h3>
            <div className="faqs-stack">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <h4 className="faq-q"><FileQuestion size={16} /> {faq.q}</h4>
                  <p className="faq-a">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="help-modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close Help & Support
          </button>
        </div>
      </div>
    </div>
  )
}
