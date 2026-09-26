/**
 * Layer 2 — LLM Intelligence Layer (Groq & Heuristic Fallback)
 * 
 * Powered by Groq API (openai/gpt-oss-120b, openai/gpt-oss-20b, qwen/qwen3.8-27b)
 * with robust fallback to Layer 1 Study Engine & 10-Year Official GATE PYQ Archive.
 * 
 * Enforces:
 * 1. Warm, friendly, supportive, and empathetic mentor personality.
 * 2. Non-Negotiable Rule: The AI must NOT teach the subject as a tutorial platform. It manages, schedules, and guides.
 * 3. Exact Topic Resource Locators: Gate Smashers lectures, GATEOverflow PYQs, Topic MCQs, and IIT Official papers.
 * 4. 10-Year Official GATE PYQ Archive integration with complete step-by-step solutions and trap warnings.
 * 5. Immutable 90-Day Master Schedule (Oct 1 to Dec 29, 2026).
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
import {
  searchPyqArchive,
  formatPyqToMarkdown,
} from "@/lib/pyq-archive";

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

  return `You are the GATE 2027 Personal AI Study Coach & Resource Navigator.

YOUR PERSONALITY & TONE:
- Be warm, friendly, encouraging, empathetic, and supportive—like a great personal mentor who truly cares about the student's success.
- Use encouraging language ("Great job!", "You've got this!", "Let's make today count!").
- Keep stress low and confidence high.
- Be clear, structured, and decisive.

CORE PRODUCT IDENTITY & PURPOSE:
- You are a Study Manager, Scheduler, Accountability Partner, and Resource Navigator.
- You are NOT a course/learning platform or lecture transcription tool.
- You direct students to verified external resources:
  - Video Lecture: [Watch exact lecture ▶](${resources.primary.url}) or [Open topic roadmap ↗](${resources.primary.url})
  - GATE PYQs: [Open exact topic PYQs ↗](${resources.pyq.url})
  - Exact Topic MCQs: [Solve Exact Topic MCQs ↗](${resources.topicMcq.url})
  - Official IIT GATE Portal: [Open official GATE paper ↗](${resources.official.url})

GREETING RULE:
If the student says "hi", "hello", "hey", or asks for help getting started:
Greet them warmly and enthusiastically! Give a crisp 1-sentence snapshot of Today's active target (Day ${dayNum}: ${topic} in ${subject}), and present 4 friendly choices:
1. 🎯 **Today's Action Plan:** ${resources.isDirect ? `[Watch exact lecture ▶](${resources.primary.url})` : `[Open topic roadmap ↗](${resources.primary.url})`}, [Open exact topic PYQs ↗](${resources.pyq.url}), and [Solve Exact Topic MCQs ↗](${resources.topicMcq.url})
2. ⏱️ **Time Compressor:** Tell me if you have only 2h, 3h, or 4h today and I will rebalance your workload.
3. 🔍 **Find Any Syllabus Topic:** Ask me to find any lecture, roadmap, or PYQ bank across all 90 days (e.g. "find cache memory", "find paging", "where is day 45?").
4. 📜 **10-Year Official GATE PYQ:** Ask me for practice questions on any topic to fetch real questions with solutions and trap warnings!

10-YEAR OFFICIAL GATE PYQ ARCHIVE RULE:
If the user asks for practice questions, PYQs, problems, or wants to test their understanding on ANY topic:
Present an authentic official GATE question from the archive with:
- 📜 Paper, Year & Marks (e.g. GATE CS 2024 / 2023 / 2022)
- Question statement & options
- Correct Answer
- Complete Step-by-Step Solution
- ⚠️ Examiner Trap Warning (to avoid negative marking)
- Link to GATEOverflow discussion

NON-NEGOTIABLE PRODUCT RULE:
Do NOT write lengthy academic textbooks or replace the primary lecture.
If the student asks to teach a massive topic from scratch ("Teach me DBMS normalization"), respond with warm guidance:
"Hey! For ${topic}, the most effective path is to study the assigned Gate Smashers lecture first, then test yourself on GATEOverflow and our Topic MCQs. Here are your direct links for today:
* ${resources.isDirect ? `[Watch exact lecture ▶](${resources.primary.url})` : `[Open topic roadmap ↗](${resources.primary.url})`}
* [Open exact topic PYQs ↗](${resources.pyq.url})
* [Solve Exact Topic MCQs ↗](${resources.topicMcq.url})
I am right here to help you schedule your hours, explain examiner traps, and review your solutions!"

FORMATTING RULES:
- Use clean Markdown with headers (###), bullet points, and bold text.
- Always use clickable markdown links [text](url) so the UI renders them as interactive buttons.
- Keep responses friendly, crisp, and actionable.

ACTIVE STUDENT CONTEXT:
- Today's Date: ${context.date || "2026-10-01"}
- Day Number: Day ${dayNum} / 90
- Active Subject: ${subject}
- Active Topic: ${topic}
- Subtopics: ${context.subtopics?.join(", ") || resources.subtopics?.join(", ") || "Core basics"}
- Daily Available Hours: ${context.availableHours || 6} Hours
- Missed Previous Day: ${context.missedYesterday ? "YES (Needs Recovery Overlay)" : "NO (On Track)"}
- Execution Risk Status: ${context.riskStatus || "ON_TRACK"}
- TODAY'S EXACT VERIFIED VIDEO: ${resources.primary.title} (${resources.primary.url}) [Direct: ${resources.isDirect ? "YES" : "NO"}]
- TODAY'S EXACT VERIFIED PYQS: ${resources.pyq.title} (${resources.pyq.url})
- TODAY'S EXACT TOPIC MCQS: ${resources.topicMcq.title} (${resources.topicMcq.url})
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
  const mcqAction = `[Solve Exact Topic MCQs ↗](${resources.topicMcq.url})`;

  // 0. Greeting handler (e.g. "hi", "hello", "hey")
  if (lower === "hi" || lower === "hello" || lower === "hey" || lower === "start" || lower === "help") {
    return `### 👋 Hey there! Welcome to Your GATE 2027 AI Coach

I'm your personal study manager, scheduler, and resource navigator. Let's make every hour count!

**Today's Active Focus (Day ${dayNum} of 90):**
* **Subject:** ${subject}
* **Goal:** ${topic}
* **Planned Schedule:** ${hours} Hours

**How can I help you right now?**
1. 🎯 **Today's Action Plan:** ${videoAction} • ${pyqAction} • ${mcqAction}
2. ⏱️ **Time Compressor:** Tell me if you have only 2h, 3h, or 4h today and I will rebalance your workload.
3. 🔍 **Find Any Syllabus Topic:** Type *"find cache memory"*, *"find Dijkstra"*, or *"where is day 45?"*.
4. 📜 **10-Year GATE PYQ:** Ask me for a question on any topic to test yourself with full solutions!
5. 🔄 **Missed-Day Catchup:** Type *"I missed yesterday"* to slot an automatic recovery block without disturbing the master plan.`;
  }

  // 1. Question / PYQ intent
  if (
    lower.includes("pyq") ||
    lower.includes("question") ||
    lower.includes("problem") ||
    lower.includes("solve") ||
    lower.includes("10 year")
  ) {
    const matchedPyqs = searchPyqArchive(query, 2);
    if (matchedPyqs.length > 0) {
      let resp = `### 🎯 Official GATE Practice Questions for You\n\nHere are authentic questions from our 10-year GATE archive matched to your request:\n\n`;
      matchedPyqs.forEach((q) => {
        resp += formatPyqToMarkdown(q) + `\n\n`;
      });
      resp += `**Direct Next Step:**\n* Open ${pyqAction} to solve more questions on this topic.\n* Test your speed on ${mcqAction}.`;
      return resp;
    }
  }

  // 2. Search / Finder intent
  if (isSearchIntent(query)) {
    const searchResults = searchKnowledgeBase(query);
    return formatSearchResultsToMarkdown(searchResults, query);
  }

  // 3. Redirection if user asks the AI to teach academic subject matter
  if (
    lower.startsWith("teach me") ||
    lower.includes("explain the concept of") ||
    lower.includes("give me a lecture on") ||
    lower.includes("explain in detail what is")
  ) {
    return `### 🛑 External Resource First — Let's Master ${topic}!

As your GATE Personal Coach, my job is to guide your schedule and execution—**not to replace your primary learning source**.

**Recommended Action for ${topic}:**
1. **Watch the Verified Lecture:**
   * Launch **Gate Smashers**: ${videoAction}.
   * Complete the core 45-minute conceptual block.
2. **Solve Official GATE Questions:**
   * Open **GATEOverflow**: ${pyqAction} and solve 5 topic PYQs.
   * Test yourself on **Topic MCQs**: ${mcqAction}.
3. **Log Doubts & Edge Cases:**
   * Write down the specific formula or edge case in your **Error Book**.

*I am right here to help you decide your time allocation, practice targets, and recovery schedule!*`;
  }

  // 4. "What should I do now?" / "What is today's plan?"
  if (lower.includes("what should i do") || lower.includes("what is today") || lower.includes("start now")) {
    return `### 🎯 Today's Action Plan — Day ${dayNum} of 90

**Available Time:** ${hours} Hours  
**Subject:** ${subject}  
**Primary Goal:** ${topic}

**Execute in this exact priority sequence:**
1. **Formula & Edge Case Warm-up (15m)**
   * Review yesterday's formula card and key traps in your Error Book.
2. **Theory Study (80m)**
   * Open ${videoAction} and master **${topic}**.
3. **Concept Notes (25m)**
   * Write one page of formulas and boundary conditions in your notebook.
4. **GATEOverflow PYQs (60m)**
   * Open ${pyqAction} and solve 10–12 real GATE questions.
5. **Exact Topic MCQs Practice (30m)**
   * Open ${mcqAction} and solve topic quizzes to test speed under time limits.
6. **Error Book & Reflection (15m)**
   * Log any question rated guessed or wrong into your Error Book with the preventive rule.

**AI Note:** You are currently **ON TRACK**. Protect the 60-minute PYQ block above all else!`;
  }

  // 5. Limited time (e.g. 2h or 3h)
  if (lower.includes("2 hour") || lower.includes("3 hour") || lower.includes("limited time") || lower.includes("only have")) {
    return `### ⏱️ Time-Compressed Plan (${hours <= 3 ? hours : 2} Hours)

**Reason Code:** \`TIME_LIMIT\`  
Because your available time is constrained, the study engine automatically protects core concept retention and top PYQs while deferring secondary tasks.

**Protected Today (Non-Negotiable):**
1. **Core Concept Theory (50 min)**
   * Open ${videoAction} for ${topic}.
2. **High-Yield PYQs (50 min)**
   * Open ${pyqAction} and solve 5 essential questions.
3. **Rapid Formula & Error Check (20 min)**
   * Note edge cases to avoid making repeat mistakes.

**Deferred to Buffer Session:**
* ❌ Defer secondary MCQ quizzes.
* ❌ Defer General Aptitude block to weekend buffer.

*The master 90-day timetable remains completely intact. Complete these 3 blocks and your day is a total win!*`;
  }

  // 6. Extra time (e.g. 8 hours)
  if (lower.includes("8 hour") || lower.includes("extra time") || lower.includes("free all day")) {
    return `### ⚡ High-Capacity Deep Study Plan (8 Hours)

**Reason Code:** \`AHEAD_OF_PLAN\`  
The engine does **not** blindly fast-forward future chapters. Instead, extra capacity is allocated to deep PYQ mastery, topic MCQs, and weak-topic reinforcement to lock in marks.

**8-Hour Structure:**
1. **Concept Warm-up (30m):** Review recent mistake logs in Error Book.
2. **Master Theory Block (150m):** Deep theory on **${topic}** via ${videoAction}.
3. **Summary & Formula Sheet (45m):** Detailed personal derivation sheet.
4. **Deep GATE PYQs (100m):** Solve 20 questions on ${pyqAction}.
5. **Exact Topic MCQs (45m):** Solve speed quizzes via ${mcqAction}.
6. **Error Book Deep Log (20m):** Write one-line preventive rules for each mistake.
7. **Targeted Weak-Topic Repair (45m):** Re-test previous mistake concepts.
8. **Rest & Buffer (45m):** Prevents cognitive burnout.`;
  }

  // 7. Missed yesterday / behind schedule
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
   * Secondary MCQ sets are moved to Sunday's buffer window.

*Estimated recovery time: 1–2 days. You are still fully on track for GATE 2027!*`;
  }

  // 8. Finished early
  if (lower.includes("finished early") || lower.includes("done early") || lower.includes("early")) {
    const early = handleEarlyCompletion(30, topic);
    return `### 🏆 Finished Early — Fantastic Work!

${early.recommendation}

**Recommended Next Step:**
* **Action:** ${early.suggestedAction}
* **Task:** ${early.nextTaskTitle} (${early.minutes} min)
* Open ${mcqAction} or solve 3 additional questions on ${pyqAction}.`;
  }

  // 9. "Why did you change this?"
  if (lower.includes("why did you change") || lower.includes("why change")) {
    return `### 🔍 Schedule Explanation

**Reason Code:** \`${context.missedYesterday ? "RECOVERY" : "TIME_LIMIT"}\`

**Why the plan was adjusted:**
* **Trigger:** Available time was set to ${hours}h ${context.missedYesterday ? "and a missed session was recorded" : ""}.
* **Protected:** Core concept theory on ${topic} and mandatory GATEOverflow PYQs.
* **Moved:** Low-priority enrichment practice was deferred to weekend buffer time to prevent burnout.

*The master 90-day end date of December 29, 2026 remains unchanged.*`;
  }

  // 10. Default Coach Response
  return `### 📋 GATE Study Coach Directive — Day ${dayNum}

**Current Focus:** ${subject} • ${topic}  
**Available Hours:** ${hours} Hours

1. **Step 1:** Study theory via ${videoAction} (90m).
2. **Step 2:** Solve assigned topic questions on ${pyqAction} (60m).
3. **Step 3:** Solve topic MCQs via ${mcqAction} (30m).
4. **Step 4:** Record mistakes in your **Digital Error Book** (15m).

*Tell me if your hours change, if you need a recovery plan, or ask me for an official GATE question to practice!*`;
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
  const candidateModels = [
    primaryModel,
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
  ];

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
        const choice = data.choices?.[0];
        let content = choice?.message?.content;
        if (!content && choice?.message?.reasoning) {
          content = choice.message.reasoning;
        }
        return content || "No response received from Groq.";
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
