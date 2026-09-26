# GATE 2027 AI Study Platform — Master Build Prompt

## 0. ROLE

You are a senior full-stack engineer, product designer, education-platform architect, and AI tutor-system designer.

Build a complete, production-quality **GATE 2027 CS / IT 90-Day AI Study Platform** for a B.Tech IT student who is starting GATE preparation from scratch.

The product must replace the need to repeatedly open a static Markdown timetable. The student should open the website every day and immediately see:

> **What I have to study today → learn the concept → practice → solve PYQs → solve fresh questions → ask AI → record mistakes → complete the day.**

The website must treat the supplied 90-day plan as the source of truth for the preparation calendar.

---

# 1. CORE PRODUCT IDEA

Create a personal GATE command center with these major areas:

1. **Home / Dashboard** — interactive 3-month timetable on the front page.
2. **Today** — exact tasks for today, with completion tracking.
3. **Learn** — original beginner-friendly lessons for every GATE CS subject and topic.
4. **PYQ Lab** — previous-year questions organized by subject/topic/year/type/difficulty.
5. **Practice Lab** — fresh GATE-style questions generated and stored by the system.
6. **AI Tutor** — context-aware AI that teaches, explains, quizzes, hints, analyzes mistakes, and creates study plans.
7. **Subjects** — full syllabus tree and progress by subject/topic.
8. **Revision Center** — spaced revision queue and rapid revision sheets.
9. **Error Book** — every wrong question becomes structured revision data.
10. **Mock Tests** — timed full-length and subject/topic tests.
11. **Resources** — verified external learning links and official references.
12. **Analytics** — score, accuracy, time, consistency, weak areas, PYQ performance, revision health.
13. **Settings** — exam date, study hours, timezone, AI provider, preferences, data export.

The site should feel like a serious personal exam cockpit, not a generic LMS.

---

# 2. IMPORTANT USER CONTEXT

Student profile assumptions:

- Degree: B.Tech Information Technology
- GATE paper: CS — Computer Science & Information Technology
- Starting level: beginner / scratch
- Preparation mode: 90-day focused plan
- Goal: build concepts from zero, practice heavily, master PYQs, and complete mocks
- Preferred learning style: simple explanations first, then exam-level depth
- Wants newly generated practice questions in addition to real PYQs
- Wants an interactive timetable on the home page
- Wants the website itself to contain beginner-friendly subject learning material
- Does not want to depend on reopening a Markdown file every day

Do not assume the student already knows undergraduate CS deeply.

## 2.1 FIXED 90-DAY CALENDAR START

The 90-day preparation must **start on October 1, 2026**. Do not use the current browser date or onboarding date as the start of the core plan.

**Core Plan Dates:**

- Start date: **2026-10-01**
- Day 1: **2026-10-01**
- Day 30: **2026-10-30**
- Day 31: **2026-10-31**
- Day 32 / Month 2 start: **2026-11-01**
- Day 60: **2026-11-29**
- Day 61 / Month 3 start: **2026-11-30**
- Day 90: **2026-12-29**

The application must represent the plan using an explicit `plan_start_date = 2026-10-01` and a generated 90-day sequence. Never calculate the core plan start as `today`.

### Calendar rules

1. Generate exactly 90 study days from `2026-10-01` through `2026-12-29` inclusive.
2. Day numbers must remain stable even if the user misses days.
3. The homepage must calculate `current_plan_day` from the fixed start date.
4. Before October 1, 2026, show a **Pre-Launch** state rather than marking preparation days as missed.
5. On or after October 1, 2026, highlight the matching plan day automatically.
6. A missed day must never shift the official day numbers.
7. AI may create a recovery/rebalancing schedule, but the original 90-day calendar remains unchanged as the source plan.
8. Store the plan dates explicitly in the database/seed data so the timetable is reproducible.
9. The UI must display absolute dates such as `01 Oct 2026`, not only `Day 1`.
10. All progress, revision, streak, and analytics calculations must respect the fixed plan dates.

### Month mapping

For the website UI, organize the 90-day plan into these three preparation months:

| Plan Month | Calendar Period | Approx. Days | Primary Purpose |
|---|---|---:|---|
| Month 1 | 01 Oct 2026 – 30 Oct 2026 | 1–30 | Foundation + Mathematics |
| Month 2 | 31 Oct 2026 – 29 Nov 2026 | 31–60 | Core Systems |
| Month 3 | 30 Nov 2026 – 29 Dec 2026 | 61–90 | Networks + Theory + Compiler + Consolidation |

Important: the month labels refer to the **90-day preparation phases**, not necessarily calendar months. Therefore Month 2 starts on October 31 and Month 3 starts on November 30. The UI should make this clear with both the phase name and date range.

Recommended display:

`MONTH 1 — FOUNDATION & MATHEMATICS (01 Oct – 30 Oct)`
`MONTH 2 — CORE SYSTEMS (31 Oct – 29 Nov)`
`MONTH 3 — NETWORKS, THEORY & CONSOLIDATION (30 Nov – 29 Dec)`

---

# 3. GATE 2027 DATA SOURCE RULE

Use the **official GATE 2027 website** as the authoritative source for:

- paper name and code
- syllabus
- examination pattern
- marking rules
- dates
- official notices
- official previous-year paper links when available

The website must not hard-code claims as official unless they are backed by the official source.

Official sources:

- GATE 2027 home: https://gate2027.iitm.ac.in/
- GATE 2027 syllabus / test papers: https://gate2027.iitm.ac.in/exam_papers_and_syllabus
- GATE 2027 question-paper pattern: https://gate2027.iitm.ac.in/question_paper_pattern
- GATE 2027 notifications: https://gate2027.iitm.ac.in/notifications
- GATE 2027 FAQs: https://gate2027.iitm.ac.in/faqs

Because official details can change, create a **source metadata table** with `source_name`, `url`, `source_type`, `last_checked`, `is_authoritative`, and `notes`.

Add an admin-only or developer-only mechanism to update these links without changing frontend code.

---

# 4. VERIFIED EXTERNAL LEARNING RESOURCES

Seed the Resource Library with the following verified sources.

## Official GATE

| Resource | URL | Use |
|---|---|---|
| GATE 2027 Home | https://gate2027.iitm.ac.in/ | Official notices and exam information |
| Test Papers & Syllabus | https://gate2027.iitm.ac.in/exam_papers_and_syllabus | Official CS syllabus |
| Question Paper Pattern | https://gate2027.iitm.ac.in/question_paper_pattern | Official marking/paper structure |
| Notifications | https://gate2027.iitm.ac.in/notifications | Official updates |
| FAQs | https://gate2027.iitm.ac.in/faqs | Official clarification |

## Gate Smashers

Primary beginner-friendly external learning source.

- Main learning hub: https://www.gatesmashers.com/learn
- Main roadmap hub: https://www.gatesmashers.com/roadmaps
- DSA roadmap: https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms
- Algorithms/DAA roadmap: https://www.gatesmashers.com/roadmaps/design-and-analysis-of-algorithms
- DBMS + SQL roadmap: https://www.gatesmashers.com/roadmaps/dbms-sql
- Operating Systems roadmap: https://www.gatesmashers.com/roadmaps/operating-systems
- Computer Networks roadmap: https://www.gatesmashers.com/roadmaps/computer-networks
- Computer Organization & Architecture roadmap: https://www.gatesmashers.com/roadmaps/computer-organization-architecture
- Theory of Computation roadmap: https://www.gatesmashers.com/roadmaps/theory-of-computation
- Compiler Design roadmap: https://www.gatesmashers.com/roadmaps/compiler-design

Also keep the main learning hub available for subjects where a dedicated roadmap URL is not explicitly configured.

## GATEOverflow

Use for real PYQs, explanations, topic-level practice, and free tests.

- Previous GATE questions: https://gateoverflow.in/questions?sort=gate
- Tests: https://db.gateoverflow.in/tests
- Topic/test exploration: https://gateoverflow.in/

The website must label these clearly as **external resources**.

## NPTEL / SWAYAM

Use as supplementary university-level conceptual material. Do not make long NPTEL courses the default path for a 90-day plan. Use them selectively for difficult topics.

- NPTEL course catalog: https://www.nptel.ac.in/courses
- NPTEL example: Database Management System: https://onlinecourses-archive.nptel.ac.in/noc18_cs15/preview
- NPTEL catalog can be searched by subject from the site.

## IMPORTANT RESOURCE RULE

Do not scrape copyrighted lecture transcripts, books, paid courses, or protected question banks.

The site may:

- link to external resources
- store user-created notes
- store original learning explanations
- store question metadata when legally/technically permitted
- store links to official PYQs

Do not claim third-party ownership.

---

# 5. 90-DAY MASTER PREPARATION TIMETABLE

This is the timetable that powers the homepage.

The website must store it as structured data, not a hard-coded HTML table.

## MONTH 1 — FOUNDATION + MATHEMATICS (01 OCT 2026 – 30 OCT 2026)

| Week | Main Focus | Topics | Daily Goal |
|---|---|---|---|
| Week 1 | C Programming | C basics, variables, data types, operators, control flow, functions, arrays, pointers basics | Learn + basic questions + daily coding |
| Week 2 | Data Structures | Arrays, strings, linked lists, stacks, queues, recursion, trees basics | Concept + implementation + PYQs |
| Week 3 | Algorithms | Complexity, asymptotic analysis, searching, sorting, recursion, divide & conquer | Concept + numerical/problem solving |
| Week 4 | Discrete Mathematics | Logic, sets, relations, functions, combinatorics, graphs, basic counting | Theory + numerical practice |

### Month 1 secondary track

- General Aptitude: 30–40 minutes daily
- Engineering Mathematics: 30–45 minutes on selected days
- Daily revision: 15–20 minutes
- Weekly test: every 7th day

## MONTH 2 — CORE SYSTEMS (31 OCT 2026 – 29 NOV 2026)

| Week | Main Focus | Topics | Daily Goal |
|---|---|---|---|
| Week 5 | Digital Logic | Boolean algebra, minimization/K-map, combinational circuits, sequential circuits, number representation | Concepts + numerical practice |
| Week 6 | COA | Instructions, addressing modes, datapath/ALU, control, memory, cache, I/O, DMA, pipelining | Concepts + numericals + PYQs |
| Week 7 | DBMS | ER model, relational model, SQL, relational algebra, functional dependencies, normalization, indexing, transactions | Concepts + SQL-style reasoning + PYQs |
| Week 8 | Operating Systems | processes, threads, scheduling, synchronization, deadlocks, memory, virtual memory, file systems | Concepts + numerical/problem solving |

### Month 2 secondary track

- Computer Networks warm-up: 2 sessions/week
- General Aptitude daily
- Month 1 revision: 45–60 min twice per week
- Weekly mixed test

## MONTH 3 — NETWORKS + THEORY + COMPILER + CONSOLIDATION (30 NOV 2026 – 29 DEC 2026)

| Week | Main Focus | Topics | Daily Goal |
|---|---|---|---|
| Week 9 | Computer Networks | layers, data link, Ethernet, IP, subnetting/CIDR, routing, TCP/UDP, flow control, congestion, DNS, HTTP | Concepts + numericals + PYQs |
| Week 10 | TOC | regular languages, DFA/NFA, regular expressions, CFG, PDA, pumping lemma, Turing machines, decidability | Concept maps + PYQs |
| Week 11 | Compiler Design | lexical analysis, parsing, syntax-directed translation, IR, runtime, code optimization, data-flow | Concepts + PYQs |
| Week 12 | Full Consolidation | all subjects, weak areas, mixed PYQs, revision, mocks | Exam-mode practice |

### Final 6–7 days of the 90-day block

- Full syllabus revision
- Weak-topic repair
- Full-length mock tests
- PYQ reattempts
- Error Book revision
- Formula/shortcut revision

---

# 6. HOMEPAGE — MOST IMPORTANT FEATURE

The front page must immediately show the **interactive 3-month timetable**.

Do not make the user navigate elsewhere to know what to study today.

## Homepage layout

### Header

- GATE 2027 logo/title
- Countdown to exam
- Current streak
- Overall progress
- AI Tutor button
- Profile/settings

### Main hero

Display:

> DAY 17 / 90
> TODAY'S PREPARATION
> Data Structures — Linked Lists

Then show:

- estimated study time
- completion percentage
- topic difficulty
- PYQ target
- fresh-question target
- revision status

### Interactive 90-Day Calendar

Display three tabs/cards:

- Month 1
- Month 2
- Month 3

Each month contains clickable weeks.

Each day is clickable.

Each day tile must show:

- date
- day number
- subject
- topic
- completion indicator
- difficulty indicator
- mock/test indicator if applicable

Color/status rules should be based on semantic states, not decorative colors alone:

- Not started
- In progress
- Completed
- Revision due
- Missed
- Test day

Include hover/tooltip or accessible labels explaining each state.

### Day click behavior

When clicking a day:

Open a study drawer/page with:

1. Learning target
2. Topics
3. Internal lesson links
4. External resource links
5. PYQ target
6. Fresh-question target
7. Revision task
8. AI tutor shortcut
9. Start-study button
10. Mark complete button
11. Notes

### Smart today state

The homepage should automatically open/highlight the correct plan day based on the user's timezone **and the fixed plan start date of October 1, 2026**.

Before 2026-10-01, show a preparation countdown and Day 1 preview. Starting 2026-10-01, calculate the current plan day from the fixed start date.

If the user missed previous days, show:

> You have 2 incomplete days.
> AI can rebalance your next 7 days without deleting your original 90-day plan.

Provide buttons:

- Resume original plan
- Let AI rebalance

AI must never silently rewrite the original plan.

---

# 7. INTERNAL LEARNING SYSTEM

This is a major requirement.

The student must be able to click a topic and learn **inside this website**, without depending on an external video.

Create original, beginner-friendly learning pages for every GATE CS subject.

The content should be written by the application/content files and remain editable.

Do not simply embed third-party pages and call that learning.

## Every subject page must contain

1. Subject introduction
2. Why this subject matters in GATE
3. Prerequisites
4. Topic roadmap
5. Beginner lessons
6. Worked examples
7. Important formulas/rules
8. Common mistakes
9. Concept checks
10. PYQ practice link
11. Fresh practice link
12. Revision sheet
13. AI tutor button
14. Topic completion tracking

---

# 8. INTERNAL CONTENT REQUIRED FOR ALL SUBJECTS

Create a structured lesson tree for:

## 8.1 Programming / C

- C fundamentals
- variables/data types
- operators
- conditionals
- loops
- functions
- arrays
- strings
- pointers
- structures/unions
- recursion
- memory concepts relevant to GATE
- C output tracing

## 8.2 Data Structures

- arrays
- linked lists
- stacks
- queues
- recursion
- trees
- binary trees
- BST
- heaps
- hashing
- graphs
- traversal

## 8.3 Algorithms

- complexity
- asymptotic notation
- recurrence relations
- sorting
- searching
- divide and conquer
- greedy algorithms
- dynamic programming
- graph algorithms
- MST
- shortest paths
- hashing

## 8.4 Engineering Mathematics

- discrete mathematics
- logic
- sets
- relations
- functions
- combinatorics
- graph basics
- linear algebra
- calculus basics
- probability
- statistics

## 8.5 Digital Logic

- number systems
- Boolean algebra
- logic gates
- K-map
- combinational circuits
- sequential circuits
- flip-flops
- counters/registers
- representation/arithmetic

## 8.6 COA

- computer organization basics
- instruction set
- addressing modes
- ALU
- control unit
- instruction execution
- memory hierarchy
- cache
- virtual memory concepts relevant to syllabus
- I/O
- interrupts
- DMA
- pipelining
- hazards

## 8.7 DBMS

- DBMS fundamentals
- ER model
- relational model
- relational algebra
- tuple relational calculus
- SQL
- functional dependencies
- normalization
- file organization
- indexing
- B/B+ trees
- transactions
- serializability
- concurrency control
- recovery basics

## 8.8 Operating Systems

- OS basics
- processes
- threads
- IPC
- scheduling
- synchronization
- semaphores
- deadlocks
- memory management
- virtual memory
- paging
- page replacement
- file systems
- I/O basics

## 8.9 Computer Networks

- layered models
- performance metrics
- transmission basics
- data link
- error detection
- MAC
- Ethernet
- switching
- IPv4
- subnetting
- CIDR
- fragmentation
- NAT
- routing
- transport layer
- UDP/TCP
- flow control
- congestion control
- sockets
- DNS
- HTTP

## 8.10 Theory of Computation

- alphabets/strings/languages
- regular expressions
- DFA
- NFA
- conversions
- regular languages
- closure properties
- pumping lemma
- CFG
- PDA
- context-free languages
- Turing machines
- decidability/undecidability

## 8.11 Compiler Design

- compiler architecture
- lexical analysis
- tokens
- regular expressions in lexical analysis
- parsing
- LL/LR basics
- syntax-directed translation
- intermediate code
- runtime environment
- symbol tables
- code generation basics
- code optimization
- data-flow analysis

## 8.12 General Aptitude

- verbal aptitude
- quantitative aptitude
- logical reasoning
- spatial reasoning
- numerical practice
- reading/comprehension

---

# 9. LESSON FORMAT

Every internal lesson must use the same structure.

```text
Topic
↓
What you will learn
↓
Prerequisite
↓
Simple explanation
↓
Intuition / real-world analogy
↓
Core definition
↓
Formula / rule
↓
Worked Example 1
↓
Worked Example 2
↓
GATE-style observation
↓
Common traps
↓
Quick Check
↓
PYQs
↓
Fresh Practice
↓
Revision Summary
```

Writing requirements:

- beginner friendly
- simple English
- no unnecessary textbook-style jargon
- use diagrams where useful
- mathematical notation when appropriate
- use code blocks for programming topics
- show intermediate steps in numerical problems
- explicitly explain why wrong options are wrong when teaching MCQs

---

# 10. AI TUTOR

Integrate an AI tutor through a provider-agnostic service layer.

Do NOT hard-wire the frontend directly to one AI vendor.

Create:

```text
AIProvider
  ├── OpenAI-compatible adapter
  ├── Gemini-compatible adapter (optional)
  └── Future providers
```

Configuration must come from environment variables.

Example:

```env
AI_PROVIDER=openai-compatible
AI_API_KEY=...
AI_MODEL=...
AI_BASE_URL=...
```

Never expose the AI API key to the browser.

## AI modes

### Explain
Explain the selected concept from zero.

### Simplify
Explain it as if the student has never studied it.

### Deep Dive
Give exam-level detail.

### Hint
Give only the next hint, not the complete solution.

### Solve
Show a complete solution step-by-step.

### Quiz Me
Generate questions from the current topic.

### Interview Me
Ask one question at a time and assess the answer.

### PYQ Explain
Explain the selected PYQ and identify the tested concept.

### Mistake Analysis
Analyze the user's wrong answer and categorize the mistake.

### Revision
Create a short revision card from the topic.

### Ask Anything
General GATE CS study questions, constrained by the user's preparation context.

---

# 11. AI CONTEXT ENGINE

AI must know the user's:

- current day
- current subject
- current topic
- completion status
- recent mistakes
- weak topics
- PYQs attempted
- scores
- revision due items
- remaining days
- daily study target

AI should not repeatedly ask the user what topic they are studying when the website already knows it.

Example:

User: "I don't understand this."

AI context should automatically include:

```json
{
  "current_subject": "DBMS",
  "current_topic": "Normalization",
  "current_day": 47,
  "recent_errors": ["2NF vs 3NF"],
  "difficulty": "beginner"
}
```

---

# 12. AI STUDY PLANNER

AI can modify the **next few days**, but must preserve the 90-day master plan as a reference.

For every adjustment show:

- original schedule
- proposed change
- reason
- impact
- new schedule

Example:

```text
Original:
Day 24 → Discrete Mathematics

AI Proposal:
Day 24 → Discrete Mathematics + 45-minute DSA revision

Reason:
Your DSA accuracy is 58%, below the target threshold.
```

Require user approval before committing schedule changes.

---

# 13. QUESTION ENGINE

Create two completely different question types.

## A. REAL PYQ

Metadata:

- year
- paper/set
- subject
- topic
- subtopic
- question type
- marks
- official source link
- source/provider
- user status
- attempt count
- time taken
- correctness
- confidence

Never alter the original wording of official questions without clearly identifying the transformation.

## B. FRESH GATE-STYLE QUESTION

Generated by AI or authored in the question bank.

Metadata:

- generated_id
- subject
- topic
- difficulty
- MCQ/MSQ/NAT
- marks
- expected_time
- concept_tags
- question
- options
- correct answer
- detailed solution
- common trap

Never label AI-generated questions as official GATE questions.

---

# 14. PRACTICE FLOW

When the student begins practice:

1. Show target count.
2. Start optional timer.
3. Show one question at a time.
4. Save answer immediately.
5. Show result after submission.
6. Explain the solution.
7. Ask confidence level:
   - Guess
   - Low confidence
   - Medium confidence
   - High confidence
8. Save mistake metadata.
9. Add incorrect/low-confidence topics to revision queue.

For wrong answers, automatically classify the error:

- concept gap
- formula error
- calculation error
- reading error
- guessing error
- time-pressure error
- careless error

---

# 15. ERROR BOOK

Create a dedicated Error Book.

Every incorrect or low-confidence attempt can become an error record.

Fields:

```text
id
question_id
subject
topic
mistake_type
user_answer
correct_answer
why_wrong
correct_concept
short_rule
revision_due
status
notes
created_at
```

Views:

- All mistakes
- By subject
- By mistake type
- Due today
- High-frequency mistakes
- Repeated mistakes

AI button:

> "Teach me this mistake again."

The AI should explain the underlying concept, then give 3 fresh questions targeting the same weakness.

---

# 16. REVISION SYSTEM

Implement spaced revision.

Default schedule:

- same day
- +1 day
- +3 days
- +7 days
- +14 days
- +30 days

Allow the AI to adapt this based on performance, but do not remove revision history.

Revision card should contain:

- concept
- key formula/rule
- one example
- one trap
- one mini-question

---

# 17. MOCK TEST SYSTEM

Full mock mode should mimic GATE conditions.

Use the official pattern source as the authority.

The official GATE 2027 pattern page currently specifies a 3-hour CBT, 65 questions, MCQ/MSQ/NAT, with 10 GA questions and 55 subject questions; for CS-class papers, the subject portion includes Engineering Mathematics. The marking scheme includes negative marking for wrong MCQs but none for wrong MSQ/NAT. Verify current official values from the source before displaying them as current. 

Mock features:

- fullscreen mode
- countdown
- question palette
- mark for review
- save & next
- previous/next navigation
- section switching if configured
- calculator-friendly numeric input UI
- automatic submission at time end
- result analysis

After mock:

### Show

- raw score
- attempted
- correct
- incorrect
- unattempted
- accuracy
- average time/question
- subject-wise performance
- topic-wise performance
- easy questions missed
- time traps
- negative marking impact
- weak concepts
- recommended revision

Do not make claims about actual rank unless supported by an explicitly labeled external rank estimator; do not invent rank.

---

# 18. ANALYTICS DASHBOARD

Show:

### Overall

- syllabus completion
- learning completion
- PYQ completion
- practice completion
- revision completion
- mock count
- study streak
- total study time

### Performance

- accuracy trend
- score trend
- PYQ accuracy
- fresh-question accuracy
- subject heatmap
- topic heatmap
- time-per-question trend

### Weakness detector

Calculate weak topics from a transparent rule, e.g.:

```text
Weak if:
accuracy < 60%
OR
3+ repeated mistakes
OR
low confidence + incorrect
OR
slow time compared with target
```

Make thresholds configurable.

---

# 19. GAMIFICATION — KEEP IT USEFUL

Include lightweight motivation, not childish gamification.

Features:

- study streak
- completed days
- XP for completed study tasks
- badges for milestones
- weekly consistency indicator
- personal bests

Do not let gamification distract from study.

---

# 20. STUDY SESSION TIMER

Provide:

- 25/5
- 50/10
- 90/15
- custom timer

During a timer session:

- show today's task
- allow notes
- allow AI help
- allow pause/resume
- record actual focused minutes

At session end:

- ask "What did you complete?"
- save study minutes
- update today's progress

---

# 21. DAILY HOME SCREEN

After login, the first screen should answer these questions immediately:

### What should I study today?

Show exact subject + topic.

### How much time?

Show target time.

### What should I solve?

Show PYQ/fresh question target.

### What is pending?

Show overdue revision/error items.

### What happens after I finish?

Show the next task.

---

# 22. WEEKLY REVIEW

Every 7th day show a Weekly Review.

Include:

- days completed
- hours studied
- topics completed
- PYQs solved
- new questions solved
- accuracy
- mistakes
- weak topics
- revision due
- next-week focus

AI generates:

> "Here is what you should change next week."

But recommendations must be based on recorded performance, not arbitrary claims.

---

# 23. SUBJECT DASHBOARD

Each subject page should show:

```text
Subject Progress
████████░░ 78%

Topics: 14 / 18 complete
PYQs: 61 / 90
Fresh: 48 / 70
Revision: 11 / 16
Accuracy: 72%

Weak Topics
- Cache Mapping
- Pipeline Hazards

Continue Learning →
Practice PYQs →
Generate Quiz →
Revision →
Ask AI →
```

---

# 24. SEARCH

Global search should search:

- subjects
- topics
- lessons
- PYQs
- questions
- mistakes
- resources
- notes

Examples:

```text
"normalization"
"deadlock"
"TCP congestion"
"2024 DBMS PYQ"
"questions I got wrong"
"all cache questions"
```

---

# 25. NOTES SYSTEM

Allow notes on:

- subject
- topic
- lesson
- question
- day

Support Markdown.

Useful features:

- pin
- tag
- search
- AI summarize
- AI convert to revision card

---

# 26. RESOURCE LIBRARY UI

Each resource card must show:

```text
Gate Smashers
DBMS + SQL Roadmap
Type: External Learning
Difficulty: Beginner → Intermediate
Source: Gate Smashers
Open Resource ↗
```

Source labels:

- Official
- External Learning
- PYQ
- Supplementary
- AI-generated
- User Note

Never visually make third-party content look official.

---

# 27. FRONTEND DESIGN

Use a modern academic productivity dashboard.

Preferred stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui or equivalent accessible component system
- Lucide icons
- responsive design
- dark/light mode

Visual direction:

- clean
- professional
- high readability
- excellent mobile layout
- subtle animation
- data-first UI
- avoid excessive glassmorphism
- avoid gaming-style neon UI
- avoid excessive 3D effects

Main navigation:

```text
Home
Today
Learn
PYQs
Practice
Mocks
Revision
Error Book
Analytics
Resources
AI Tutor
Settings
```

Desktop:

- sidebar navigation
- top header
- main content

Mobile:

- bottom navigation for high-frequency actions
- collapsible navigation for other sections

---

# 28. TECHNICAL ARCHITECTURE

Suggested architecture:

```text
Frontend
  ↓
Next.js App Router
  ↓
Application Service Layer
  ├── Study Planner
  ├── Question Engine
  ├── Progress Engine
  ├── Revision Engine
  ├── Analytics Engine
  └── AI Service
  ↓
Database
  ├── Users
  ├── Study Plan
  ├── Subjects
  ├── Topics
  ├── Lessons
  ├── Questions
  ├── Attempts
  ├── Mistakes
  ├── Revisions
  ├── Mocks
  ├── Notes
  ├── Resources
  └── AI conversations
```

Use a relational database.

Recommended:

- PostgreSQL / Supabase Postgres

Authentication:

- email/password
- optional Google login
- secure session handling

Do not store plaintext passwords.

---

# 29. DATABASE SCHEMA

Create at least these tables/entities:

```text
users
profiles
study_plans
study_days
subjects
topics
subtopics
lessons
lesson_progress
resources
questions
question_tags
question_attempts
mistakes
revision_items
study_sessions
mock_tests
mock_questions
mock_attempts
notes
ai_conversations
ai_messages
achievement_events
source_registry
```

Important indexes:

- questions by year
- questions by subject/topic
- attempts by user/date
- revisions by due date
- study_days by user/date
- mistakes by topic

---

# 30. STUDY-DAY DATABASE MODEL

Each planned day should look roughly like:

```json
{
  "dayNumber": 1,
  "date": "2026-10-01",
  "month": 1,
  "week": 1,
  "subject": "C Programming",
  "topics": [
    "Variables",
    "Data Types",
    "Operators"
  ],
  "targetMinutes": 360,
  "learningMinutes": 150,
  "pyqTarget": 10,
  "freshQuestionTarget": 10,
  "gaMinutes": 30,
  "revisionMinutes": 20,
  "test": false,
  "status": "not_started"
}
```

Generate all 90 days from one deterministic seed file or database seed script.

Do not manually duplicate UI markup for 90 days.

---

# 31. MASTER TIMETABLE DATA

Create a seed file such as:

```text
/data/gate/plan-90-days.json
```

Also create:

```text
/data/gate/subjects.json
/data/gate/topics.json
/data/gate/resources.json
/data/gate/sample-lessons.json
/data/gate/sample-pyqs.json
/data/gate/sample-fresh-questions.json
```

The timetable must be easy to edit without touching React components.

---

# 32. CONTENT ARCHITECTURE

Store internal lessons as Markdown/MDX or structured JSON/MDX files.

Example:

```text
content/
  gate/
    programming/
      c-basics.mdx
      pointers.mdx
    data-structures/
      arrays.mdx
      linked-lists.mdx
    algorithms/
      complexity.mdx
      sorting.mdx
    mathematics/
      discrete-logic.mdx
      probability.mdx
    digital-logic/
    coa/
    dbms/
    operating-systems/
    computer-networks/
    toc/
    compiler/
    aptitude/
```

Every lesson should contain frontmatter:

```yaml
---
subject: DBMS
topic: Normalization
difficulty: beginner
gateRelevance: high
estimatedMinutes: 35
prerequisites:
  - Functional Dependencies
tags:
  - dbms
  - normalization
---
```

---

# 33. CONTENT QUALITY RULES

Every internal lesson must be:

- factually checked against the official syllabus scope
- original wording
- beginner friendly
- GATE-focused
- not unnecessarily long
- linked to practice

Every lesson must answer:

1. What is it?
2. Why do we need it?
3. How does it work?
4. How is it tested in GATE?
5. What traps should I avoid?
6. Can I solve a problem now?

---

# 34. AI SAFETY / TRUST RULES FOR STUDY

AI must never:

- claim an AI-generated question is an official PYQ
- invent an official GATE rule
- claim a source said something if it did not
- invent answer keys
- invent dates
- fabricate external links
- silently change the student's study plan

When uncertain, AI should say that it is uncertain and point the user to the official GATE source.

For current exam details, the system should prefer the registered official source.

---

# 35. RESOURCE LINK HEALTH

Implement a lightweight resource health strategy.

Store:

```text
source_url
last_verified_at
http_status
is_active
```

Do not continuously crawl external websites from the browser.

Provide a developer/admin script that can verify links periodically.

If a resource fails:

- show "Link may have changed"
- keep source name
- offer source homepage
- never silently delete it

---

# 36. OFFLINE / LOW-CONNECTION SUPPORT

The learning platform should remain useful during poor internet.

Cache:

- current timetable
- internal lessons
- revision cards
- progress state when possible

External video/PYQ links naturally require internet.

Never claim external resources are available offline if they are not.

---

# 37. EXPORT / BACKUP

Allow the student to export:

- progress JSON
- mistakes CSV
- notes Markdown
- study history CSV
- question attempt history CSV

Also provide:

> Download My GATE Preparation Report

with:

- syllabus completion
- subject scores
- mock scores
- weaknesses
- study hours
- recommendations

---

# 38. ACCESSIBILITY

Must support:

- keyboard navigation
- visible focus states
- sufficient contrast
- semantic headings
- accessible tables
- screen-reader labels
- reduced motion preference

Do not communicate status only through color.

---

# 39. PERFORMANCE

Requirements:

- fast initial dashboard load
- server-render static lesson content when possible
- lazy-load heavy charts
- paginate large question banks
- virtualize long question lists if required
- debounce global search
- cache lesson pages
- avoid unnecessary AI calls

AI responses should stream when supported.

---

# 40. API / SERVICE CONTRACTS

Create clean application services such as:

```text
getTodayPlan()
getStudyDay(dayNumber)
completeStudyTask(taskId)
getSubjectProgress(subjectId)
getTopicProgress(topicId)
getPYQs(filters)
submitAttempt(questionId, answer)
createFreshQuestion(config)
generateQuiz(config)
analyzeMistake(attemptId)
getRevisionQueue()
completeRevision(itemId)
startMock(config)
submitMock(mockId)
getAnalytics(period)
chatWithTutor(context, message)
rebalancePlan(request)
```

Do not place business logic directly into React components.

---

# 41. AI PROMPTING ARCHITECTURE

Create server-side prompt templates.

Example:

```text
SYSTEM:
You are the user's GATE CS tutor.
You teach from first principles.
Do not pretend AI-generated questions are official PYQs.
Prefer the student's current topic.
Use the user's recent mistakes when useful.
Keep explanations concrete and exam-oriented.

CONTEXT:
Current day: {{day}}
Subject: {{subject}}
Topic: {{topic}}
Progress: {{progress}}
Recent mistakes: {{mistakes}}

USER:
{{message}}
```

Separate prompts for:

- teach
- explain
- hint
- solve
- quiz
- generate fresh questions
- mistake analysis
- revision card
- weekly review
- schedule rebalance

---

# 42. FRESH QUESTION GENERATION RULES

When AI generates practice questions:

- match exact syllabus topic
- specify difficulty
- specify question type
- avoid duplicate wording
- avoid trivial paraphrases
- include answer validation
- include detailed reasoning
- include misconception/trap
- include expected solution time

For important numerical topics, prefer question templates with generated parameters so many distinct variants can be produced.

Example:

```text
Cache problem template
→ randomly vary cache size
→ block size
→ associativity
→ address bits
→ mapping
→ ask different target variable
```

Use deterministic random seeds when tests need reproducibility.

---

# 43. PYQ HANDLING

Do not fabricate PYQs.

If the full text cannot legally or reliably be stored, store:

- year
- paper
- question identifier
- topic
- official/external source link
- answer metadata if verified

Then open the source for the full question.

For user-owned/imported PYQs, support upload/import separately.

---

# 44. ADMIN / DEVELOPER CONTENT TOOLS

Create a protected content-management area for:

- subjects
- topics
- lessons
- questions
- resources
- timetable
- source links

Actions:

- create
- edit
- preview
- publish/unpublish
- import/export JSON

The user should not need this area for normal study.

---

# 45. FIRST-RUN ONBOARDING

On first login ask only useful questions:

1. GATE paper → CS
2. Current level → Starting from scratch / Intermediate
3. Target daily hours → 4 / 6 / 8 / custom
4. Preferred study session → 25 / 50 / 90 minutes
5. Exam date → default from configured GATE source if available
6. Start date → **2026-10-01 (fixed 90-day plan start)**

Then generate the dashboard.

Do not ask 20 onboarding questions.

---

# 46. DAILY USER EXPERIENCE

The ideal flow:

```text
Open Website
    ↓
Home shows TODAY
    ↓
Start Study
    ↓
Internal Lesson
    ↓
Quick Check
    ↓
PYQs
    ↓
Fresh Questions
    ↓
AI asks if weak
    ↓
Mistakes saved
    ↓
Revision scheduled
    ↓
Mark day complete
    ↓
Progress updates
```

This should feel seamless.

---

# 47. MISSED-DAY EXPERIENCE

If a day is missed:

Do not shame the student.

Show:

```text
Yesterday was not completed.

You have 3 incomplete tasks.

Suggested recovery:
Today + 45 min
Tomorrow + 30 min
Saturday + 45 min
```

AI may rebalance, but only after showing the changes.

Do not simply add huge extra workloads to one day.

---

# 48. SUBJECT LEARNING PRIORITY

Default study order should follow dependency logic.

Preferred order:

```text
C Programming
  ↓
Data Structures
  ↓
Algorithms
  ↓
Discrete Mathematics
  ↓
Digital Logic
  ↓
COA
  ↓
DBMS
  ↓
OS
  ↓
CN
  ↓
TOC
  ↓
Compiler
  ↓
Full Revision / Mocks
```

GA and Engineering Mathematics run in parallel.

Do not force a student to finish every external course before moving forward.

---

# 49. WHAT THE DASHBOARD SHOULD SHOW AT A GLANCE

Top row:

```text
DAY 17/90     73 DAYS LEFT
SYLLABUS 31%  PYQs 18%  ACCURACY 67%
STREAK 6 DAYS
```

Main area:

```text
TODAY
Data Structures
Linked Lists

2h 20m estimated

[ Learn ] [ PYQs ] [ Practice ] [ Ask AI ]
```

Below:

```text
90-DAY PLAN
Month 1 | Month 2 | Month 3

Week 1
Mon Tue Wed Thu Fri Sat Sun
✓   ✓   ✓   ●   ○   ○   T
```

Then:

```text
WEAK AREAS
- Recursion
- Probability
- Cache

REVISION DUE
- C pointers
- SQL joins
- Boolean algebra
```

Then:

```text
CONTINUE WHERE YOU LEFT OFF
```

---

# 50. RESPONSIVE MONTH TIMETABLE

Desktop month grid:

- 7 columns for weekdays
- each day tile contains subject abbreviation + topic snippet

Mobile:

- horizontal week cards or vertical timeline

Clicking a week should expand:

```text
WEEK 3
Algorithms

Mon → Complexity
Tue → Big-O / Omega / Theta
Wed → Recurrences
Thu → Sorting
Fri → Searching
Sat → PYQs
Sun → Weekly Test
```

---

# 51. TEST-FIRST DEVELOPMENT

Before implementing, create acceptance criteria.

Examples:

### Dashboard

- [ ] current day detected correctly
- [ ] 90 days visible
- [ ] day clickable
- [ ] completed day persists
- [ ] missed day appears correctly
- [ ] progress is calculated from database

### AI

- [ ] key never reaches client
- [ ] current topic included in context
- [ ] AI can generate quiz
- [ ] AI can analyze mistake
- [ ] AI can explain PYQ

### Questions

- [ ] MCQ works
- [ ] MSQ works
- [ ] NAT works
- [ ] timer works
- [ ] attempt saved
- [ ] explanation shown

### Revision

- [ ] revision item scheduled
- [ ] due date works
- [ ] completed revision persists

---

# 52. SEED CONTENT FOR MVP

The first implementation must not launch empty.

Seed at minimum:

- all 12 planned subject areas
- complete 90-day timetable
- 5+ internal beginner lessons per primary subject
- sample topic hierarchy for all subjects
- at least 30 practice questions
- at least 15 clearly labelled fresh GATE-style questions
- sample revision cards
- sample error records in development only
- verified resource links

After the MVP structure works, expand lesson coverage until every syllabus topic has an internal learning page.

---

# 53. MVP PHASES

## Phase 1 — Foundation

Build:

- auth
- dashboard
- 90-day calendar
- subjects
- lessons
- progress
- resources

## Phase 2 — Practice

Build:

- PYQ library
- practice engine
- attempts
- error book
- revision

## Phase 3 — AI

Build:

- AI tutor
- quiz generation
- mistake analysis
- daily guidance
- plan rebalance

## Phase 4 — Exam Mode

Build:

- mock tests
- timer
- analytics
- full report

## Phase 5 — Polish

Build:

- PWA/offline caching
- exports
- link health
- accessibility
- performance optimization

---

# 54. FILE / FOLDER STRUCTURE

Use a clean structure similar to:

```text
app/
  (auth)/
  dashboard/
  learn/
  pyqs/
  practice/
  mocks/
  revision/
  error-book/
  analytics/
  resources/
  ai/
  settings/

components/
  dashboard/
  calendar/
  study/
  questions/
  ai/
  charts/
  ui/

lib/
  ai/
  db/
  study/
  questions/
  revision/
  analytics/
  validation/

content/
  gate/

data/
  gate/

scripts/
  seed/
  verify-links/

public/

supabase/
  migrations/
```

Adapt this to the selected backend while keeping the same logical separation.

---

# 55. SECURITY

Implement:

- server-side AI calls
- environment variables for secrets
- secure authentication
- authorization for user-owned data
- input validation
- rate limiting for AI generation
- protection against prompt injection through user notes/content
- safe Markdown rendering
- no raw HTML execution in user content
- audit-friendly logging for AI actions

Never expose service credentials.

---

# 56. AI COST CONTROL

Do not call AI for things that deterministic code can do.

Use normal application logic for:

- progress percentage
- daily timetable
- countdown
- revision dates
- scoring
- statistics
- filters

Use AI for:

- teaching
- explanation
- question generation
- mistake analysis
- adaptive planning
- summaries

Cache repeated AI-generated revision summaries where practical.

---

# 57. FINAL BUILD REQUIREMENT

Do not produce a fake UI prototype with placeholder buttons.

The core flows must actually work end-to-end.

At the end of the build:

1. install dependencies
2. configure environment example
3. run database migrations
4. seed the 90-day plan
5. seed subjects/topics/resources
6. start the development server
7. run lint/typecheck
8. run tests
9. manually verify the dashboard flow
10. document startup and deployment

Create:

```text
README.md
.env.example
```

README must include:

- project overview
- architecture
- setup
- database setup
- AI provider setup
- seed process
- development commands
- production build
- deployment
- resource management
- how to update the 90-day timetable

---

# 58. DEFINITION OF DONE

The project is complete only when a new student can:

```text
Register
  ↓
Select CS / 90-day plan
  ↓
Open dashboard
  ↓
See today's exact study plan
  ↓
Open an internal beginner lesson
  ↓
Understand the topic
  ↓
Solve practice questions
  ↓
Solve PYQs / open verified source
  ↓
Solve fresh GATE-style questions
  ↓
Ask AI for help
  ↓
Record mistakes automatically
  ↓
Receive revision schedule
  ↓
Complete the day
  ↓
See progress update
  ↓
Return tomorrow
```

The product should make the student's daily decision extremely simple:

> **Open website → follow today's plan.**

---

# 59. IMPORTANT IMPLEMENTATION PRINCIPLE

Do not overbuild the first version before proving the study loop.

The highest-priority loop is:

```text
TODAY
→ LEARN
→ PYQ
→ PRACTICE
→ AI HELP
→ ERROR
→ REVISION
→ COMPLETE
```

Everything else is secondary.

Build this loop exceptionally well first.

---

# 60. FINAL AGENT INSTRUCTION

Start by inspecting the existing repository and determining whether the project is empty or already has a stack.

If an existing stack is present, preserve useful existing work instead of replacing everything.

Then implement the platform in phases.

Before each major implementation phase:

- define the data model
- implement backend/service logic
- implement UI
- connect real data
- test the flow

Do not use fake API responses for core functionality.

Do not leave critical buttons as placeholders.

Use realistic seeded data for the 90-day plan, subjects, lessons, and practice questions.

At completion, provide a concise implementation report containing:

- what was built
- important routes/pages
- database tables
- AI provider configuration
- seed commands
- test commands
- deployment steps
- known limitations

The result must be a **real personal GATE 2027 study operating system**, not merely a timetable website.
