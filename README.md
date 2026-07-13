# IlmAI — AI-Powered Board Exam Prep

> **IlmAI** is an intelligent study companion for Pakistani high school and college students preparing for board exams (BSEK, BIEK, and others). Chat with AI, snap & solve questions, create smart flashcards, take practice tests, and track your progress — all in one place.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **AI Chat Assistant** | Get instant answers to board subject questions with an AI tutor trained on Pakistan's curriculum |
| **Snap & Solve** | Snap a photo of any exam question and receive an AI-generated step-by-step solution |
| **Smart Flashcards** | Generate AI-powered flashcards from notes and textbooks with spaced repetition |
| **Board Exam Prep** | Past papers, model papers, and board-specific material for BSEK, BIEK, and more |
| **Practice Tests** | Timed mock exams with auto-grading and performance analytics |
| **Board News Feed** | Real-time exam schedules, results, and announcements from Pakistani boards |
| **Digital Library** | 100+ free board textbooks, reference books, and study guides |
| **Performance Analytics** | Visual dashboards tracking progress, scores, and improvement trends |

## 🎨 Design

Premium blue/ice-white glassmorphism theme with:
- Frosted glass cards (`backdrop-blur-xl`)
- 3D floating particle field
- Smooth framer-motion animations
- Neon gradient text accents
- Fully responsive (mobile-first)

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Authentication** | Firebase Auth (email/password + Google) |
| **Database** | Firestore (NoSQL) |
| **Animations** | framer-motion |
| **Notifications** | react-hot-toast |
| **Fonts** | Inter + JetBrains Mono |

## 📁 Project Structure

```
ilm-ai-subscription-web/
├── app/
│   ├── admin/          # Admin hub (payment requests, live metrics)
│   ├── components/     # Reusable UI components
│   │   ├── AuthModal.tsx
│   │   ├── DownloadBanner.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ParticleField.tsx
│   │   ├── PricingCard.tsx
│   │   └── Reveal.tsx
│   ├── pay/            # Billing portal
│   ├── globals.css     # Theme, glassmorphism utilities, animations
│   ├── layout.tsx      # Root layout with AuthProvider
│   └── page.tsx        # Landing page
├── lib/
│   ├── auth.tsx        # Firebase Auth context
│   └── firebase.ts     # Firebase init + admin config
└── public/
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- A Firebase project with Auth and Firestore enabled

### Installation

```bash
git clone https://github.com/hmdLabs786/IlmAI-Web.git
cd IlmAI-Web
npm install
```

### Environment

Create a `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
npm run dev
```

### Production Build

```bash
node .\node_modules\next\dist\bin\next build --experimental-build-mode=compile
node .\node_modules\next\dist\bin\next build --experimental-build-mode=generate
```

## 🧑‍💼 Admin Access

Set `ADMIN_EMAIL` in `lib/firebase.ts` to your email address. The Admin hub at `/admin` will then be accessible, showing pending payment requests and live platform metrics.

## 💳 Payments

- **JazzCash:** `03092792622` — Account Name: **IRAM**
- Users submit a 12-digit TID via the `/pay` portal
- Admin approves/rejects requests; approved users get their `subscriptionTier` updated

## 📄 License

MIT
