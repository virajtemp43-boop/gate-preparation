# GATE 2027 CS/IT — 90-Day AI Study Platform

A complete, production-grade personal GATE preparation command center built for B.Tech IT students starting from scratch. Powered by a deterministic 90-day timetable (October 1 to December 29, 2026), built-in beginner-friendly lessons with KaTeX math rendering, real PYQ practice with A/B/C/D confidence tagging, fresh GATE-style challenges, spaced repetition, a 13-category Error Book, authentic CBT mock exam simulation, and a context-aware AI Tutor powered by **Groq API** (`llama-3.3-70b-versatile`).

---

## 🚀 Key Features & Modules

1. **Dashboard (`/`)**:
   - 3-Month interactive calendar tabs (Month 1: Foundation, Month 2: Core Systems, Month 3: Networks & Consolidation).
   - Pre-Launch countdown before October 1, 2026 with Day 1 preview.
   - Today's mission hero card with direct action buttons.
   - Slide-over study drawer with subtopics and 8-step daily checklist.

2. **Today Cockpit (`/today`)**:
   - The daily execution loop (`Learn` $\to$ `Basic Practice` $\to$ `PYQ` $\to$ `Fresh Questions` $\to$ `AI Help` $\to$ `Error Book` $\to$ `Revision` $\to$ `Complete Day`).
   - Time-block tracker based on the recommended 6-hour daily schedule.
   - Built-in Pomodoro focus timer (25/50/90 minutes).
   - Confetti milestone celebration upon completing all daily tasks.

3. **Learn Center (`/learn` and `/learn/[id]`)**:
   - Original lessons covering C Programming, Data Structures, Algorithms, COA, DBMS, OS, Computer Networks, and more.
   - Standard 14-section pedagogical structure: Prerequisites $\to$ Intuition $\to$ Formal Definition $\to$ Formulas $\to$ Worked Examples $\to$ GATE Traps $\to$ Quick Check.
   - Mathematical typesetting powered by KaTeX.

4. **PYQ Lab (`/pyqs`)**:
   - Filterable real GATE questions (2000–2024) across MCQ, MSQ, and NAT formats.
   - Confidence tagging (A: Confident, B: Slow/Uncertain, C: Wrong/Stuck, D: New Concept).
   - Verified solution reveal with direct links to GATEOverflow discussions.

5. **Practice Lab (`/practice`)**:
   - Newly authored, unseen GATE-style practice questions testing common traps.
   - Live AI question generation button calling Groq API.
   - Virtual keypad for NAT numerical calculations.

6. **AI Tutor Cockpit (`/ai`)**:
   - Powered by **Groq API** (`llama-3.3-70b-versatile`).
   - Context-Aware Engine injecting current preparation day, active subject, active topic, and recent mistakes.
   - 10 Operational Modes: `Explain from Zero`, `Simplify / Analogy`, `GATE Deep Dive`, `Give Next Hint`, `Step-by-Step Solve`, `Quiz Me`, `Interview Me (Socratic)`, `PYQ Explainer`, `Analyze My Mistake`, and `Generate Flashcard`.
   - Built-in intelligent heuristic fallback ensuring zero downtime even without an API key.

7. **Error Book (`/error-book`)**:
   - Structured across the 13 official subject folders (`01_C_PROGRAMMING` to `13_GENERAL_APTITUDE`).
   - Tracks why the student made the mistake (`concept_gap`, `calculation`, `reading`, `formula`, `guessing`, etc.).
   - *"Teach me this mistake again"* AI recovery workflow.

8. **Revision Center (`/revision`)**:
   - Spaced repetition queue following the Day 0 $\to$ +1 $\to$ +3 $\to$ +7 $\to$ +14 $\to$ +30 scientific cycle.
   - Quick-flip formula and trap revision flashcards.

9. **CBT Mock Simulator (`/mocks`)**:
   - Authentic 3-hour GATE CBT interface with countdown timer.
   - Virtual Scientific Calculator modal.
   - Question Palette with status color coding (Answered, Not Answered, Marked for Review).
   - Accurate negative marking ($-1/3$ for 1-mark MCQ, $-2/3$ for 2-mark MCQ, 0 for MSQ/NAT).
   - 14-metric post-exam diagnostic evaluation table.

10. **Resource Library (`/resources`)**:
    - Verified links to the official GATE 2027 IIT Madras portal, Gate Smashers topic roadmaps, GATEOverflow, and NPTEL.

11. **Analytics Dashboard (`/analytics`)**:
    - Rule-based weakness detector flagging topics with accuracy $< 60\%$ or $2+$ repeated errors.
    - Syllabus completion progress and study streaks.

12. **Settings & Data Backups (`/settings`)**:
    - Groq API key configuration and model selection.
    - Daily study hours profile customization (4h, 6h, 8h).
    - Download Error Book as CSV and Download Complete Preparation Report as Markdown.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom slate academic theme
- **Math Engine**: KaTeX (`katex`)
- **Icons**: Lucide React (`lucide-react`)
- **AI Engine**: Groq Cloud API (`groq-sdk` & OpenAI-compatible endpoint)

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Groq API key to `.env.local` (or enter it in the website settings):
```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_your_groq_api_key_here
AI_MODEL=llama-3.3-70b-versatile
AI_BASE_URL=https://api.groq.com/openai/v1
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```
