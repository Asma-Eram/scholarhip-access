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
  AlertCircle
} from 'lucide-react'
import './HelpSupportModal.css'

export default function HelpSupportModal({ lang, onClose, onNavigate }) {
  const faqs = [
    {
      q: 'How does DigiLocker Zero-Touch Autofill work?',
      a: 'TRISHA securely interfaces with the DigiLocker National Gateway via Aadhaar e-KYC consent. It cryptographically pulls and verifies your ST Caste Certificate, Parental Income Certificate, Class 10/12 Marksheets, and APAAR Academic Credit record, automatically mapping them to your scholarship claim.'
    },
    {
      q: 'What is the "One-Active-Scholarship" MoTA Policy (Rule 11)?',
      a: 'Under Rule 11 of the General Financial Rules (GFR 2017), an ST student cannot receive concurrent maintenance allowances or fellowships for the same educational tier. If shifting from Post-Matric to Top-Class or NFST, TRISHA generates an automated digital No-Objection Certificate (NOC).'
    },
    {
      q: 'When does the College Nodal Officer verify my application?',
      a: 'Once submitted, your application reaches your institution within 24 hours. The designated Institutional Nodal Officer verifies your bonafide admission, course fee structure, and biometric attendance (minimum 75% required by MoTA).'
    },
    {
      q: 'How do I resolve a flagged deficiency?',
      a: 'Go to the "Track Status" tab. If an issue is flagged by your college or State Welfare Department (e.g. illegible seal on Income certificate), click "Re-verify via DigiLocker Live Sync" to instantly fetch an updated copy without visiting an office.'
    }
  ]

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="help-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <div className="help-title-group">
            <span className="badge badge-primary"><HelpCircle size={13} /> Support & Guidance</span>
            <h2>Ministry of Tribal Affairs Help Desk</h2>
            <p>Unified Citizen Redressal & Institutional Guidance Cell</p>
          </div>
          <button className="close-btn" onClick={onClose}>
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
                <span className="contact-value">1800-11-7788</span>
                <span className="contact-sub">Available Mon-Sat (9:00 AM – 6:00 PM)</span>
              </div>
            </div>

            <div className="helpline-contact-box">
              <div className="contact-icon-circle email">
                <Mail size={18} />
              </div>
              <div className="contact-details">
                <span className="contact-label">Official Grievance Support</span>
                <span className="contact-value">support.scholarship@mota.gov.in</span>
                <span className="contact-sub">Average response SLA: 24 to 48 hours</span>
              </div>
            </div>

            <div className="helpline-contact-box ai-box">
              <div className="contact-icon-circle ai-icon">
                <MessageCircle size={18} />
              </div>
              <div className="contact-details">
                <span className="contact-label">24/7 AI Multilingual Assistant</span>
                <span className="contact-value">Tribal AI Sahayak</span>
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
