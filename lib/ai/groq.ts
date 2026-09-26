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
}

export function buildStudyCoachPrompt(context: CoachContext): string {
  return `You are the student's dedicated, razor-sharp GATE CS/IT 2027 AI Preparation Manager and Study Coach.
Your primary role is to guide a B.Tech IT student preparing from scratch in a strict 90-day window (October 1 to December 29, 2026).

CRITICAL COACHING RULES:
1. You are a STUDY MANAGER & COACH, NOT an internal video or textbook platform.
2. Direct the student to external verified resources:
   - For Concept Learning: Gate Smashers (https://www.gatesmashers.com/learn)
   - For Topic PYQs & Tests: GATEOverflow (https://gateoverflow.in/questions?sort=gate, https://db.gateoverflow.in/tests)
   - For Official Syllabus & Pattern: Official GATE 2027 (https://gate2027.iitm.ac.in/)
3. Never invent fake URLs or claim AI-generated practice questions are official GATE questions.
4. When asked what to do today, give exact, step-by-step priority instructions with estimated time.
5. If the student has limited hours (e.g. 2h or 3h), intelligently tell them what to KEEP (Core concept + 5 PYQs + Revision) and what to MOVE (extra practice).
6. If the student missed yesterday, provide a calm recovery plan without destroying the master 90-day timetable.
7. Tone: Direct, practical, honest, execution-focused, encouraging without fake fluff.

ACTIVE STUDENT CONTEXT:
- Today's Date: ${context.date || "2026-10-01"}
- Day Number: Day ${context.currentDay || 1} / 90
- Active Subject: ${context.subject || "Programming & Data Structures"}
- Active Topic: ${context.topic || "C Variables & Operators"}
- Subtopics: ${context.subtopics?.join(", ") || "Core basics"}
- Daily Available Hours Selected: ${context.availableHours || 6} Hours
- Missed Previous Day: ${context.missedYesterday ? "YES - Needs Recovery Overlay" : "NO - On Track"}
- Known Weak Topics: ${context.weakTopics?.length ? context.weakTopics.join(", ") : "None yet recorded"}
- Recent Mistake Areas: ${context.recentMistakes?.length ? context.recentMistakes.join("; ") : "None recorded"}
`;
}

export function getHeuristicCoachResponse(
  query: string,
  context: CoachContext
): string {
  const lower = query.toLowerCase();
  const subject = context.subject || "Programming & Data Structures";
  const topic = context.topic || "C Fundamentals";
  const hours = context.availableHours || 6;

  if (lower.includes("only") && (lower.includes("hour") || lower.includes("time") || lower.includes("2") || lower.includes("3"))) {
    return `### ⏱️ Compressed Priority Plan (${hours} Hours Selected)

Because you have limited study time today, we will protect your core retention and push non-critical practice to the weekend.

**Keep Today (Non-Negotiable):**
1. **Concept Learning (${Math.min(hours * 30, 60)} min):**
   * Open Gate Smashers Learning Library ↗
   * Watch only the core explanation for **${topic}**.
2. **GATE PYQs (45 min):**
   * Open GATEOverflow ↗
   * Solve strictly 5 standard PYQs on ${topic}.
3. **Daily Revision & Error Log (15 min):**
   * Write down any formula or edge-case you missed.

**Move to Saturday:**
* ❌ Skip extra fresh practice questions.
* ❌ Skip General Aptitude today.

*The 90-day master timetable remains unchanged. Execute these 3 tasks and you are done for today!*`;
  }

  if (lower.includes("miss") || lower.includes("yesterday") || lower.includes("behind")) {
    return `### 🔄 Missed Day Recovery Protocol

**Do not panic, and do not try to study 14 hours today.** Cramming two full days into one destroys retention.

**Today's Recovery Strategy:**
1. **Primary Focus (70% time):** Continue today's planned topic (**${topic}**). Do not abandon today's schedule!
2. **Catch-up Block (30% time / 45 min):**
   * Review only the 1 most critical formula/concept from yesterday's missed topic.
   * Solve 3 PYQs from yesterday to confirm understanding.
3. **Moved:**
   * Defer optional practice sets to Sunday's buffer time.

*Your 90-day calendar dates stay fixed. Focus on today's mission!*`;
  }

  if (lower.includes("weak") || lower.includes("revise") || lower.includes("pointer")) {
    return `### 🩺 Targeted Weakness Repair: ${topic}

**Why this is happening:**
Most errors here come from confusing operator precedence or boundary conditions.

**Action Plan:**
1. **Step 1 (20 min):** Open your personal notebook and review the 1-page summary.
2. **Step 2 (30 min):** Open GATEOverflow and solve 5 questions you previously got wrong.
3. **Step 3 (10 min):** Log the exact reason you got them wrong into your Error Book.

*Remember: A topic is only finished when you can solve a question without looking at notes.*`;
  }

  // Default: What do I do today?
  return `### 🎯 Today's Mission & Guidance: Day ${context.currentDay || 1} / 90

**Subject:** ${subject}
**Topic:** ${topic}

**Step 1: Learn the Concept (90 min)**
* Open the **Gate Smashers Learning Library ↗**.
* Focus strictly on **${topic}**. Do not jump to tomorrow's chapters!

**Step 2: Summary Notes (20 min)**
* Write the key rules and formulas into your personal notebook.

**Step 3: Solve GATE PYQs (60 min)**
* Open **GATEOverflow ↗** and attempt today's assigned PYQs.
* Aim for at least 70% accuracy.

**Step 4: Error Book & Review (15 min)**
* Log every question you solved slowly or incorrectly into your Error Book.

**Today's Success Condition:**
You should be able to solve standard previous-year questions on **${topic}** without hesitation.`;
}

export async function callGroqCoach(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  apiKey?: string,
  model: string = "llama-3.3-70b-versatile"
): Promise<string> {
  const resolvedKey = apiKey || process.env.GROQ_API_KEY;

  if (!resolvedKey || resolvedKey.trim() === "") {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resolvedKey}`,
    },
    body: JSON.stringify({
      model: model || "llama-3.3-70b-versatile",
      messages,
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response received from Groq.";
}
