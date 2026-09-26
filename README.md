# GATE 2027 CS/IT — 90-Day AI Study Manager & Personal Coach

> **"Tell me exactly what I should do today, guide me through the day, remind me what is pending, and launch verified external study resources."**

A production-grade **AI-powered GATE preparation manager and personal study coach**, specifically engineered for GATE CS/IT aspirants following the **3-Month Master Timetable (October 1 to December 29, 2026)**.

---

## 🏛️ Core Design Philosophy: Study Manager, Not Course Platform

In strict accordance with the Master Architecture:
- **No duplicated or pirated courses:** Theory and video roadmaps launch directly out to **Gate Smashers** or official IIT Madras portals.
- **No copied question bank:** Previous Year Questions link directly to authentic community discussions on **GATEOverflow**.
- **The Golden Rule:** *One Subject = One Consistent Learning Source.*
- **AI Personal Coach:** Powered by **Groq API** (`llama-3.3-70b-versatile`) for daily briefings, time compression, missed-day recovery plans, trap warnings, and doubt resolution.
- **Zero Friction Vercel Deployment:** Built with Next.js 14.2 App Router, TypeScript, and Tailwind CSS.

---

## 🚀 Key Modules & Capabilities

### 1. Today Command Center (`/`)
- Answers the core question: **"What do I do today?"**
- **Available-Time Mode (2h / 3h / 4h / 6h / 8h+):** Dynamically adjusts daily targets. On a 2h busy day, core concepts and top PYQs are prioritized while deferring deep exploration.
- **Daily AI Briefing:**
  * Mission statement
  * Why it matters in GATE weightage
  * Prerequisites to check
  * Exactly what to study vs what NOT to study
  * Definition of success for the day
- **7-Step Task Sequence:**
  1. Quick Formula & Revision Warm-up (15m)
  2. Theory Study via Gate Smashers verified roadmap (120m)
  3. Concept Notes & Formula Sheet (30m)
  4. GATEOverflow PYQs Practice (60m)
  5. AI Practice Questions & Traps (30m)
  6. Digital Error Book Log (15m)
  7. General Aptitude / Engineering Math (30m)
- **External Resource Launchers:** Direct `[ Open Gate Smashers ↗ ]` and `[ Open GATEOverflow ↗ ]` action buttons on every task.

### 2. 90-Day Master Plan (`/plan`)
- **Visual 3-Month Calendar:** October (Foundation), November (Core Systems), December (Networks & Revision).
- **Chronological Timeline:** Day 1 through Day 90 with subtopics, hours, and status tracking.
- **Subject Breakdown:** Grouped view by 12 GATE subjects showing days allocated and completion percentage.
- **Missed-Day Overlay & Recovery:** Mark any day as missed to trigger an AI recovery plan without shifting the immovable exam date.

### 3. Previous Year Questions (PYQ) Tracker (`/pyqs`)
- Direct 1-click launchers for high-yield GATEOverflow topic discussions.
- Practice Session Logger:
  * Subject & topic
  * Questions attempted & correct
  * Auto-calculated accuracy %
  * Time spent
  * Confidence rating: **A** (Confident), **B** (Minor doubt), **C** (Guessed), **D** (Wrong/stuck)
- **Auto-prompt:** Rating C or D immediately prompts 1-click addition to your digital Error Book!

### 4. Digital Error Book (`/error-book`)
- **13 Subject Folders:** From `01_C_PROGRAMMING` to `13_GENERAL_APTITUDE`.
- Categorizes mistakes: `concept_gap`, `reading_error`, `formula_error`, `calculation_error`, `time_pressure`.
- Mandatory reflection: *"Why I got it wrong"*, *"The concept I missed"*, and *"One-line rule to never make this mistake again"*.
- AI Tutor button: *"Teach Me This Mistake Again"* pre-populates the coach with the missed concept.

### 5. Central Resource Registry (`/resources`)
- Verified, categorized repository of external learning resources.
- Search and filter by provider (Gate Smashers, GATEOverflow, Official IITM), resource type, and subject.

### 6. AI Practice Lab (`/practice`)
- Unseen, freshly generated challenges designed to test boundary conditions and examiner traps.
- Clearly watermarked: **"AI-Generated Practice — Not an official GATE question"**.

### 7. Spaced Repetition Engine (`/revision`)
- Automated flashcard review intervals: Day 0 $\to$ +1d $\to$ +3d $\to$ +7d $\to$ +14d $\to$ +30d.

### 8. CBT Mock Exam Simulator (`/mocks`)
- 3-Hour full mock examination replicating TCS iON interface.
- Virtual Scientific Calculator modal.
- Question Palette with official status color coding.
- Authentic GATE marking scheme with negative marks.

### 9. Ask AI Coach (`/ai`)
- Conversational study partner powered by **Groq API** (`llama-3.3-70b-versatile`).
- Context-aware engine injecting active day, current topic, and confidence metrics.

---

## 🛠️ Setup & Running Locally

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd website
npm install
```

### 2. Configure Environment (Optional for Groq AI)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Groq API key:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```
*(Note: If you do not provide a key in `.env.local`, you can still enter your personal Groq key directly in the `/settings` or `/ai` page in the browser, or use the built-in heuristic fallback.)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Zero-Friction Deployment on Vercel

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Next.js will be automatically detected with zero custom configuration.
4. (Optional) In **Environment Variables**, add:
   - `GROQ_API_KEY`: `gsk_...`
5. Click **Deploy**. The site will build cleanly and deploy to a live `.vercel.app` URL within 60 seconds!
