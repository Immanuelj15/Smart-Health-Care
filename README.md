# 🩺 SmartHealth Portal: Premium Healthcare Experience

![Banner](https://img.shields.io/badge/Status-Premium_UI_Active-indigo.svg?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN_Fullstack-cyan.svg?style=for-the-badge)

SmartHealth is a world-class, MERN-stack healthcare platform designed to provide an elite digital experiences for patients, doctors, and administrators. Featuring a **glassmorphic design system**, **AI-powered diagnostics**, and **secure clinical protocols**.

---

## ✨ Key Features

### 💎 Elite User Interface
- **Modern Glassmorphism**: A custom-designed UI using Indigo & Cyan palettes with translucent layers.
- **Micro-animations**: Smooth transitions, floating elements, and interactive haptics throughout the app.
- **Responsive Mastery**: Seamless experience across Desktop, Tablet, and Mobile.

### 🤖 Intelligence & Specialized Tools
- **Dr. Smart (AI Chatbot)**: Integrated Gemini AI-powered assistant for general health questions and portal navigation.
- **Nutrition AI Scanner**: High-impact tool to analyze food intake through advanced clinical data.
- **Symptom Analyzer**: An AI-driven diagnostic protocol to identify potential conditions.
- **Telemedicine Studio**: Secure, professional video conferencing for remote consultations.

### 🏥 Medical Infrastructure
- **Global Specialty Network**: Find and book certified doctors across major metropolitan regions.
- **Secure Records Archive**: Cryptographic repository for clinical documentation with 256-bit AES visual cues.
- **Surgical Optimization**: Specialized platform for clinical surgery centers and booking.
- **Clinical Pharmacy**: Modern marketplace for medicines with category-based scanning.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, Framer Motion, Axios, React Hot Toast |
| **Backend** | Node.js, Express.js, Socket.io, Nodemailer |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI Layer** | Google Gemini API (Pro Model) |
| **Security** | JWT (JSON Web Tokens), bcryptjs, Google OAuth 2.0 |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for OAuth)
- Gemini AI API Key

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Immanuelj15/Smart-Health-Care.git
cd Smart-Health-Care

# Setup Backend
cd backend
npm install
# Create .env (refer to .env.example)
npm run dev

# Setup Frontend
cd ../frontend
npm install
# Create .env (refer to .env)
npm run dev
```

### 3. Dummy Accounts for Testing
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `password123` |
| **Doctor** | `doctor@test.com` | `password123` |
| **Patient** | `patient@test.com` | `password123` |

---

## 🛡️ Security Note
The system uses secure environment variables for all sensitive keys (API Keys, JWT Secrets, Database URIs). Always ensure these are added to your local `.env` before starting the development environment.

---
