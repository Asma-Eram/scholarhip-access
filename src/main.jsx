import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)

// Register Service Worker for PWA & Offline Support
if ('serviceWorker' in navigator && !window.location.host.startsWith('localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => console.log('[ScholarBridge PWA] Service Worker registered:', reg.scope),
      (err) => console.warn('[ScholarBridge PWA] Service Worker registration failed:', err)
    )
  })
} else if ('serviceWorker' in navigator) {
  // Also register in local preview/dev testing if desired
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
