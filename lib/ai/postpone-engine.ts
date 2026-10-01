import { StudyDay, DailyTask } from "@/lib/types";
import { getPlanDays } from "@/lib/data";

/**
 * Utility to add days to a 'YYYY-MM-DD' date string
 */
export function addDaysToDateString(dateStr: string, daysToAdd: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + daysToAdd);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Calculates day difference between two 'YYYY-MM-DD' dates
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split("-").map(Number);
  const [y2, m2, d2] = dateStr2.split("-").map(Number);
  const dt1 = new Date(y1, m1 - 1, d1).getTime();
  const dt2 = new Date(y2, m2 - 1, d2).getTime();
  return Math.round((dt2 - dt1) / (1000 * 60 * 60 * 24));
}

export type PostponeMode = "shift_all" | "move_to_buffer" | "custom_date";

export interface PostponeResult {
  updatedDays: StudyDay[];
  message: string;
  aiAnalysis: string;
  daysShifted: number;
}

/**
 * Identifies the nearest buffer / revision day after a given dayNumber
 */
export function findNextBufferDay(allDays: StudyDay[], afterDayNumber: number): StudyDay | undefined {
  return allDays.find(
    (d) =>
      d.dayNumber > afterDayNumber &&
      (d.isTestDay ||
        d.topic.toLowerCase().includes("buffer") ||
        d.topic.toLowerCase().includes("revision") ||
        d.topic.toLowerCase().includes("grand test"))
  );
}

/**
 * Generates instant AI tactical guidance and impact analysis for postponing a date
 */
export function getPostponeAiAnalysis(
  currentDay: StudyDay,
  mode: PostponeMode,
  daysShift: number,
  allDays: StudyDay[]
): string {
  const remainingDays = allDays.filter((d) => d.dayNumber >= currentDay.dayNumber).length;
  const isHighWeightage =
    currentDay.subject.includes("Programming") ||
    currentDay.subject.includes("Algorithms") ||
    currentDay.subject.includes("Operating") ||
    currentDay.subject.includes("DBMS");

  if (mode === "move_to_buffer") {
    const buffer = findNextBufferDay(allDays, currentDay.dayNumber);
    if (buffer) {
      return `💡 AI Recommendation: Moving "${currentDay.topic}" to Day ${buffer.dayNumber} (${buffer.topic}) preserves the master 90-day completion date without shifting syllabus deadlines. Ensure you prioritize the core PYQs during that buffer block.`;
    }
  }

  if (daysShift === 1) {
    return `⚡ AI Impact Analysis: Shifting by +1 day moves ${currentDay.topic} to tomorrow. Remaining ${remainingDays} days shift forward sequentially. ${
      isHighWeightage
        ? `Note: ${currentDay.subject} carries 8–10 marks in GATE; consider completing at least the 30-min formula review today before resting.`
        : "Low-impact shift. Safe to postpone."
    }`;
  }

  return `⚠️ AI Schedule Advisory: Shifting schedule forward by +${daysShift} days pushes final completion by ${daysShift} days. AI Coach recommends using upcoming weekend buffer blocks to absorb this delay and keep final revision intact.`;
}

/**
 * Core dynamic rescheduling engine:
 * Postpones any day in the 90-day plan and updates schedule state
 */
export function postponeDay(
  allDays: StudyDay[],
  dayNumber: number,
  mode: PostponeMode,
  options?: {
    daysToShift?: number;
    targetDate?: string;
  }
): PostponeResult {
  const targetDay = allDays.find((d) => d.dayNumber === dayNumber);
  if (!targetDay) {
    return {
      updatedDays: allDays,
      message: "Target day not found.",
      aiAnalysis: "",
      daysShifted: 0,
    };
  }

  let daysToShift = options?.daysToShift || 1;

  if (mode === "custom_date" && options?.targetDate) {
    daysToShift = Math.max(1, getDaysDifference(targetDay.date, options.targetDate));
  }

  let updatedDays: StudyDay[] = [];
  let message = "";
  let aiAnalysis = "";

  if (mode === "move_to_buffer") {
    const bufferDay = findNextBufferDay(allDays, dayNumber);
    if (!bufferDay) {
      // Fallback to shift_all if no buffer day found
      return postponeDay(allDays, dayNumber, "shift_all", { daysToShift: 1 });
    }

    updatedDays = allDays.map((d) => {
      if (d.dayNumber === dayNumber) {
        return {
          ...d,
          status: "scheduled",
          notes: `${d.notes ? d.notes + " • " : ""}[Rescheduled to Day ${bufferDay.dayNumber} Buffer]`,
        };
      }
      if (d.dayNumber === bufferDay.dayNumber) {
        // Merge topics into buffer day
        return {
          ...d,
          topic: `${bufferDay.topic} + Catch-up: ${targetDay.topic}`,
          subtopics: [...(bufferDay.subtopics || []), ...targetDay.subtopics],
          tasks: [
            ...bufferDay.tasks,
            ...targetDay.tasks.map((t) => ({ ...t, id: `shifted-${t.id}` })),
          ],
        };
      }
      return d;
    });

    message = `Day ${dayNumber} postponed to Day ${bufferDay.dayNumber} Buffer Day (${bufferDay.date}).`;
    aiAnalysis = getPostponeAiAnalysis(targetDay, "move_to_buffer", 0, allDays);
  } else {
    // Mode: shift_all or custom_date
    updatedDays = allDays.map((d) => {
      if (d.dayNumber >= dayNumber) {
        const newDate = addDaysToDateString(d.date, daysToShift);
        const isPostponedDay = d.dayNumber === dayNumber;
        return {
          ...d,
          date: newDate,
          notes: isPostponedDay
            ? `${d.notes ? d.notes + " • " : ""}[Postponed by +${daysToShift}d on ${new Date().toLocaleDateString()}]`
            : d.notes,
        };
      }
      return d;
    });

    const newTargetDate = addDaysToDateString(targetDay.date, daysToShift);
    message = `Day ${dayNumber} and subsequent days shifted by +${daysToShift} day(s). New date for Day ${dayNumber}: ${newTargetDate}.`;
    aiAnalysis = getPostponeAiAnalysis(targetDay, mode, daysToShift, allDays);
  }

  // Persist updated days to localStorage
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("gate_study_days", JSON.stringify(updatedDays));
      // Dispatch custom event for cross-component real-time reactivity
      window.dispatchEvent(
        new CustomEvent("gate-schedule-updated", {
          detail: { dayNumber, updatedDays, message },
        })
      );
    }
  } catch (err) {
    console.warn("Could not save postponed schedule to localStorage", err);
  }

  return {
    updatedDays,
    message,
    aiAnalysis,
    daysShifted: daysToShift,
  };
}

/**
 * Resets schedule back to original JSON baseline
 */
export function resetScheduleToBaseline(): StudyDay[] {
  const originalDays = getPlanDays();
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("gate_study_days", JSON.stringify(originalDays));
      window.dispatchEvent(
        new CustomEvent("gate-schedule-updated", {
          detail: { updatedDays: originalDays, message: "Schedule restored to original 90-day baseline." },
        })
      );
    }
  } catch (err) {
    console.warn("Could not reset schedule in localStorage", err);
  }
  return originalDays;
}

/**
 * Real-Time Continuous AI Guidance State
 */
export interface RealtimeGuidance {
  currentDayNumber: number;
  subject: string;
  topic: string;
  headline: string;
  actionText: string;
  nextTask: DailyTask | null;
  pendingCount: number;
  completedCount: number;
  totalTasks: number;
  examTrap: string;
  urgency: "high" | "medium" | "low";
  quickDirectives: {
    label: string;
    action: string;
    icon: string;
  }[];
}

/**
 * Computes exact Real-Time Guidance based on current day and task state
 */
export function getRealtimeAiGuidance(currentDay: StudyDay, allDays: StudyDay[]): RealtimeGuidance {
  const tasks = currentDay.tasks || [];
  const completed = tasks.filter((t) => t.completed);
  const pending = tasks.filter((t) => !t.completed);

  // Determine next priority task
  const nextCoreTask = pending.find((t) => t.isCore) || pending[0] || null;

  // Specific common exam traps for GATE CS topics
  const examTraps: Record<string, string> = {
    "C Variables, Data Types & Operators":
      "Examiners love postfix increment in conditional loops like `while(*p++)` where side-effect sequencing differs from prefix.",
    "Pointers & Arrays":
      "Array name `arr` decays to `&arr[0]`, but `&arr` is pointer to whole array. `sizeof(arr)` differs inside function arguments!",
    "Recursion & Storage Classes":
      "Static variables retain their values across recursive function calls — recalculate activation frames carefully.",
    "Cache Memory":
      "Remember: Number of sets = Total lines / Associativity K. Don't divide address bits directly!",
    "Paging & Virtual Memory":
      "Multi-level page tables save memory by leaving non-existent page table directories unallocated, but add memory access overhead.",
  };

  const trap =
    examTraps[currentDay.topic] ||
    "Double check boundary conditions, 0-indexing vs 1-indexing, and negative weight edges in graphs.";

  let headline = "";
  let actionText = "";
  let urgency: "high" | "medium" | "low" = "medium";

  if (pending.length === 0 && tasks.length > 0) {
    headline = "🎉 Today's Mission 100% Accomplished!";
    actionText = "All scheduled tasks are complete. Take a cognitive break or spend 15 mins reviewing your Error Book.";
    urgency = "low";
  } else if (nextCoreTask) {
    if (nextCoreTask.type === "learning") {
      headline = `Optimal Next Step: Master Core Theory (${nextCoreTask.estMinutes}m)`;
      actionText = `Watch verified video lecture for ${currentDay.topic}. Focus on foundational mechanics before solving problems.`;
      urgency = "high";
    } else if (nextCoreTask.type === "pyq") {
      headline = `Optimal Next Step: High-Yield GATE PYQs (${nextCoreTask.estMinutes}m)`;
      actionText = `Solve the designated GATEOverflow PYQs for ${currentDay.topic}. Avoid looking at answers for 5 minutes per question.`;
      urgency = "high";
    } else if (nextCoreTask.type === "review" || nextCoreTask.type === "notes") {
      headline = `Optimal Next Step: Notes & Mistake Check (${nextCoreTask.estMinutes}m)`;
      actionText = "Log any formula or tricky concept into your formula notebook to build active recall.";
      urgency = "medium";
    } else {
      headline = `Optimal Next Step: ${nextCoreTask.title}`;
      actionText = `Complete ${nextCoreTask.title} (${nextCoreTask.estMinutes} mins planned).`;
      urgency = "medium";
    }
  } else {
    headline = `Preparation Focus: Day ${currentDay.dayNumber}`;
    actionText = `Begin today's study cycle on ${currentDay.topic}.`;
    urgency = "medium";
  }

  return {
    currentDayNumber: currentDay.dayNumber,
    subject: currentDay.subject,
    topic: currentDay.topic,
    headline,
    actionText,
    nextTask: nextCoreTask,
    pendingCount: pending.length,
    completedCount: completed.length,
    totalTasks: tasks.length,
    examTrap: trap,
    urgency,
    quickDirectives: [
      { label: "What should I do right now?", action: "tactical_now", icon: "zap" },
      { label: "Postpone this Date", action: "postpone", icon: "calendar" },
      { label: "I have only 2 Hours", action: "compress_2h", icon: "clock" },
      { label: "Exam Trap Alert", action: "show_trap", icon: "alert" },
      { label: "Explain this Concept", action: "explain_ai", icon: "bot" },
    ],
  };
}
