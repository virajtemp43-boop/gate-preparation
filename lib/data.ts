import planDaysData from "@/data/gate/plan-90-days.json";
import resourcesData from "@/data/gate/resources.json";
import subjectsData from "@/data/gate/subjects.json";
import practiceQuestionsData from "@/data/gate/practice-questions.json";

import {
  StudyDay,
  ResourceRegistryItem,
  RevisionItem,
  RevisionCard,
  ErrorBookEntry,
  Question,
} from "./types";

export const FIXED_PLAN_START_DATE = "2026-10-01";
export const FIXED_PLAN_END_DATE = "2026-12-29";

export function getPlanDays(): StudyDay[] {
  return planDaysData as StudyDay[];
}

export function getPlanDay(dayNumber: number): StudyDay | undefined {
  return (planDaysData as StudyDay[]).find((d) => d.dayNumber === dayNumber);
}

export function getCurrentPlanDay(currentDate: Date = new Date()): {
  dayNumber: number;
  isPreLaunch: boolean;
  daysUntilLaunch: number;
  activeDay: StudyDay;
} {
  const start = new Date(2026, 9, 1); // Oct 1, 2026
  const diffTime = currentDate.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays < 1) {
    const daysUntil = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
    return {
      dayNumber: 1,
      isPreLaunch: true,
      daysUntilLaunch: daysUntil,
      activeDay: planDaysData[0] as unknown as StudyDay,
    };
  }

  const boundedDay = Math.min(Math.max(diffDays, 1), 90);
  const active =
    (planDaysData as unknown as StudyDay[]).find((d) => d.dayNumber === boundedDay) ||
    (planDaysData[0] as unknown as StudyDay);

  return {
    dayNumber: boundedDay,
    isPreLaunch: false,
    daysUntilLaunch: 0,
    activeDay: active,
  };
}

export function getResources(): ResourceRegistryItem[] {
  return resourcesData as ResourceRegistryItem[];
}

export function getSubjects() {
  return subjectsData;
}

export function getPracticeQuestions(): Question[] {
  return practiceQuestionsData as unknown as Question[];
}

export function getAllQuestions(): Question[] {
  return practiceQuestionsData as unknown as Question[];
}

export function getInitialRevisionItems(): RevisionItem[] {
  return [
    {
      id: "rev-1",
      subject: "Programming & Data Structures",
      topic: "C Pointers & Array Dereferencing",
      dueDate: "2026-10-02",
      interval: "+1d",
      questionsTarget: 5,
      minutesTarget: 15,
      completed: false,
    },
    {
      id: "rev-2",
      subject: "Algorithms",
      topic: "Master Theorem Case 2 & Asymptotics",
      dueDate: "2026-10-07",
      interval: "+7d",
      questionsTarget: 8,
      minutesTarget: 20,
      completed: false,
    },
    {
      id: "rev-3",
      subject: "Databases / DBMS",
      topic: "Functional Dependencies & 3NF vs BCNF",
      dueDate: "2026-10-21",
      interval: "+21d",
      questionsTarget: 10,
      minutesTarget: 25,
      completed: false,
    },
  ];
}

export function getRevisionCards(): RevisionCard[] {
  return [
    {
      id: "rev-card-1",
      subjectId: "c-prog",
      subjectName: "C Programming",
      topic: "Pointer Operator Precedence",
      front: "What is the exact evaluation order and side-effects of `*ptr++` vs `(*ptr)++`?",
      back: "`*ptr++` returns `*ptr` and then increments the pointer address `ptr` by `sizeof(*ptr)`. In contrast, `(*ptr)++` increments the value stored at `ptr`.",
      trapWarning: "Examiners constantly hide `*p++` in loops to trick you into modifying array values when only pointers are moving.",
      intervalStage: 1,
      status: "due",
      lastReviewed: "2026-09-25",
    },
    {
      id: "rev-card-2",
      subjectId: "coa",
      subjectName: "Computer Organization",
      topic: "Cache Set Associativity",
      front: "Given 64 KB 4-way set associative cache with 32-byte blocks and 32-bit physical address, calculate Tag bits.",
      back: "Total Blocks = 64KB / 32B = 2048. Number of Sets = 2048 / 4 = 512 = 2^9 (9 index bits). Block offset = log2(32) = 5 bits. Tag = 32 - (9 + 5) = 18 bits.",
      trapWarning: "Don't divide cache size directly by 4! First find total lines = Cache / BlockSize, then Sets = Total Lines / K.",
      intervalStage: 3,
      status: "due",
      lastReviewed: "2026-09-20",
    },
    {
      id: "rev-card-3",
      subjectId: "os",
      subjectName: "Operating Systems",
      topic: "Banker's Algorithm Safety Check",
      front: "What are the four necessary and sufficient conditions for deadlock? What vector does Banker's check?",
      back: "Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Banker's calculates `Need = Max - Allocation` and verifies if `Need[i] <= Available` iteratively.",
      trapWarning: "Banker's algorithm avoids deadlock, it does not prevent it. Safe state guarantees no deadlock, but unsafe state doesn't necessarily mean deadlock has occurred immediately.",
      intervalStage: 0,
      status: "due",
    },
    {
      id: "rev-card-4",
      subjectId: "dbms",
      subjectName: "Databases (DBMS)",
      topic: "Lossless Join Decomposition",
      front: "State the necessary and sufficient condition for a decomposition of R into R1 and R2 to be lossless-join.",
      back: "(R1 ∩ R2) must be a superkey of either R1 or R2 in F+ (i.e. (R1 ∩ R2) -> R1 OR (R1 ∩ R2) -> R2).",
      trapWarning: "Dependency preservation is orthogonal to lossless join. A decomposition can be lossless without preserving all dependencies (e.g. BCNF).",
      intervalStage: 2,
      status: "due",
      lastReviewed: "2026-09-22",
    },
  ];
}

export function getInitialErrorBook(): ErrorBookEntry[] {
  return [
    {
      id: "err-1",
      questionTopic: "C Pointer Operator Precedence (*p++)",
      topic: "C Pointer Operator Precedence (*p++)",
      subject: "Programming & Data Structures",
      subjectName: "Programming & Data Structures",
      subjectId: "c-prog",
      whatIAnswered: "Incremented value stored at p to 11",
      userAnswer: "11",
      correctAnswer: "Evaluated *p as 10, then incremented pointer address",
      whyWrong: "Confused *p++ with (*p)++. Postfix ++ binds tighter to p, but expression yields old *p.",
      conceptMissed: "Operator precedence and postfix side-effect sequencing in C expressions.",
      correctConcept: "Operator precedence and postfix side-effect sequencing in C expressions.",
      shortRule: "Always write (*p)++ when intending to increment the stored memory value.",
      mistakeType: "reading_error",
      correctedApproach: "Always write (*p)++ when intending to increment the stored memory value.",
      reviewDate: "2026-10-03",
      nextRevisionDate: "2026-10-03",
      timesRepeated: 1,
      status: "unresolved",
      createdAt: new Date().toISOString(),
    },
    {
      id: "err-2",
      questionTopic: "Set-Associative Tag Size Calculation",
      topic: "Set-Associative Tag Size Calculation",
      subject: "Computer Organization & Architecture",
      subjectName: "Computer Organization & Architecture",
      subjectId: "coa",
      whatIAnswered: "14 Tag bits",
      userAnswer: "14 Tag bits",
      correctAnswer: "18 Tag bits",
      whyWrong: "Divided address by K instead of dividing total lines by K to find sets.",
      conceptMissed: "Number of Sets = Total Lines / K, where Total Lines = Cache / Block.",
      correctConcept: "Number of Sets = Total Lines / K, where Total Lines = Cache / Block.",
      shortRule: "Tag = AddressBits - (log2(Sets) + log2(BlockSize)).",
      mistakeType: "formula_forgotten",
      correctedApproach: "Tag = AddressBits - (log2(Sets) + log2(BlockSize)).",
      reviewDate: "2026-10-05",
      nextRevisionDate: "2026-10-05",
      timesRepeated: 2,
      status: "revising",
      createdAt: new Date().toISOString(),
    },
  ];
}
