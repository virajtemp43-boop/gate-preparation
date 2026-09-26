/**
 * Layer 2 — LLM Intelligence Layer (Groq & Heuristic Fallback)
 * 
 * Powered by Groq API (llama-3.3-70b-versatile) with fallback to Layer 1 Study Engine.
 * 
 * Enforces:
 * 1. Non-Negotiable Rule: The AI must NOT teach the subject. It manages, schedules, and guides.
 * 2. Immutable 90-Day Master Schedule (Oct 1 to Dec 29, 2026).
 * 3. Structured Explainability (Reason Codes & Before/After diffs).
 */

import {
  calculateScheduleForHours,
  evaluateExecutionRisk,
  handleEarlyCompletion,
  handlePartialCompletion,
  resolveTaskResources,
  ReasonCode,
} from "./study-engine";
import { StudyDay } from "@/lib/types";
import {
  searchKnowledgeBase,
  formatSearchResultsToMarkdown,
  isSearchIntent,
} from "@/lib/search-engine";

export interface CoachContext {
  currentDay?: number;
  date?: string;
  subject?: string;
  topic?: string;
  subtopics?: string[];
  availableHours?: number;
  missedYesterday?: boolean;
  weakTopics?: string[];
  recentMistakes?: string[];
  taskProgress?: string;
  riskStatus?: string;
  allDays?: StudyDay[];
}

export function buildStudyCoachPrompt(context: CoachContext, searchResultsContext?: string): string {
  const dayNum = context.currentDay || 1;
  const subject = context.subject || "Programming & Data Structures";
  const topic = context.topic || "C Variables, Data Types & Operators";
  const resources = resolveTaskResources(subject, topic, dayNum);

  return `You are GATE Personal AI Coach & Resource Navigator.

Your job is to manage, guide, schedule, remind, analyze, adapt, and navigate the user's GATE preparation.
You are NOT a teaching platform.

GREETING & WELCOME RULE:
If the user says "hi", "hello", "hey", or asks for help getting started:
Respond warmly and cleanly as their GATE 2027 Study Coach. Give a crisp 1-sentence snapshot of Today's active target (Day ${dayNum}: ${topic} in ${subject}), and present 4 structured action options they can choose:
1. 🎯 **Today's Action Plan:** ${resources.isDirect ? `[Watch exact lecture ▶](${resources.primary.url})` : `[Open topic roadmap ↗](${resources.primary.url})`} & [Open exact topic PYQs ↗](${resources.pyq.url})
2. ⏱️ **Time Compressor:** Tell me if you have only 2h, 3h, or 4h today and I will rebalance your workload.
3. 🔍 **Find Any Syllabus Topic:** Ask me to find any lecture, roadmap, or PYQ bank across all 90 days (e.g. "find cache memory", "find paging", "where is day 45?").
4. 🔄 **Missed-Day Catchup:** Tell me if you missed yesterday to slot a recovery block.
Do NOT dump a massive schedule on a simple greeting!

SEARCH & RESOURCE FINDER RULE:
If the user asks to "find", "search", "where is", "look up", or asks about ANY topic, chapter, question, or day across the 90-day syllabus:
Use the verified search results below. Present a clean, structured result with:
- 📌 Scheduled Day number & date
- Subject & Syllabus concepts
- Exact direct action buttons: [Watch exact lecture ▶](url) or [Open topic roadmap ↗](url), and [Open exact topic PYQs ↗](url).

NON-NEGOTIABLE PRODUCT RULE:
Do NOT teach full academic lessons unless the user explicitly requests a tiny clarification needed to complete a task. Even then, stay concise and redirect to the assigned external learning resource.

If the user asks:
"Teach me DBMS normalization" or "Explain Pointers from scratch"
Respond with a guidance-oriented redirect such as:
"For today's plan, open the assigned Gate Smashers resource, study the specified section, then solve the assigned PYQs on GATEOverflow. I can help you decide the order, time, practice target, and revision schedule."

FORMATTING & STRUCTURE RULE:
- Use clean Markdown with headers (###), bullet points, and bold emphasis.
- Always use clickable markdown links [text](url) for all resources so the UI renders them as rich interactive buttons:
  - Video links: [Watch exact lecture ▶](url) or [Open topic roadmap ↗](url)
  - PYQ links: [Open exact topic PYQs ↗](url)
  - Official links: [Open official GATE paper ↗](url)
- Keep responses concise, direct, and actionable. Never output raw unformatted text dumps.

ACTIVE STUDENT CONTEXT:
- Today's Date: ${context.date || "2026-10-01"}
- Day Number: Day ${dayNum} / 90
- Active Subject: ${subject}
- Active Topic: ${topic}
- Subtopics: ${context.subtopics?.join(", ") || resources.subtopics?.join(", ") || "Core basics"}
- Daily Available Hours: ${context.availableHours || 6} Hours
- Missed Previous Day: ${context.missedYesterday ? "YES (Needs Recovery Overlay)" : "NO (On Track)"}
- Execution Risk Status: ${context.riskStatus || "ON_TRACK"}
- Known Weak Topics: ${context.weakTopics?.length ? context.weakTopics.join(", ") : "None yet recorded"}
- Recent Mistake Areas: ${context.recentMistakes?.length ? context.recentMistakes.join("; ") : "None recorded"}
- TODAY'S EXACT VERIFIED VIDEO: ${resources.primary.title} (${resources.primary.url}) [Direct: ${resources.isDirect ? "YES" : "NO"}]
- TODAY'S EXACT VERIFIED PYQS: ${resources.pyq.title} (${resources.pyq.url})
- OFFICIAL GATE SYLLABUS/PAPERS: ${resources.official.url}
${searchResultsContext ? `\nVERIFIED SYLLABUS & RESOURCE SEARCH RESULTS FOR USER QUERY:\n${searchResultsContext}` : ""}
`;
}

/**
 * High-Precision Heuristic Study Coach Fallback
 * Used when offline, API key not configured, or for instant sub-millisecond local responses.
 */
export function getHeuristicCoachResponse(query: string, context: CoachContext): string {
  const lower = query.toLowerCase().trim();
  const subject = context.subject || "Programming & Data Structures";
  const topic = context.topic || "C Variables, Data Types & Operators";
  const hours = context.availableHours || 6;
  const dayNum = context.currentDay || 1;
  const resources = resolveTaskResources(subject, topic, dayNum);

  const videoAction = resources.isDirect
    ? `[Watch exact lecture ▶](${resources.primary.url})`
    : `[Open topic roadmap ↗](${resources.primary.url})`;
  const pyqAction = `[Open exact topic PYQs ↗](${resources.pyq.url})`;

  // 0. Greeting handler (e.g. "hi", "hello", "hey")
  if (lower === "hi" || lower === "hello" || lower === "hey" || lower === "start" || lower === "help") {
    return `### 👋 Welcome to Your GATE 2027 AI Study Coach

I am your personal study manager, scheduler, and resource navigator.

**Today's Active Focus (Day ${dayNum} of 90):**
* **Subject:** ${subject}
* **Goal:** ${topic}
* **Planned Time:** ${hours} Hours

**What would you like me to do right now?**
1. 🎯 **Give Me Today's Schedule:** ${videoAction} & ${pyqAction}
2. ⏱️ **Time Compressor:** Tell me if you have only 2h, 3h, or 4h today and I will rebalance your workload.
3. 🔍 **Find Any Syllabus Topic:** Type *"find cache memory"*, *"find Dijkstra"*, or *"where is day 45?"*.
4. 🔄 **Missed-Day Catchup:** Type *"I missed yesterday"* to slot an automatic recovery block.`;
  }

  // 1. Search / Finder intent
  if (isSearchIntent(query)) {
    const searchResults = searchKnowledgeBase(query);
    return formatSearchResultsToMarkdown(searchResults, query);
  }

  // 1. Redirection if user asks the AI to teach academic subject matter
  if (
    lower.startsWith("teach me") ||
    lower.includes("explain the concept of") ||
    lower.includes("give me a lecture on") ||
    lower.includes("explain in detail what is")
  ) {
    return `### 🛑 Study Coach Guidance: External Resource First

As your GATE Personal Study Coach, my job is to guide your schedule and execution—**not to replace your primary learning source**.

**Recommended Action for ${topic}:**
1. **Open Assigned Resource:**
   * Launch **Gate Smashers** for **${topic}**: ${videoAction}.
   * Study the core 45-minute video block.
2. **Immediate Application:**
   * Open **GATEOverflow**: ${pyqAction} and solve 5 topic PYQs.
3. **Log Doubts:**
   * Write down the specific formula or edge case in your **Error Book**.

*I will help you decide the time allocation, practice target, and spaced revision schedule!*`;
  }

  // 2. "What should I do now?" / "What is today's plan?"
  if (lower.includes("what should i do") || lower.includes("what is today") || lower.includes("start now")) {
    return `### 🎯 Today's Action Plan — Day ${dayNum} of 90

**Available Time:** ${hours} Hours  
**Subject:** ${subject}  
**Primary Goal:** ${topic}

**Execute in this exact priority sequence:**
1. **Spaced Revision Warm-up (15m)**
   * Review yesterday's formula card and key traps.
2. **Theory Study (80m)**
   * Open ${videoAction} and study **${topic}**.
3. **Concept Notes (25m)**
   * Write one page of formulas and boundary conditions in your notebook.
4. **GATEOverflow PYQs (60m)**
   * Open ${pyqAction} and solve 10–12 real GATE questions.
5. **AI Practice & Traps (30m)**
   * Solve 3 fresh challenge questions in the AI Practice Lab.
6. **Error Book & Log (15m)**
   * Log any question rated C (guessed) or D (wrong) into your Error Book.

**AI Note:** You are currently **ON TRACK**. Protect the 60-minute PYQ block above all else.`;
  }

  // 3. Limited time (e.g. 2h or 3h)
  if (lower.includes("2 hour") || lower.includes("3 hour") || lower.includes("limited time") || lower.includes("only have")) {
    return `### ⏱️ Time-Compressed Plan (${hours <= 3 ? hours : 2} Hours)

**Reason Code:** \`TIME_LIMIT\`  
Because your available time is constrained, the study engine automatically protects core concept retention and top PYQs while deferring enrichment.

**Protected Today (Non-Negotiable):**
1. **Core Concept Theory (50 min)**
   * Open ${videoAction} for ${topic}.
2. **High-Yield PYQs (50 min)**
   * Open ${pyqAction} and solve 5 essential questions.
3. **Rapid Formula & Error Check (20 min)**
   * Note edge cases to avoid making repeat mistakes.

**Deferred to Buffer Session:**
* ❌ Defer optional fresh AI practice questions.
* ❌ Defer General Aptitude block.

*The master 90-day timetable remains completely intact. Complete these 3 blocks and your day is a success.*`;
  }

  // 4. Extra time (e.g. 8 hours)
  if (lower.includes("8 hour") || lower.includes("extra time") || lower.includes("free all day")) {
    return `### ⚡ High-Capacity Deep Study Plan (8 Hours)

**Reason Code:** \`AHEAD_OF_PLAN\`  
The engine does **not** blindly fast-forward future chapters. Instead, extra capacity is allocated to deep PYQ mastery and weak-topic reinforcement to lock in marks.

**8-Hour Structure:**
1. **Spaced Revision (30m):** Clear overdue revision cards.
2. **Master Theory Block (150m):** Deep theory on **${topic}** via ${videoAction}.
3. **Summary & Formula Sheet (45m):** Detailed personal derivation sheet.
4. **Deep GATE PYQs (100m):** Solve 20 questions on ${pyqAction}.
5. **Trap Detection Practice (45m):** Test edge cases in AI Practice Lab.
6. **Error Book Deep Log (20m):** Write one-line preventive rules for each mistake.
7. **Targeted Weak-Topic Repair (45m):** Re-test previous mistake concepts.
8. **Rest & Buffer (45m):** Prevents cognitive burnout.`;
  }

  // 5. Missed yesterday / behind schedule
  if (lower.includes("miss") || lower.includes("yesterday") || lower.includes("behind") || lower.includes("could not study")) {
    return `### 🔄 Missed-Day Recovery Overlay

**Reason Code:** \`RECOVERY\`  
**Golden Rule:** The master 90-day calendar date (**Oct 1 – Dec 29, 2026**) is never moved forward. We overlay a temporary recovery schedule.

**Recovery Strategy:**
1. **Protect Today's Mission (70% of study time):**
   * Continue with today's scheduled topic: **${topic}**. Do not abandon today!
2. **Recovery Injection Block (35 min):**
   * Re-solve the 3 most essential PYQs from yesterday's missed topic on ${pyqAction}.
3. **Deferred:**
   * Extra practice sets are moved to Sunday's buffer window.

*Estimated recovery time: 1–2 days. You are still fully on track for GATE 2027!*`;
  }

  // 6. Finished early
  if (lower.includes("finished early") || lower.includes("done early") || lower.includes("early")) {
    const early = handleEarlyCompletion(30, topic);
    return `### 🏆 Finished Early

${early.recommendation}

**Recommended Next Step:**
* **Action:** ${early.suggestedAction}
* **Task:** ${early.nextTaskTitle} (${early.minutes} min)
* Open your **Spaced Revision Center** or solve 3 additional questions on **GATEOverflow**.`;
  }

  // 7. "Why did you change this?"
  if (lower.includes("why did you change") || lower.includes("why change")) {
    return `### 🔍 Schedule Explanation

**Reason Code:** \`${context.missedYesterday ? "RECOVERY" : "TIME_LIMIT"}\`

**Why the plan was adjusted:**
* **Trigger:** Available time was set to ${hours}h ${context.missedYesterday ? "and a missed session was recorded" : ""}.
* **Protected:** Core concept theory on ${topic} and mandatory GATEOverflow PYQs.
* **Moved:** Low-priority enrichment practice was deferred to weekend buffer time to prevent burnout.

*The master 90-day end date of December 29, 2026 remains unchanged.*`;
  }

  // 8. Default Coach Response
  return `### 📋 GATE Study Coach Directive — Day ${dayNum}

**Current Focus:** ${subject} • ${topic}  
**Available Hours:** ${hours} Hours

1. **Step 1:** Study theory via [Gate Smashers ↗](https://www.gatesmashers.com/learn) (90m).
2. **Step 2:** Solve assigned topic questions on [GATEOverflow ↗](https://gateoverflow.in/questions?sort=gate) (60m).
3. **Step 3:** Record mistakes in your **Digital Error Book** (15m).

*Tell me if your hours change or if you need a recovery plan!*`;
}

/**
 * Call Groq API with robust timeout, fallback, and validation.
 */
export async function callGroqCoach(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  apiKey?: string,
  model?: string
): Promise<string> {
  const resolvedKey = apiKey || process.env.GROQ_API_KEY;

  if (!resolvedKey || resolvedKey.trim() === "") {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const primaryModel = model || process.env.AI_MODEL || "openai/gpt-oss-120b";
  const candidateModels = [primaryModel, "openai/gpt-oss-120b", "openai/gpt-oss-20b"];

  let lastError: any = null;

  for (const currentModel of Array.from(new Set(candidateModels))) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resolvedKey.trim()}`,
        },
        body: JSON.stringify({
          model: currentModel,
          messages,
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No response received from Groq.";
      }

      const errorText = await response.text();
      lastError = new Error(`Groq API error with model ${currentModel} (${response.status}): ${errorText}`);
      // If error is 404 model not found, loop to next candidate
      if (response.status !== 404) {
        throw lastError;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to get response from Groq API.");
}
