# CASEFILE ZERO: The Last Alibi 🔍

> **A locked-room cyberpunk noir murder mystery powered by Next.js 16, React 19, and Groq-accelerated AI interrogation.**

---

## 📖 Overview

**CASEFILE ZERO** drops players into the detective's trench coat on the 47th floor of NovaMind Technologies HQ. Just 48 hours before a historic $4.2 billion Wall Street IPO, brilliant founder & CEO Dr. Adrian Voss is found dead inside his magnetically locked executive suite.

Players investigate the crime scene, uncover physical forensic clues, cross-examine prime suspects in an AI-powered interrogation suite, and assemble an indictment on the interactive Evidence Board.

### Highlights
- 🧠 **Dynamic AI Interrogation**: Cross-examine suspects in real time powered by Groq's low-latency LPU inference. Suspects remember conversation context and react defensively to physical evidence.
- 🛡️ **Canonical Determinism**: Scoring, crime scene hotspots, clue cataloging, and the true culprit remain 100% deterministic. The AI is strictly constrained against hallucinating clues, altering the killer, or changing case scores.
- 📋 **Zero-Breakage Graceful Fallback**: The game operates out of the box even without an API key using canonical dialogue records.
- 🔒 **Zero-Leak Server Architecture**: `GROQ_API_KEY` is consumed exclusively inside server-side Route Handlers and is never exposed to browser bundles.

---

## 👥 Persons of Interest

| Suspect | Role | Personality | Canon Status |
| :--- | :--- | :--- | :--- |
| **Elena Marchetti** | Chief Operating Officer | Ruthless, icy, corporate manipulator | **True Culprit** |
| **Marcus Chen** | Lead Software Architect | Caffeinated, intense, defensive | **Innocent** |
| **Diana Okafor** | Head of Corporate Security | Stoic, ex-military intelligence (Kandahar) | **Innocent** |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.4.3](https://nextjs.org/) (App Router + Turbopack)
- **UI Library**: [React 19.3.0](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom cyberpunk noir palette
- **AI Engine**: [Groq SDK](https://console.groq.com/) (Default: `qwen/qwen3.8-27b` / `llama-3.3-70b-versatile` / `openai/gpt-oss-120b`)
- **State Management**: React `useSyncExternalStore` + `localStorage` persistence

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20.0.0 or higher (v24 LTS recommended)
- **npm**: v10.0.0 or higher

### 2. Installation
```bash
git clone <repository-url>
cd casefile-zero
npm install
```

### 3. Environment Configuration
Copy the sample environment file to `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Groq API key:
```env
# Get a free key at https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional: Preferred Groq model (auto-falls back if unavailable)
GROQ_MODEL=qwen/qwen3.8-27b
```

> **Note**: `.env.local` is git-ignored by default. Never commit API keys to version control.

### 4. Running Locally
Start the development server with Turbopack:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

### Code Quality & Static Analysis
```bash
npm run lint
```
*Runs ESLint with Next.js rules. Must pass with 0 errors and 0 warnings.*

### Production Build
```bash
npm run build
```
*Validates static page generation and dynamic `/api/interrogate` compilation.*

### End-to-End Automated Browser Audit
```bash
node scripts/test-e2e.mjs
```
*Runs Puppeteer across all 8 investigative scenarios:*
1. Landing page navigation & case briefing
2. Crime scene hotspot discovery & 6/6 clue cataloging
3. Duplicate click rejection & alert feedback
4. LocalStorage persistence across page reloads
5. Suspect interrogation & evidence-unlocked breakthrough questioning
6. Transcripts retention for Elena, Marcus, and Diana
7. Evidence board submission (Elena = 100/100 Master Detective; Marcus = 0/100 Wrongful Conviction)
8. Full case state restart & cache invalidation

---

## 🌐 Production Deployment

### Option A: Vercel (Recommended)
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into [Vercel](https://vercel.com/new).
3. Under **Project Settings → Environment Variables**, add:
   - `GROQ_API_KEY` = your Groq API key
   - `GROQ_MODEL` = `qwen/qwen3.8-27b` (or preferred model)
4. Deploy. Next.js App Router and the `/api/interrogate` route will deploy as an Edge/Serverless function.

### Option B: Node.js Standalone Server
```bash
# 1. Build production bundle
npm run build

# 2. Run production server
npm run start -p 3000
```

---

## 🔒 Security Architecture

1. **Server Isolation**: Interrogation prompts and secret keys are consumed exclusively within `app/api/interrogate/route.ts`.
2. **Payload Sanitization**: Server responses return sanitized `{ answer, isFallback, model }` objects. Secret keys are never serialized.
3. **Resilience**: If the API key is missing, rate-limited, or network fails, the server and client automatically fall back to canonical dialogue records with no interruption to gameplay.

---

## 📜 License
Private & Confidential — Casefile Zero Investigation System.
