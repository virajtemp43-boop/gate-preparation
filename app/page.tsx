"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  Play,
  Pause,
  RotateCcw,
  Check,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Award,
  Layers,
  Send,
  SlidersHorizontal,
  Flame,
  Lightbulb,
  FileText,
  Clock3,
} from "lucide-react";
import { getCurrentPlanDay, getPlanDays } from "@/lib/data";
import { StudyDay, DailyTask } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getDailyThought } from "@/lib/daily-thoughts";
import { ThoughtModal } from "@/components/dashboard/thought-modal";
import GlassSurface from "@/components/ui/GlassSurface";
import { PostponeModal } from "@/components/ai/postpone-modal";
import { getRealtimeAiGuidance } from "@/lib/ai/postpone-engine";
import {
  calculateScheduleForHours,
  evaluateExecutionRisk,
  handleEarlyCompletion,
  handlePartialCompletion,
  resolveTaskResources,
  generateWeeklyReview,
  ScheduleProposal,
  WeeklyDiagnosticReview,
} from "@/lib/ai/study-engine";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function TodayCommandCenterContent() {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");

  const [currentDay, setCurrentDay] = useState<StudyDay | null>(null);
  const [allDays, setAllDays] = useState<StudyDay[]>([]);
  const [availableHours, setAvailableHours] = useState<number>(6);
  const [quickQuestion, setQuickQuestion] = useState("");
  const [coachAnswer, setCoachAnswer] = useState<string | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [isPreLaunch, setIsPreLaunch] = useState(false);
  const [daysUntilLaunch, setDaysUntilLaunch] = useState(0);

  // Calendar Navigator & Thought Modal & Day Notes State
  const [activePhaseTab, setActivePhaseTab] = useState<1 | 2 | 3>(1);
  const [isThoughtModalOpen, setIsThoughtModalOpen] = useState(false);
  const dayDetailsRef = useRef<HTMLDivElement>(null);
  const [dayNotes, setDayNotes] = useState<{ [dayNumber: number]: string }>({});

  // Layer 1 Decision Engine State
  const [activeProposal, setActiveProposal] = useState<ScheduleProposal | null>(null);
  const [originalTasksBackup, setOriginalTasksBackup] = useState<DailyTask[] | null>(null);
  const [weeklyReviewOpen, setWeeklyReviewOpen] = useState(false);
  const [weeklyReviewData, setWeeklyReviewData] = useState<WeeklyDiagnosticReview | null>(null);

  // Live Study Session Controller
  const [activeSessionTaskId, setActiveSessionTaskId] = useState<string | null>(null);
  const [sessionTimerSecs, setSessionTimerSecs] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [sessionFeedback, setSessionFeedback] = useState<string | null>(null);

  // Dynamic Date Postponement & Rescheduling State
  const [isPostponeModalOpen, setIsPostponeModalOpen] = useState<boolean>(false);
  const [targetPostponeDay, setTargetPostponeDay] = useState<StudyDay | null>(null);

  useEffect(() => {
    const days = getPlanDays();
    setAllDays(days);

    const planInfo = getCurrentPlanDay();
    setIsPreLaunch(planInfo.isPreLaunch);
    setDaysUntilLaunch(planInfo.daysUntilLaunch);

    let day = planInfo.activeDay || days[0];

    // Read stored user progress & notes from localStorage
    try {
      const saved = localStorage.getItem("gate_study_days");
      if (saved) {
        const parsed: StudyDay[] = JSON.parse(saved);
        setAllDays(parsed);

        if (dayParam) {
          const targetDayNum = parseInt(dayParam, 10);
          const matched = parsed.find((d) => d.dayNumber === targetDayNum);
          if (matched) day = matched;
        } else {
          const match = parsed.find((d) => d.dayNumber === day.dayNumber);
          if (match) day = match;
        }
      } else if (dayParam) {
        const targetDayNum = parseInt(dayParam, 10);
        const matched = days.find((d) => d.dayNumber === targetDayNum);
        if (matched) day = matched;
      }

      const savedHours = localStorage.getItem("gate_daily_hours");
      if (savedHours) setAvailableHours(Number(savedHours));

      const savedNotes = localStorage.getItem("gate_day_notes");
      if (savedNotes) {
        setDayNotes(JSON.parse(savedNotes));
      }
    } catch (e) {
      console.warn("Could not read local storage state", e);
    }

    setCurrentDay(day);
    setActivePhaseTab(day.month as (1 | 2 | 3));
    if (day.tasks && day.tasks.length > 0) {
      setActiveSessionTaskId(day.tasks[0].id);
    }
  }, [dayParam]);

  const handleUpdateDayNote = (dayNum: number, text: string) => {
    const updated = { ...dayNotes, [dayNum]: text };
    setDayNotes(updated);
    try {
      localStorage.setItem("gate_day_notes", JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not save day note", err);
    }
  };

  // Listener for CircleNav thought modal trigger
  useEffect(() => {
    const handleOpen = () => setIsThoughtModalOpen(true);
    window.addEventListener("open-gate-thought-modal", handleOpen);
    return () => window.removeEventListener("open-gate-thought-modal", handleOpen);
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionTimerSecs((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Real-Time Schedule Update listener for reactive calendar updates
  useEffect(() => {
    const handleScheduleUpdated = () => {
      try {
        const saved = localStorage.getItem("gate_study_days");
        if (saved) {
          const parsed: StudyDay[] = JSON.parse(saved);
          setAllDays(parsed);
          if (currentDay) {
            const updatedCurrent = parsed.find((d) => d.dayNumber === currentDay.dayNumber) || parsed[0];
            setCurrentDay(updatedCurrent);
          }
        }
      } catch (err) {
        console.warn("Could not reload schedule on update event", err);
      }
    };

    window.addEventListener("gate-schedule-updated", handleScheduleUpdated);
    return () => window.removeEventListener("gate-schedule-updated", handleScheduleUpdated);
  }, [currentDay]);

  const handleOpenPostpone = (dayToPostpone?: StudyDay) => {
    setTargetPostponeDay(dayToPostpone || currentDay);
    setIsPostponeModalOpen(true);
  };

  const handlePostponeScheduleUpdated = (updatedDays: StudyDay[], message: string) => {
    setAllDays(updatedDays);
    if (currentDay) {
      const match = updatedDays.find((d) => d.dayNumber === currentDay.dayNumber) || updatedDays[0];
      setCurrentDay(match);
    }
    setSessionFeedback(`📅 ${message}`);
  };

  if (!currentDay) return null;

  // Daily Mindset Thought for current day
  const dailyThought = getDailyThought(currentDay.dayNumber);

  // Evaluate Current Preparation Risk State
  const riskAssessment = evaluateExecutionRisk(allDays, currentDay.dayNumber);

  // Task Resources Resolver (Exact Topic Resolution)
  const taskResources = resolveTaskResources(currentDay.subject, currentDay.topic, currentDay.dayNumber);

  // Continuous Real-Time AI Guidance
  const realtimeGuidance = currentDay ? getRealtimeAiGuidance(currentDay, allDays) : null;

  // Day Selection Handler (Opens that day's complete full view)
  const handleSelectDay = (day: StudyDay) => {
    setCurrentDay(day);
    setActivePhaseTab(day.month as (1 | 2 | 3));
    setActiveProposal(null);
    setOriginalTasksBackup(null);
    if (day.tasks && day.tasks.length > 0) {
      setActiveSessionTaskId(day.tasks[0].id);
    }
    setSessionTimerSecs(0);
    setIsTimerRunning(false);
    setCoachAnswer(null);

    // Update URL history without reload
    window.history.pushState({}, "", `/?day=${day.dayNumber}`);

    // Smooth scroll down to reveal that day's complete dashboard
    setTimeout(() => {
      dayDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const handleToggleTask = (taskId: string) => {
    if (!currentDay) return;

    const updatedTasks = currentDay.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const updatedDay = { ...currentDay, tasks: updatedTasks };
    setCurrentDay(updatedDay);

    const updatedAllDays = allDays.map((d) =>
      d.dayNumber === currentDay.dayNumber ? updatedDay : d
    );
    setAllDays(updatedAllDays);

    try {
      localStorage.setItem("gate_study_days", JSON.stringify(updatedAllDays));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }

    const allCoreDone = updatedTasks.filter((t) => t.isCore).every((t) => t.completed);
    if (allCoreDone) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSelectAvailableHours = (hrs: number) => {
    setAvailableHours(hrs);
    localStorage.setItem("gate_daily_hours", String(hrs));

    const proposal = calculateScheduleForHours(currentDay, hrs, riskAssessment.status !== "ON_TRACK");
    if (!originalTasksBackup) {
      setOriginalTasksBackup(currentDay.tasks);
    }
    setActiveProposal(proposal);
  };

  const handleApplyProposal = () => {
    if (!activeProposal || !currentDay) return;
    const updatedDay = { ...currentDay, tasks: activeProposal.tasks };
    setCurrentDay(updatedDay);

    const updatedAll = allDays.map((d) =>
      d.dayNumber === currentDay.dayNumber ? updatedDay : d
    );
    setAllDays(updatedAll);
    localStorage.setItem("gate_study_days", JSON.stringify(updatedAll));
    setActiveProposal({ ...activeProposal, applied: true });
  };

  const handleUndoProposal = () => {
    if (!originalTasksBackup || !currentDay) return;
    const restoredDay = { ...currentDay, tasks: originalTasksBackup };
    setCurrentDay(restoredDay);

    const updatedAll = allDays.map((d) =>
      d.dayNumber === currentDay.dayNumber ? restoredDay : d
    );
    setAllDays(updatedAll);
    localStorage.setItem("gate_study_days", JSON.stringify(updatedAll));
    setActiveProposal(null);
    setOriginalTasksBackup(null);
  };

  const handleFinishedEarly = () => {
    if (!currentDay) return;
    const result = handleEarlyCompletion(30, currentDay.topic);
    setSessionFeedback(`⚡ ${result.recommendation}`);
    setSessionTimerSecs(0);
    setIsTimerRunning(false);
  };

  const handlePartialFinish = () => {
    if (!currentDay) return;
    const activeTask = currentDay.tasks.find((t) => t.id === activeSessionTaskId);
    const plannedMinutes = activeTask?.estMinutes || 60;
    const elapsedMinutes = Math.round(sessionTimerSecs / 60);

    const partialResult = handlePartialCompletion(elapsedMinutes, plannedMinutes, activeTask?.title || "Task");
    setSessionFeedback(`⏳ ${partialResult.statusText} ${partialResult.actionText}`);
    setSessionTimerSecs(0);
  };

  const handleAskCoach = async (queryText?: string) => {
    const q = queryText || quickQuestion;
    if (!q.trim() || coachLoading || !currentDay) return;

    setCoachLoading(true);
    setCoachAnswer(null);

    const lower = q.toLowerCase();
    if (lower.includes("2 hour") || lower.includes("2h")) {
      handleSelectAvailableHours(2);
    } else if (lower.includes("3 hour") || lower.includes("3h")) {
      handleSelectAvailableHours(3);
    } else if (lower.includes("8 hour") || lower.includes("8h")) {
      handleSelectAvailableHours(8);
    }

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          context: {
            currentDay: currentDay.dayNumber,
            date: currentDay.date,
            subject: currentDay.subject,
            topic: currentDay.topic,
            subtopics: currentDay.subtopics,
            availableHours,
            riskStatus: riskAssessment.status,
            missedYesterday: riskAssessment.status !== "ON_TRACK",
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setCoachAnswer(data.reply);
      }
    } catch {
      setCoachAnswer("AI Coach guidance delivered via Layer 1 Study Engine.");
    } finally {
      setCoachLoading(false);
    }
  };

  const handleOpenWeeklyReview = () => {
    const review = generateWeeklyReview(allDays, Math.ceil(currentDay.dayNumber / 7));
    setWeeklyReviewData(review);
    setWeeklyReviewOpen(true);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const displayedTasks = currentDay.tasks || [];
  const totalTasks = displayedTasks.length;
  const completedTasks = displayedTasks.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalCompletedDays = allDays.filter((d) => d.tasks?.every((t) => t.completed)).length;
  const overall90DayPercent = Math.round((totalCompletedDays / 90) * 100);

  const phaseDays = allDays.filter((d) => d.month === activePhaseTab);

  const phases = [
    {
      id: 1 as const,
      label: "Month 1 (Days 1–30)",
      dates: "01 Oct – 30 Oct 2026",
      subjectFocus: "Math & Foundation",
      // Oct 1, 2026 is Thursday -> 3 days padding (Mon, Tue, Wed)
      startDayOffset: 3,
    },
    {
      id: 2 as const,
      label: "Month 2 (Days 31–60)",
      dates: "31 Oct – 29 Nov 2026",
      subjectFocus: "Core Systems & Architecture",
      // Oct 31, 2026 is Saturday -> 5 days padding (Mon..Fri)
      startDayOffset: 5,
    },
    {
      id: 3 as const,
      label: "Month 3 (Days 61–90)",
      dates: "30 Nov – 29 Dec 2026",
      subjectFocus: "Networks, TOC & Revision",
      // Nov 30, 2026 is Monday -> 0 days padding
      startDayOffset: 0,
    },
  ];

  const currentPhaseConfig = phases.find((p) => p.id === activePhaseTab) || phases[0];
  const padCells = Array.from({ length: currentPhaseConfig.startDayOffset });

  return (
    <div className="space-y-5 w-full max-w-[1640px] mx-auto pt-8 sm:pt-10 pb-20 animate-fade-in-up text-slate-900">
      {/* 0. DAILY INSPIRATION & GATE MINDSET THOUGHT (Popup Modal on Demand) */}
      <ThoughtModal
        isOpen={isThoughtModalOpen}
        onClose={() => setIsThoughtModalOpen(false)}
        dayNumber={currentDay.dayNumber}
        thought={dailyThought}
      />

      {/* 1. MASTER TIMETABLE CALENDAR (MAXIMIZED FULL VIEW DIRECTLY AT TOP - NO CLUTTER) */}
      <GlassSurface
        borderRadius={28}
        className="w-full p-4 sm:p-5 lg:p-6 space-y-3 shadow-2xl border border-white/95"
      >
        {/* Sleek, Compact Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-emerald-900/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#022c22] to-[#064e3b] text-[#fef08a] border border-[#d4af37]/80 shadow-md shadow-[#022c22]/40 shrink-0">
              <Clock3 className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#022018]">
                  90-Day Master Timetable
                </h1>
                <span className="text-[11px] font-mono font-black text-[#022c22] bg-[#fef9c3] px-3 py-0.5 rounded-full border border-[#d4af37]/80 shadow-2xs">
                  {currentPhaseConfig.dates}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium mt-0.5">
                Exact weekday-aligned schedule. Click any day to open its full study mission, questions, and notes below.
              </p>
            </div>
          </div>

          {/* Integrated Compact Month Switcher & Quick Buttons */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            {/* Minimalist Month Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white/70 rounded-2xl border border-white/90 shadow-2xs">
              {phases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhaseTab(phase.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activePhaseTab === phase.id
                      ? "metallic-dark-green-btn text-[#fef9c3] shadow-md border-amber-400/90 scale-102"
                      : "text-[#022018] hover:text-[#064e3b] hover:bg-white/80"
                  }`}
                >
                  <span>{phase.label}</span>
                </button>
              ))}
            </div>

            {/* Daily Mindset Trigger */}
            <button
              onClick={() => setIsThoughtModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl luxury-glass-gold border border-amber-400 text-amber-950 text-xs font-black transition-all hover:scale-102 shadow-2xs cursor-pointer"
              title="Open Daily Aspirant Thought & Mindset Popup"
            >
              <Lightbulb className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span className="hidden sm:inline">Daily Mindset</span>
            </button>

            {/* Jump to Today Shortcut */}
            <button
              onClick={() => {
                const planInfo = getCurrentPlanDay();
                const targetDayNum = planInfo.activeDay?.dayNumber || 1;
                const todayObj = allDays.find((d) => d.dayNumber === targetDayNum) || allDays[0];
                if (todayObj) handleSelectDay(todayObj);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl metallic-shining-gold-btn text-[#022018] text-xs font-black shadow-md cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Today: Day {currentDay?.dayNumber || 1}</span>
            </button>
          </div>
        </div>

        {/* Full Weekday Timeline Display */}
        <div className="space-y-1.5 pt-0.5">
          {/* Weekday Strip with Crisp Light Borders */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {WEEKDAYS.map((dayName, idx) => (
              <div
                key={dayName}
                className={`py-1 text-xs font-mono font-black tracking-wider rounded-xl border shadow-2xs ${
                  idx >= 5
                    ? "bg-amber-100/80 text-amber-950 border-amber-300/80"
                    : "bg-emerald-100/80 text-emerald-950 border-emerald-300/70"
                }`}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Exact Full-Width Weekday Grid with Clean Architectural Borders */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
            {/* Blank padding cells for exact alignment */}
            {padCells.map((_, i) => (
              <div
                key={`pad-${i}`}
                className="min-h-[92px] sm:min-h-[96px] lg:min-h-[98px] rounded-2xl border border-dashed border-white/50 bg-white/10 hidden lg:block opacity-35"
              />
            ))}

            {/* Real Days of the Active Month */}
            {phaseDays.map((d) => {
              const isSelected = d.dayNumber === currentDay.dayNumber;
              const isDone = d.tasks && d.tasks.length > 0 && d.tasks.every((t) => t.completed);
              const hasStarted = d.tasks && d.tasks.some((t) => t.completed);
              const dayNote = dayNotes[d.dayNumber];

              const cleanSubject =
                d.subject.includes("Programming") || d.subject.includes("Data Structures")
                  ? "Prog & DS"
                  : d.subject.includes("Algorithms")
                  ? "Algorithms"
                  : d.subject.includes("Discrete")
                  ? "Discrete Math"
                  : d.subject.includes("Engineering")
                  ? "Engg Math"
                  : d.subject.includes("Digital")
                  ? "Digital Logic"
                  : d.subject.includes("Organization") || d.subject.includes("Architecture")
                  ? "COA"
                  : d.subject.includes("Database")
                  ? "DBMS"
                  : d.subject.includes("Operating")
                  ? "Operating Sys"
                  : d.subject.includes("Network")
                  ? "Networks"
                  : d.subject.includes("Theory of Computation") || d.subject.includes("TOC")
                  ? "TOC"
                  : d.subject.includes("Compiler")
                  ? "Compiler"
                  : d.subject.includes("Aptitude")
                  ? "Aptitude"
                  : d.subject;

              return (
                <button
                  key={d.dayNumber}
                  onClick={() => handleSelectDay(d)}
                  className={`group relative p-2.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[102px] sm:min-h-[106px] lg:min-h-[108px] cursor-pointer hover:-translate-y-0.5 ${
                    isSelected
                      ? "luxury-glass-selected shadow-emerald-600/35 ring-2 ring-amber-400"
                      : isDone
                      ? "luxury-glass-emerald border-emerald-400/80 hover:border-emerald-600 shadow-xs"
                      : "liquid-glass-lens hover:border-amber-400/90 shadow-2xs"
                  }`}
                >
                  {/* Top Row: Day Number, Date, Status */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs font-mono font-black ${
                          isSelected ? "text-white" : "text-slate-950 group-hover:text-emerald-950"
                        }`}
                      >
                        Day {d.dayNumber < 10 ? `0${d.dayNumber}` : d.dayNumber}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          isSelected ? "text-emerald-100" : "text-slate-600"
                        }`}
                      >
                        • {formatDate(d.date).slice(0, 6)}
                      </span>
                    </div>

                    {d.isTestDay ? (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[8.5px] font-black ${
                          isSelected ? "bg-white/20 text-white" : "bg-rose-100 text-rose-800 border border-rose-300"
                        }`}
                      >
                        TEST
                      </span>
                    ) : isDone ? (
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                          isSelected ? "bg-white text-[#022c22]" : "bg-[#022c22] text-[#fef08a] border border-[#d4af37]/80 shadow-2xs"
                        }`}
                      >
                        ✓
                      </span>
                    ) : hasStarted ? (
                      <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-300 animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
                    )}
                  </div>

                  {/* Subject Badge & Topic Title */}
                  <div className="w-full my-0.5">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-black font-mono tracking-tight truncate max-w-full ${
                        isSelected
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-[#022c22]/15 text-[#022c22] border border-[#064e3b]/30 shadow-2xs"
                      }`}
                    >
                      {cleanSubject}
                    </span>
                    <p
                      className={`text-[11px] font-black line-clamp-2 leading-snug mt-0.5 ${
                        isSelected ? "text-white" : "text-[#022018] group-hover:text-[#064e3b]"
                      }`}
                    >
                      {d.topic}
                    </p>
                  </div>

                  {/* Footer Row: Hours & Note */}
                  <div className="flex items-center justify-between text-[10px] font-mono pt-0.5 border-t border-emerald-900/10 w-full">
                    <span
                      className={`flex items-center gap-1 ${
                        isSelected ? "text-emerald-100" : "text-[#022018] font-bold"
                      }`}
                    >
                      <Clock className="w-3 h-3 text-[#064e3b]" />
                      <span>{d.plannedHours || 6}h</span>
                    </span>

                    {dayNote ? (
                      <span
                        className={`flex items-center gap-0.5 font-sans font-black px-1.5 py-0.2 rounded text-[8.5px] ${
                          isSelected
                            ? "bg-amber-400/30 text-amber-100 border border-amber-300/40"
                            : "bg-amber-100 text-amber-950 border border-amber-300"
                        }`}
                      >
                        📝 Note
                      </span>
                    ) : (
                      <span className={`text-[8.5px] font-bold ${isSelected ? "text-emerald-100/70" : "text-slate-500"}`}>
                        {d.tasks ? `${d.tasks.filter((t) => t.completed).length}/${d.tasks.length}` : ""}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </GlassSurface>

      {/* 2. EXECUTION RISK STATUS BAR (Liquid Glass) */}
      <GlassSurface
        borderRadius={24}
        className="scroll-mt-6 p-4 sm:p-5 shadow-lg border border-white/95"
      >
        <div
          ref={dayDetailsRef}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`p-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-sm ${
                riskAssessment.status === "ON_TRACK"
                  ? "bg-gradient-to-r from-[#022c22] to-[#064e3b] text-[#fef9c3] border border-[#d4af37]/70"
                  : riskAssessment.status === "SLIGHTLY_BEHIND"
                  ? "bg-blue-700 text-white"
                  : riskAssessment.status === "AT_RISK"
                  ? "bg-amber-600 text-white"
                  : "bg-rose-600 text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{riskAssessment.badgeLabel}</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-[#011c15]">
                {riskAssessment.headline}
              </h4>
              <p className="text-xs text-slate-800 font-bold mt-0.5 leading-relaxed">
                {riskAssessment.details}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenWeeklyReview}
            className="metallic-shining-gold-btn flex items-center gap-2 px-4 py-2 rounded-2xl text-[#011c15] text-xs font-black whitespace-nowrap self-start sm:self-auto transition-all shadow-xs cursor-pointer hover:scale-102"
          >
            <BarChart3 className="w-4 h-4 text-[#011c15]" />
            <span>Weekly Review</span>
          </button>
        </div>
      </GlassSurface>

      {/* 3. TODAY'S PRIMARY MISSION HERO (Day Command Dashboard) */}
      <GlassSurface
        borderRadius={32}
        className="relative overflow-hidden w-full p-6 sm:p-9 shadow-2xl space-y-6 border border-white/95"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-amber-400/25 via-[#022c22]/20 to-transparent rounded-full pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black metallic-dark-green-btn text-[#fef9c3] shadow-md border-amber-400/80 font-mono">
                DAY {currentDay.dayNumber} / 90
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black luxury-glass-card text-[#022c22] border border-[#064e3b]/30">
                MONTH {currentDay.month} — {currentDay.monthName.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-800 font-black">
                {formatDate(currentDay.date)}
              </span>

              {/* Real-Time Postpone Date Action */}
              <button
                type="button"
                onClick={() => handleOpenPostpone(currentDay)}
                className="ml-auto sm:ml-2 px-3.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer hover:scale-105"
                title="Postpone this date or rebalance 90-day timetable"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-amber-700" />
                <span>Postpone Date</span>
              </button>
            </div>

            <div>
              <span className="text-xs font-black text-[#064e3b] tracking-wider uppercase block font-mono">
                Primary Goal: {currentDay.subject}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#022018] tracking-tight mt-1">
                {currentDay.topic}
              </h2>
            </div>

            {/* Subtopics pill cloud */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {currentDay.subtopics.map((sub, i) => (
                <span
                  key={i}
                  className="text-xs font-black luxury-glass-card text-[#022018] px-3 py-1 rounded-xl border border-white/90 shadow-2xs"
                >
                  {sub}
                </span>
              ))}
            </div>

            {/* Quick Action Launchers (Lecture + PYQs + Exact Topic MCQs) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={taskResources.primary.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black metallic-dark-green-btn cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{taskResources.primary.actionLabel || "Watch exact lecture ▶"}</span>
              </a>
              <a
                href={taskResources.pyq.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black metallic-shining-gold-btn text-[#022018] cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open exact topic PYQs ↗</span>
              </a>
              <a
                href={taskResources.topicMcq.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black metallic-dark-green-btn cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Solve Exact Topic MCQs ↗</span>
              </a>
            </div>
          </div>

          {/* Quick Progress Badge */}
          <div className="luxury-glass-card rounded-3xl p-6 text-center shrink-0 w-full sm:w-56 shadow-md border border-white/90">
            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block mb-1 font-mono">
              Today&apos;s Execution
            </span>
            <div className="text-4xl font-black text-[#022018] font-mono tracking-tight">
              {progressPercent}%
            </div>
            <span className="text-xs font-black text-[#064e3b] block mt-1.5 font-mono">
              {completedTasks} of {totalTasks} Tasks Done
            </span>
          </div>
        </div>
      </GlassSurface>

      {/* 3.5 DAY PERSONAL NOTES & FORMULAS (Liquid Glass Surface) */}
      <GlassSurface
        borderRadius={28}
        className="p-5 sm:p-7 shadow-xl border border-white/95 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/10 pb-3.5">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#022c22] text-[#fef9c3] border border-[#d4af37]/80 shadow-md">
              <FileText className="w-5 h-5 text-[#fef9c3]" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#011c15] flex items-center gap-2">
                <span>Personal Day {currentDay.dayNumber} Notes & Formulas</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#022c22] font-black border border-emerald-300">
                  Auto-saved
                </span>
              </h3>
              <p className="text-xs text-slate-800 font-bold mt-0.5">
                Record key traps, shortcuts, and formulas for {currentDay.topic}. This note displays on your 90-day timetable.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {["⚡ Key Trap", "📐 Formula", "🎯 Revision Goal"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  const existing = dayNotes[currentDay.dayNumber] || "";
                  const updated = existing ? `${existing}\n• ${preset}: ` : `• ${preset}: `;
                  handleUpdateDayNote(currentDay.dayNumber, updated);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#011c15] border border-amber-300/80 text-xs font-black transition-all shadow-2xs cursor-pointer hover:scale-102"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={dayNotes[currentDay.dayNumber] || ""}
          onChange={(e) => handleUpdateDayNote(currentDay.dayNumber, e.target.value)}
          placeholder={`Add your key formulas, traps, edge cases, or revision anchors for Day ${currentDay.dayNumber} (${currentDay.topic})...`}
          className="w-full bg-white/90 border border-emerald-900/20 rounded-2xl p-4 text-xs font-bold text-[#011c15] placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner font-sans resize-y"
        />
      </GlassSurface>

      {/* 3.8 REAL-TIME CONTINUOUS AI GUIDANCE DIRECTOR */}
      {realtimeGuidance && (
        <div className="p-5 rounded-3xl bg-white border border-emerald-300 shadow-md space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#064e3b] text-[#fef9c3] border border-amber-400/80 flex items-center justify-center shadow-xs shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-[#064e3b] uppercase tracking-wider">
                    Continuous AI Guidance • Day {currentDay.dayNumber}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                  {realtimeGuidance.headline}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenPostpone(currentDay)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer hover:scale-102"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-amber-700" />
                <span>Postpone This Date</span>
              </button>
              <Link
                href={`/ai?day=${currentDay.dayNumber}&subject=${encodeURIComponent(currentDay.subject)}&topic=${encodeURIComponent(currentDay.topic)}`}
                className="px-3.5 py-1.5 rounded-xl bg-[#064e3b] hover:bg-[#04382c] text-[#fef9c3] border border-amber-400/80 text-xs font-black transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 hover:scale-102"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Deep Ask Coach</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
              <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider block font-mono">
                Immediate Actionable Instruction:
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {realtimeGuidance.actionText}
              </p>
              {realtimeGuidance.nextTask && (
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-950 text-[10px] font-bold">
                    Target: {realtimeGuidance.nextTask.title} ({realtimeGuidance.nextTask.estMinutes}m)
                  </span>
                  {realtimeGuidance.nextTask.resourceUrl && (
                    <a
                      href={realtimeGuidance.nextTask.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#064e3b] hover:underline font-black flex items-center gap-1 text-[11px]"
                    >
                      <span>Open Verified Resource ↗</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-300 space-y-1.5">
              <span className="text-[11px] font-black text-amber-950 uppercase tracking-wider block font-mono flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>High-Risk Exam Trap Warning:</span>
              </span>
              <p className="text-amber-950 font-medium leading-relaxed">
                {realtimeGuidance.examTrap}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. AI FAST COMMAND BUTTONS */}
      <GlassSurface
        borderRadius={24}
        className="p-4 sm:p-5 shadow-lg border border-white/95 space-y-3"
      >
        <span className="text-[11px] font-black text-[#022c22] uppercase tracking-wider block font-mono">
          ⚡ One-Click AI Coach Directives
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { label: "What should I do now?", query: "What should I do right now?" },
            { label: "I have 2 hours", query: "I only have 2 hours today." },
            { label: "I have 8 hours", query: "I have 8 hours available today." },
            { label: "I missed yesterday", query: "I missed yesterday. Give me a recovery plan." },
            { label: "Give me a 10-year PYQ", query: `Give me an official GATE question on ${currentDay.topic}` },
            { label: "I finished early", query: "I finished early today." },
            { label: "Why did you change this?", query: "Why did you change my schedule?" },
            { label: "Where are topic MCQs?", query: `Where can I practice MCQs on ${currentDay.topic}?` },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={() => {
                setQuickQuestion(btn.query);
                handleAskCoach(btn.query);
              }}
              className="luxury-glass-card px-4 py-2 rounded-xl text-[#011c15] font-black hover:text-[#022c22] hover:border-amber-400 whitespace-nowrap transition-all shadow-2xs hover:scale-[1.02] cursor-pointer border border-white/90"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </GlassSurface>


      {/* 5. SCHEDULE CHANGE PROPOSAL CARD */}
      {activeProposal && !activeProposal.applied && (
        <div className="p-6 rounded-3xl bg-white/95 border-2 border-emerald-400 shadow-[0_12px_40px_rgba(5,150,105,0.08)] ring-1 ring-emerald-500/20 space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100/80 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs">
                Reason: {activeProposal.reasonCode}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                Adaptive Schedule Proposal ({activeProposal.availableHours} Hours Available)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyProposal}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Apply Change ✓
              </button>
              <button
                onClick={handleUndoProposal}
                className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 transition-all shadow-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {activeProposal.reasonExplanation}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80">
              <span className="text-[10px] text-slate-500 font-semibold block font-mono">BEFORE (Original)</span>
              <strong className="text-slate-800 text-sm font-mono mt-0.5 block">
                {activeProposal.beforeWorkloadMinutes} Minutes
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-300/80">
              <span className="text-[10px] text-emerald-800 font-semibold block font-mono">AFTER (Proposed)</span>
              <strong className="text-emerald-950 text-sm font-mono mt-0.5 block">
                {activeProposal.afterWorkloadMinutes} Minutes
              </strong>
            </div>
          </div>

          {activeProposal.deferredTasks.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5 text-xs">
              <span className="text-amber-900 font-bold text-[11px] block font-mono">
                Deferred / Rescheduled Tasks:
              </span>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                {activeProposal.deferredTasks.map((def, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>• {def.title} ({def.originalMinutes}m)</span>
                    <span className="italic text-slate-500">{def.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 6. LIVE STUDY SESSION CONTROLLER & TIMER */}
      <GlassSurface
        borderRadius={28}
        className="p-5 sm:p-7 shadow-xl space-y-4 border border-white/95"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/10 pb-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#022c22] block font-mono">
              Active Focus Controller
            </span>
            <h3 className="text-sm sm:text-base font-black text-[#011c15] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#064e3b]" />
              {activeSessionTaskId
                ? displayedTasks.find((t) => t.id === activeSessionTaskId)?.title || "Active Focus Block"
                : "Select a Task to Begin Session"}
            </h3>
          </div>

          {/* Live Timer Display */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#022c22] tracking-wider bg-white/70 px-5 py-2 rounded-2xl border border-emerald-900/20 shadow-inner">
              {formatTimer(sessionTimerSecs)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-3 rounded-2xl font-black text-white transition-all shadow-md cursor-pointer hover:scale-105 ${
                isTimerRunning
                  ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
                  : "metallic-dark-green-btn text-[#fef9c3] border-amber-400/80 shadow-md"
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFinishedEarly}
              className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#011c15] border border-emerald-300 font-black transition-all shadow-2xs cursor-pointer hover:scale-102"
            >
              ⚡ I finished early
            </button>
            <button
              onClick={handlePartialFinish}
              className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-800 border border-slate-300 font-black transition-all shadow-2xs cursor-pointer hover:scale-102"
            >
              ⏳ Time up / partial finish
            </button>
          </div>

          {sessionFeedback && (
            <span className="text-xs font-black text-[#022c22] bg-emerald-100/90 px-3.5 py-1.5 rounded-xl border border-emerald-300 animate-in fade-in duration-200">
              {sessionFeedback}
            </span>
          )}
        </div>
      </GlassSurface>

      {/* 7. AVAILABLE HOURS ADJUSTMENT CONTROLS */}
      <GlassSurface
        borderRadius={24}
        className="p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/95"
      >
        <div>
          <h4 className="text-xs sm:text-sm font-black text-[#011c15] flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#064e3b]" /> Adjust Available Study Hours Today
          </h4>
          <p className="text-xs text-slate-800 font-bold mt-0.5">
            Select your hours to dynamically compress or expand tasks without breaking the master 90-day timetable.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1.5 bg-white/70 rounded-2xl border border-white/90 self-start sm:self-auto shadow-2xs">
          {[2, 3, 4, 6, 8].map((hrs) => (
            <button
              key={hrs}
              onClick={() => handleSelectAvailableHours(hrs)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
                availableHours === hrs
                  ? "metallic-dark-green-btn text-[#fef9c3] shadow-md border-amber-400/80 scale-105"
                  : "text-[#011c15] hover:text-[#064e3b] hover:bg-white"
              }`}
            >
              {hrs}h
            </button>
          ))}
        </div>
      </GlassSurface>

      {/* 8. DAILY AI BRIEFING */}
      <GlassSurface
        borderRadius={28}
        className="p-6 sm:p-8 shadow-xl border border-white/95 space-y-5"
      >
        <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3.5">
          <h3 className="text-sm sm:text-base font-black text-[#011c15] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" /> Daily AI Study Coach Briefing
          </h3>
          <span className="text-[11px] font-mono text-[#022c22] bg-[#fef9c3] px-3 py-1 rounded-full border border-[#d4af37]/80 font-black shadow-2xs">
            Groq Reasoning Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-[13px]">
          <div className="space-y-3.5">
            <div>
              <strong className="text-[#064e3b] uppercase text-[10px] tracking-wider block font-black font-mono">
                Today&apos;s Mission:
              </strong>
              <p className="text-[#011c15] mt-1 leading-relaxed font-black">
                {currentDay.briefing?.mission || "Master today's topic and solve assigned GATE questions."}
              </p>
            </div>

            <div>
              <strong className="text-[#064e3b] uppercase text-[10px] tracking-wider block font-black font-mono">
                Why It Matters in GATE:
              </strong>
              <p className="text-slate-800 mt-1 leading-relaxed font-bold">
                {currentDay.briefing?.whyItMatters}
              </p>
            </div>

            <div>
              <strong className="text-[#064e3b] uppercase text-[10px] tracking-wider block font-black font-mono">
                Required Prerequisite:
              </strong>
              <p className="text-slate-700 mt-1 font-bold">
                {currentDay.briefing?.prerequisites}
              </p>
            </div>
          </div>

          <div className="space-y-3.5 border-t md:border-t-0 md:border-l border-emerald-900/10 pt-3.5 md:pt-0 md:pl-5">
            <div>
              <strong className="text-teal-900 uppercase text-[10px] tracking-wider block font-black font-mono">
                What Exactly to Study:
              </strong>
              <p className="text-slate-900 mt-1 leading-relaxed font-bold">
                {currentDay.briefing?.whatToStudy}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 shadow-2xs">
              <strong className="text-amber-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5 font-black font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> What NOT to Study Today:
              </strong>
              <p className="mt-1 leading-relaxed text-xs font-bold">
                {currentDay.briefing?.whatNotToStudy}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 shadow-2xs">
              <strong className="text-emerald-900 uppercase text-[10px] tracking-wider block font-black font-mono">
                Today&apos;s Success Condition:
              </strong>
              <p className="mt-1 leading-relaxed text-xs font-bold">
                {currentDay.briefing?.successCondition}
              </p>
            </div>
          </div>
        </div>
      </GlassSurface>

      {/* 9. TODAY'S TASK SEQUENCE */}
      <GlassSurface
        borderRadius={28}
        className="p-6 sm:p-8 shadow-xl border border-white/95 space-y-5"
      >
        <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3.5">
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#011c15] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#064e3b]" /> Today&apos;s Task Sequence
            </h3>
            <p className="text-xs text-slate-800 font-bold mt-0.5">
              {availableHours <= 3
                ? `Compressed mode: Showing ${displayedTasks.length} essential tasks for ${availableHours} hours.`
                : "Check off each task as you complete it. Click task to set as active session."}
            </p>
          </div>
          <span className="text-xs font-mono font-black text-[#022c22] bg-[#fef9c3] px-3 py-1 rounded-xl border border-[#d4af37]/80">
            {completedTasks} / {totalTasks} Done
          </span>
        </div>

        <div className="space-y-3">
          {displayedTasks.map((task, idx) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
                task.completed
                  ? "bg-white/40 border-emerald-200/70 text-slate-600"
                  : activeSessionTaskId === task.id
                  ? "luxury-glass-emerald border-emerald-500 ring-2 ring-amber-400 text-[#011c15] shadow-sm"
                  : "liquid-glass-lens hover:border-amber-400"
              }`}
            >
              <div className="flex items-start gap-3.5 cursor-pointer select-none flex-1">
                <div
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-6 h-6 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border ${
                    task.completed
                      ? "metallic-dark-green-btn text-[#fef9c3] border-amber-400/80"
                      : "luxury-glass-card border-white/90 text-[#011c15] hover:border-emerald-500 shadow-2xs"
                  }`}
                >
                  {task.completed ? "✓" : idx + 1}
                </div>
                <div onClick={() => setActiveSessionTaskId(task.id)} className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs sm:text-sm font-black text-[#011c15] ${task.completed ? "line-through opacity-60" : ""}`}>
                      {task.title}
                    </span>
                    {task.targetCount && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#fef9c3] text-[#451a03] border border-[#d4af37]/80 font-mono">
                        {task.targetCount} Questions
                      </span>
                    )}
                    {activeSessionTaskId === task.id && !task.completed && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-[#022c22] border border-emerald-300 font-mono">
                        Active Timer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-800 font-mono font-bold mt-0.5 block">
                    Estimated: {task.estMinutes} Minutes
                  </span>
                </div>
              </div>

              {task.resourceUrl && (
                <a
                  href={task.resourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/90 hover:bg-emerald-50 text-[#022c22] hover:text-[#064e3b] border border-emerald-300 text-xs font-black whitespace-nowrap transition-all shrink-0 self-start sm:self-auto shadow-2xs cursor-pointer hover:scale-102"
                >
                  <span>Open {task.provider || "Resource"}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#064e3b]" />
                </a>
              )}
            </div>
          ))}
        </div>
      </GlassSurface>

      {/* 10. TODAY'S EXACT TOPIC RESOURCES */}
      <GlassSurface
        borderRadius={28}
        className="p-6 sm:p-8 shadow-xl border border-white/95 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/10 pb-3.5">
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#011c15] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#064e3b]" /> Today&apos;s Exact Curated Resources ({currentDay.topic})
            </h3>
            <p className="text-xs text-slate-800 font-bold mt-0.5">
              Day-level, topic-level verified locators for syllabus lectures, official GATE PYQs, and exact topic MCQs.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#022c22] bg-[#fef9c3] px-3 py-1 rounded-full border border-[#d4af37]/80 font-black self-start sm:self-auto shadow-2xs">
            {taskResources.isDirect ? "✓ Verified Direct Video" : "✓ Verified Topic Roadmap"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-[13px]">
          {/* Exact Video Card */}
          <div className="p-6 rounded-3xl liquid-glass-lens border border-white/90 flex flex-col justify-between space-y-4 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-[#022c22] border border-emerald-300 font-mono">
                  Gate Smashers
                </span>
                <span className="text-[10px] font-mono text-slate-700 uppercase font-black">
                  {taskResources.isDirect ? "Direct Lecture" : "Topic Locator"}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-[#011c15] leading-snug">
                {taskResources.primary.title}
              </h4>
              <p className="text-xs text-slate-800 font-bold mt-1">
                {taskResources.isDirect
                  ? "Direct verified YouTube lecture mapped specifically to today's topic."
                  : "Gate Smashers syllabus roadmap with exact YouTube search query fallback."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-emerald-900/10">
              <a
                href={taskResources.primary.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black metallic-dark-green-btn cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{taskResources.primary.actionLabel || "Watch exact lecture ▶"}</span>
              </a>
              <a
                href={taskResources.backup.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-white/80 hover:bg-white text-[#011c15] text-xs font-black border border-white/90 transition-all shadow-2xs cursor-pointer"
              >
                <span>Backup roadmap ↗</span>
              </a>
            </div>
          </div>

          {/* Exact Topic PYQ & MCQ Card */}
          <div className="p-6 rounded-3xl luxury-glass-gold border border-amber-400/80 flex flex-col justify-between space-y-4 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-[#451a03] border border-amber-300 font-mono">
                  GATEOverflow & MCQs
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/80 text-[#011c15] border border-amber-300/70 font-mono">
                  {currentDay.pyqResource?.target || 15} PYQs Target
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-[#3b1702] leading-snug">
                {taskResources.pyq.title}
              </h4>
              <p className="text-xs text-[#451a03] font-bold mt-1">
                Curated official GATE questions with full peer solutions, and verified exact topic MCQs below.
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-amber-300/80">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={taskResources.pyq.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl metallic-shining-gold-btn text-[#011c15] text-xs font-black shadow-md cursor-pointer hover:scale-102"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open exact topic PYQs ↗</span>
                </a>
                <a
                  href={taskResources.official.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-white/80 hover:bg-white text-[#011c15] text-xs font-black border border-white/90 transition-all shadow-2xs cursor-pointer"
                >
                  <span>IIT paper ↗</span>
                </a>
              </div>

              {/* Exact Topic MCQs link directly below the GATEOverflow link */}
              <a
                href={taskResources.topicMcq.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl metallic-dark-green-btn text-xs font-black cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{taskResources.topicMcq.actionLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </GlassSurface>

      {/* 11. ASK YOUR STUDY COACH NATURAL LANGUAGE BOX */}
      <GlassSurface
        borderRadius={28}
        className="p-6 sm:p-8 shadow-xl border border-white/95 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-emerald-900/10 pb-2.5">
          <h3 className="text-sm sm:text-base font-black text-[#011c15] flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#064e3b]" /> Ask Your AI Study Coach
          </h3>
          <span className="text-xs text-slate-800 font-mono font-bold">Natural Language Planner & 10-Yr Official Archive</span>
        </div>

        {/* Query Input */}
        <div className="flex items-center gap-2.5">
          <input
            type="text"
            placeholder="e.g. 'I have only 3 hours', 'Give me a 10-year PYQ on pointers', 'I missed yesterday'..."
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAskCoach();
              }
            }}
            className="flex-1 bg-white/95 border border-slate-300 rounded-2xl px-5 py-3 text-xs sm:text-sm text-[#011c15] placeholder:text-slate-500 font-bold focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/30 shadow-inner font-sans"
          />
          <button
            onClick={() => handleAskCoach()}
            disabled={!quickQuestion.trim() || coachLoading}
            className="p-3.5 rounded-2xl metallic-dark-green-btn text-[#fef9c3] disabled:opacity-50 shadow-md border-amber-400/80 transition-all cursor-pointer hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Coach Answer Display */}
        {coachLoading && (
          <div className="p-4 rounded-2xl bg-white/80 text-xs text-[#022c22] font-black flex items-center gap-2.5 animate-pulse border border-emerald-300 shadow-2xs">
            <Bot className="w-4 h-4 text-[#064e3b]" />
            <span>AI Coach is computing the optimal study decision...</span>
          </div>
        )}

        {coachAnswer && (
          <div className="bg-white/90 rounded-2xl p-6 border border-emerald-900/20 text-xs sm:text-sm text-[#011c15] leading-relaxed font-sans font-bold space-y-2 whitespace-pre-wrap shadow-inner">
            {coachAnswer}
          </div>
        )}
      </GlassSurface>

      {/* 12. 90-DAY OVERALL PROGRESS BAR */}
      <GlassSurface
        borderRadius={24}
        className="p-5 sm:p-6 shadow-xl border border-white/95 space-y-3"
      >
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-black text-[#011c15] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#064e3b]" /> 90-Day Master Timetable Progress
          </span>
          <span className="font-mono text-[#022c22] font-black bg-[#fef9c3] px-3 py-0.5 rounded-full border border-[#d4af37]/80">
            {overall90DayPercent}% ({totalCompletedDays} of 90 Days Completed)
          </span>
        </div>
        <div className="w-full bg-slate-200/80 h-3.5 rounded-full overflow-hidden border border-emerald-900/10 p-0.5">
          <div
            className="bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#d4af37] h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${Math.max(overall90DayPercent, 2)}%` }}
          />
        </div>
      </GlassSurface>

      {/* 13. WEEKLY REVIEW MODAL */}
      {weeklyReviewOpen && weeklyReviewData && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="luxury-glass rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-[0_25px_60px_-15px_rgba(5,150,105,0.25)] border border-white/95 animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="flex items-center justify-between border-b border-emerald-100/70 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" /> Weekly GATE Review: Week {weeklyReviewData.weekNumber}
                </h3>
                <p className="text-xs text-slate-500">Diagnostic performance analysis generated by Study Engine.</p>
              </div>
              <button
                onClick={() => setWeeklyReviewOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80">
                <span className="text-slate-500 text-[10px] block font-medium font-mono">Study Time Completed</span>
                <strong className="text-slate-900 text-sm font-mono mt-0.5 block">
                  {weeklyReviewData.completedHours}h / {weeklyReviewData.plannedHours}h ({weeklyReviewData.completionPercent}%)
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80">
                <span className="text-slate-500 text-[10px] block font-medium font-mono">PYQ Accuracy Rate</span>
                <strong className="text-emerald-700 text-sm font-mono mt-0.5 block">
                  {weeklyReviewData.pyqAccuracyPercent}%
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80">
                <span className="text-slate-500 text-[10px] block font-medium font-mono">Strongest Subject</span>
                <strong className="text-emerald-800 text-xs mt-0.5 block">
                  {weeklyReviewData.bestSubject}
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80">
                <span className="text-slate-500 text-[10px] block font-medium font-mono">Weakest Area</span>
                <strong className="text-amber-700 text-xs mt-0.5 block">
                  {weeklyReviewData.weakestSubject}
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1 text-xs">
              <strong className="text-emerald-900 block font-semibold font-mono">Behavioral Pattern Insight:</strong>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {weeklyReviewData.behavioralInsight}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <strong className="text-slate-900 block font-semibold font-mono">Next Week AI Adjustments:</strong>
              <ul className="space-y-1.5 text-slate-700 text-[11px]">
                {weeklyReviewData.nextWeekAdjustments.map((adj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <span>{adj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-emerald-100/70 flex justify-end">
              <button
                onClick={() => setWeeklyReviewOpen(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Date Postponement Modal */}
      {targetPostponeDay && (
        <PostponeModal
          isOpen={isPostponeModalOpen}
          onClose={() => setIsPostponeModalOpen(false)}
          day={targetPostponeDay}
          allDays={allDays}
          onScheduleUpdated={handlePostponeScheduleUpdated}
        />
      )}
    </div>
  );
}

export default function TodayCommandCenterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh] text-xs text-emerald-600 font-semibold font-mono">
          Loading 90-day timetable...
        </div>
      }
    >
      <TodayCommandCenterContent />
    </Suspense>
  );
}
