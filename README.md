# ScholarBridge — Universal Scholarship & Transparency Gateway

<p align="center">
  <a href="https://scholarhip-access.vercel.app"><img src="https://img.shields.io/badge/Live%20Portal-scholarhip--access.vercel.app-success?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <a href="https://github.com/Asma-Eram/scholarship-access"><img src="https://img.shields.io/badge/GitHub-scholarship--access-blue?style=for-the-badge&logo=github" alt="GitHub Repo" /></a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/PWA-Enabled-purple?style=for-the-badge&logo=pwa" alt="PWA" />
</p>

> **ScholarBridge** is a universal scholarship, financial aid & transparency gateway — bringing direct DigiLocker verification, real-time audit tracking, and seamless student & institutional portals into one unified platform.

---

## 🌐 Live Demo

👉 **[https://scholarhip-access.vercel.app](https://scholarhip-access.vercel.app)**

---

## 🎯 The Problem

Scholarship schemes for Scheduled Tribe (ST) students are spread across multiple disconnected portals — NSP, Canara Bank SFMP, and standalone ministry portals. This leads to:

- 📑 **Document Fatigue** — same certificates re-uploaded across every portal
- ⚠️ **Fund Freezes** — no automated conflict resolution when students switch schemes (GFR Rule 11)
- 🗣️ **Language Barriers** — portals only in English/Hindi, excluding native tribal dialect speakers
- 👨‍👩‍👦 **No Household Tracking** — family quota exhaustion goes undetected

---

## 💡 The Solution: ScholarBridge

A single-window **Progressive Web App** unifying all 5 Ministry of Tribal Affairs (MoTA) scholarship schemes with automated governance, AI assistance, and offline capability.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Dashboard** | Personalized student home with live scheme status & alerts |
| 📋 **Schemes Explorer** | All 5 MoTA schemes in one place with detailed eligibility info |
| 🔍 **Eligibility Finder** | Smart questionnaire that instantly matches you to the right scheme |
| 📁 **Document Vault** | DigiLocker-synced documents — upload once, reuse everywhere |
| 📊 **Application Tracker** | Real-time 5-stage PFMS pipeline tracking per application |
| ⚖️ **Conflict Resolver** | GFR Rule 11 engine — detects overlap & guides digital NOC relinquishment |
| 🤖 **Grievance Assistant** | Google Gemini AI-powered chatbot for dispute resolution (Sahayak) |
| 👨‍👩‍👦 **Family Overview** | Household-level sibling tracking with PVTG-aware quota management |
| 🏫 **College Admin Portal** | Institution-side bonafide verification & application management |
| 📴 **Offline Mode** | Real-time online/offline detection with full PWA local cache support |
| 🌐 **Multi-language** | English & Hindi toggle with a localization engine |
| 🔔 **Notifications** | Real-time toast alerts & notification drawer |
| 🔐 **Dual Role Login** | Separate flows for Students and College Admins |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, CSS Modules, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **AI** | Google Gemini (`@google/generative-ai`) |
| **Deployment** | Vercel (frontend) · Render (backend) |
| **PWA** | Web App Manifest, offline cache, installable |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Asma-Eram/scholarship-access.git
cd scholarship-access

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, Gemini API key, etc.

# Run frontend (dev)
npm run dev

# Run backend (separate terminal)
npm run server
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Student** | Apply for schemes, track applications, manage documents, raise grievances, view family overview |
| **College Admin** | Verify student bonafides, manage institutional applications, view AISHE data |

---

## 📄 Project Report

See [PROJECT_REPORT.md](./PROJECT_REPORT.md) for detailed architecture, feature breakdown, and system design.
