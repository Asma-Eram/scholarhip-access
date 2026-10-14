import { useState } from 'react'
import './Login.css'

export default function Login({ onLogin, onToast }) {
  const [phone, setPhone] = useState('9876543210')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1=phone, 2=otp, 3=digilocker
  const [loading, setLoading] = useState(false)
  const addToast = (msg, type) => {
    if (onToast) onToast(msg, type)
  }

  const sendOtp = () => {
    if (phone.length < 10) return addToast('Enter valid 10-digit mobile number', 'warning')
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(2); addToast('OTP sent: 123456 (demo)', 'success') }, 800)
  }

  const verifyOtp = () => {
    if (otp !== '123456') return addToast('Wrong OTP. Use 123456 for demo', 'warning')
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(3) }, 700)
  }

  const linkDigilocker = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); addToast('DigiLocker linked successfully!', 'success'); setTimeout(onLogin, 600) }, 1000)
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-logo">
            <img src="/logo.png" alt="ScholarBridge Logo" className="login-logo-img" />
          </div>
          <h1>ScholarBridge</h1>
          <p>National Scholarship Portal Gateway</p>
          <div className="login-subtitle">Unified zero-touch verification for all national scholarship schemes</div>
        </div>

        <div className="login-steps">
          {[1,2,3].map(s => (
            <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="login-form fade-in">
            <div className="login-step-title">📱 Mobile Login</div>
            <label className="input-label">Mobile Number / Aadhaar-linked</label>
            <div className="phone-input-wrap">
              <span className="phone-prefix">+91</span>
              <input
                className="input phone-input"
                type="tel" maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
              />
            </div>
            <button className="btn btn-primary btn-full" onClick={sendOtp} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Send OTP'}
            </button>
            <button 
              type="button" 
              className="btn-text" 
              style={{ marginTop: 8, width: '100%', fontSize: '13px', fontWeight: 600, color: 'var(--royal-700)' }} 
              onClick={onLogin}
            >
              ⚡ Instant Demo Access (Skip Login)
            </button>
            <div className="login-hint">OTP will be sent to Aadhaar-registered mobile (Demo: <strong>123456</strong>)</div>
          </div>
        )}

        {step === 2 && (
          <div className="login-form fade-in">
            <div className="login-step-title">🔐 Enter OTP</div>
            <label className="input-label">6-digit OTP sent to +91 {phone}</label>
            <input
              className="input otp-input"
              type="tel" maxLength={6}
              placeholder="1 2 3 4 5 6"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
            />
            <button className="btn btn-primary btn-full" onClick={verifyOtp} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Verify OTP'}
            </button>
            <button className="btn-text" onClick={() => setStep(1)}>← Change number</button>
            <div className="login-hint">Demo OTP: <strong>123456</strong></div>
          </div>
        )}

        {step === 3 && (
          <div className="login-form fade-in">
            <div className="login-step-title">📂 Link DigiLocker</div>
            <div className="digilocker-info">
              <div className="dl-icon">🏛️</div>
              <div>
                <div style={{fontWeight:600,marginBottom:4}}>Connect DigiLocker</div>
                <div style={{fontSize:12,color:'var(--text2)'}}>
                  Auto-fetch your Domicile Certificate, Aadhaar & academic documents. No re-uploading needed.
                </div>
              </div>
            </div>
            <div className="dl-perms">
              {['State Domicile Certificate', 'Aadhaar Card', 'Marksheets & Degrees', 'Income Certificate'].map(p => (
                <div key={p} className="dl-perm-item">✅ {p}</div>
              ))}
            </div>
            <button className="btn btn-primary btn-full" onClick={linkDigilocker} disabled={loading}>
              {loading ? <span className="spinner" /> : '🔗 Link DigiLocker & Continue'}
            </button>
            <button className="btn-text" onClick={onLogin}>Skip for now</button>
          </div>
        )}

        <div className="login-footer">
          <span>National Scholarship Gateway | Ministry of Education</span>
          <div className="login-logos">
            <span>🇮🇳</span> <span>GoI</span> <span>·</span> <span>ScholarBridge</span>
          </div>
        </div>
      </div>
    </div>
  )
}
