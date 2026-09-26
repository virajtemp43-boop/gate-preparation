export type MistakeCategory =
  | "concept_gap"
  | "formula_forgotten"
  | "formula_error"
  | "calculation_error"
  | "misread_question"
  | "reading_error"
  | "time_pressure"
  | "guessing"
  | "silly_mistake"
  | "weak_reasoning";

export type ConfidenceLevel = "A" | "B" | "C" | "D";
// A: Solved confidently
// B: Solved but slow/uncertain
// C: Wrong / couldn't solve
// D: Completely new concept

export type TaskType =
  | "learning"
  | "notes"
  | "practice"
  | "pyq"
  | "ai_practice"
  | "aptitude"
  | "review"
  | "test";

export type DayStatus =
  | "completed"
  | "in_progress"
  | "pending"
  | "missed"
  | "scheduled";

export interface DailyTask {
  id: string;
  title: string;
  type: TaskType;
  estMinutes: number;
  resourceUrl?: string;
  provider?: string;
  targetCount?: number;
  isCore: boolean;
  completed: boolean;
}

export interface DailyBriefing {
  mission: string;
  whyItMatters: string;
  prerequisites: string;
  whatToStudy: string;
  whatNotToStudy: string;
  successCondition: string;
}

export type TopicVideoLocator = {
  title: string;
  directUrl?: string;
  roadmapUrl: string;
  playlistUrl?: string;
  searchFallbackUrl: string;
  status: "verified_direct" | "topic_locator" | "test_resource";
  provider: "Gate Smashers" | "Official GATE" | "GATEOverflow";
};

export type TopicPyqLocator = {
  title: string;
  url: string;
  status: "verified_topic_tag" | "subject_previous_gate" | "test_resource";
  provider: "GATEOverflow" | "Official GATE";
};

export type DayResourceMap = {
  day: number;
  date: string;
  subject: string;
  topic: string;
  videos: TopicVideoLocator[];
  pyqs: TopicPyqLocator[];
  subtopics: string[];
};

export interface StudyDay {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  month: number; // 1, 2, or 3
  monthName: string; // "October", "November", "December"
  subject: string;
  subjectName?: string;
  topic: string;
  topicTitle?: string;
  subtopics: string[];
  plannedHours: number;
  targetMinutes?: number;
  briefing: DailyBriefing;
  learningResource?: {
    provider: string;
    title: string;
    url: string;
    timeMin: number;
  };
  pyqResource?: {
    provider: string;
    title: string;
    url: string;
    target: number;
  };
  exactResources?: DayResourceMap;
  pyqTarget?: number;
  freshQuestionTarget?: number;
  tasks: DailyTask[];
  isTestDay: boolean;
  notes?: string;
  status?: DayStatus;
}

export interface ResourceRegistryItem {
  resource_id: string;
  provider: string;
  subject: string;
  topic: string;
  resource_type: "learning" | "pyq" | "mock_test" | "reference" | "official" | "practice";
  url: string;
  title: string;
  short_description: string;
  priority: number;
  free_or_paid: string;
  last_verified_at: string;
  is_active: boolean;
}

export type ResourceLink = ResourceRegistryItem;

export interface PyqAttemptLog {
  id: string;
  subject: string;
  topic: string;
  year?: number;
  sourceUrl: string;
  attempted: number;
  correct: number;
  confidence: ConfidenceLevel;
  notes?: string;
  date: string;
}

export interface ErrorBookEntry {
  id: string;
  questionTopic?: string;
  topic?: string;
  subject?: string;
  subjectId?: string;
  subjectName?: string;
  whatIAnswered?: string;
  userAnswer?: string;
  correctAnswer: string;
  whyWrong: string;
  conceptMissed?: string;
  correctConcept?: string;
  shortRule?: string;
  mistakeType: MistakeCategory;
  correctedApproach?: string;
  reviewDate?: string;
  nextRevisionDate?: string;
  timesRepeated: number;
  status: "unresolved" | "revising" | "mastered";
  createdAt: string;
  questionId?: string;
}

export interface RevisionItem {
  id: string;
  subject: string;
  topic: string;
  dueDate: string;
  interval: "same_day" | "+1d" | "+7d" | "+21d";
  questionsTarget: number;
  minutesTarget: number;
  completed: boolean;
}

export interface RevisionCard {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  concept?: string;
  front?: string;
  back?: string;
  keyFormula?: string;
  trapToAvoid?: string;
  trapWarning?: string;
  intervalStage: number; // 0 to 5
  status: "due" | "completed";
  lastReviewed?: string;
  dueDate?: string;
  miniQuestion?: {
    prompt: string;
    answer: string;
  };
}

export interface Question {
  id: string;
  isPYQ: boolean;
  subject: string;
  subjectId?: string;
  subjectName?: string;
  topic: string;
  type: "MCQ" | "MSQ" | "NAT";
  marks?: number;
  year?: number;
  set?: number;
  questionText: string;
  options?: string[];
  correctAnswer: string | number | number[];
  tolerance?: { min: number; max: number };
  explanation: string;
  commonTrap?: string;
}

export type AiTutorMode =
  | "explain"
  | "simplify"
  | "deep_dive"
  | "hint"
  | "solve"
  | "quiz_me"
  | "interview_me"
  | "pyq_explain"
  | "mistake_analysis"
  | "revision_card"
  | "study_coach"
  | "doubt_solver"
  | "time_adjust"
  | "recovery"
  | "error_review";

export interface Subject {
  id: string;
  name: string;
  code: string;
  weightageRange: string;
  description: string;
  gateSmashersUrl?: string;
}
