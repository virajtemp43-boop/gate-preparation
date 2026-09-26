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
  Grid,
  SlidersHorizontal,
  Flame,
} from "lucide-react";
import { getCurrentPlanDay, getPlanDays, getResources } from "@/lib/data";
import { StudyDay, DailyTask } from "@/lib/types";
import { formatDate } from "@/lib/utils";
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

  // Calendar Navigator State
  const [activePhaseTab, setActivePhaseTab] = useState<1 | 2 | 3>(1);
  const [calendarViewMode, setCalendarViewMode] = useState<"slider" | "grid">("slider");
  const calendarSliderRef = useRef<HTMLDivElement>(null);

  // Layer 1 Decision Engine State
  const [activeProposal, setActiveProposal] = useState<ScheduleProposal | null>(null);
  const [originalTasksBackup, setOriginalTasksBackup] = useState<DailyTask[] | null>(null);
  const [weeklyReviewOpen, setWeeklyReviewOpen] = useState(false);
  const [weeklyReviewData, setWeeklyReviewData] = useState<WeeklyDiagnosticReview | null>(null);

  // Live Study Session Controller (Section 35)
  const [activeSessionTaskId, setActiveSessionTaskId] = useState<string | null>(null);
  const [sessionTimerSecs, setSessionTimerSecs] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [sessionFeedback, setSessionFeedback] = useState<string | null>(null);

  useEffect(() => {
    const days = getPlanDays();
    setAllDays(days);

    const planInfo = getCurrentPlanDay();
    setIsPreLaunch(planInfo.isPreLaunch);
    setDaysUntilLaunch(planInfo.daysUntilLaunch);

    let day = planInfo.activeDay || days[0];

    // Read stored user progress from localStorage
    try {
      const saved = localStorage.getItem("gate_study_days");
      if (saved) {
        const parsed: StudyDay[] = JSON.parse(saved);
        setAllDays(parsed);

        // If dayParam is present in URL, select that specific day
        if (dayParam) {
          const targetDayNum = parseInt(dayParam, 10);
          const matched = parsed.find((d) => d.dayNumber === targetDayNum);
          if (matched) {
            day = matched;
          }
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
    } catch (e) {
      console.warn("Could not read localStorage", e);
    }

    setCurrentDay(day);
    setActivePhaseTab(day.month as (1 | 2 | 3));
    if (day?.tasks && day.tasks.length > 0) {
      setActiveSessionTaskId(day.tasks[0]?.id || null);
    }
  }, [dayParam]);

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

  if (!currentDay) return null;

  // Evaluate Current Preparation Risk State (Section 39)
  const riskAssessment = evaluateExecutionRisk(allDays, currentDay.dayNumber);

  // Task Resources Resolver (Section 42 & 43: Exact Topic Resolution)
  const taskResources = resolveTaskResources(currentDay.subject, currentDay.topic, currentDay.dayNumber);

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
  };

  const handleScrollCalendar = (direction: "left" | "right") => {
    if (!calendarSliderRef.current) return;
    const scrollAmount = 350;
    calendarSliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
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

    // Generate deterministic schedule proposal
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

    const updatedAllDays = allDays.map((d) =>
      d.dayNumber === currentDay.dayNumber ? updatedDay : d
    );
    setAllDays(updatedAllDays);
    localStorage.setItem("gate_study_days", JSON.stringify(updatedAllDays));

    setActiveProposal((prev) => (prev ? { ...prev, applied: true } : null));
    setSessionFeedback(`Applied ${activeProposal.availableHours}-hour plan. High-yield tasks protected!`);
    setTimeout(() => setSessionFeedback(null), 5000);
  };

  const handleUndoProposal = () => {
    if (!originalTasksBackup || !currentDay) return;
    const restoredDay = { ...currentDay, tasks: originalTasksBackup };
    setCurrentDay(restoredDay);

    const updatedAllDays = allDays.map((d) =>
      d.dayNumber === currentDay.dayNumber ? restoredDay : d
    );
    setAllDays(updatedAllDays);
    localStorage.setItem("gate_study_days", JSON.stringify(updatedAllDays));

    setActiveProposal(null);
    setOriginalTasksBackup(null);
    setSessionFeedback("Restored baseline 90-day master timetable.");
    setTimeout(() => setSessionFeedback(null), 4000);
  };

  // Study Session Controls
  const handleFinishedEarly = () => {
    setIsTimerRunning(false);
    const activeTask = currentDay.tasks.find((t) => t.id === activeSessionTaskId);
    const elapsedMinutes = Math.max(1, Math.round(sessionTimerSecs / 60));
    const plannedMinutes = activeTask?.estMinutes || 60;
    const saved = Math.max(5, plannedMinutes - elapsedMinutes);

    const earlyResult = handleEarlyCompletion(saved, currentDay.topic);
    setSessionFeedback(`⚡ ${earlyResult.recommendation}`);

    if (activeSessionTaskId) {
      handleToggleTask(activeSessionTaskId);
    }
    setSessionTimerSecs(0);
  };

  const handlePartialFinish = () => {
    setIsTimerRunning(false);
    const activeTask = currentDay.tasks.find((t) => t.id === activeSessionTaskId);
    const elapsedMinutes = Math.max(1, Math.round(sessionTimerSecs / 60));
    const plannedMinutes = activeTask?.estMinutes || 60;

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
      label: "Month 1",
      title: "Foundation & Mathematics",
      dates: "01 Oct – 30 Oct 2026",
      range: "Days 1–30",
    },
    {
      id: 2 as const,
      label: "Month 2",
      title: "Core Systems & Architecture",
      dates: "31 Oct – 29 Nov 2026",
      range: "Days 31–60",
    },
    {
      id: 3 as const,
      label: "Month 3",
      title: "Networks, TOC & Revision",
      dates: "30 Nov – 29 Dec 2026",
      range: "Days 61–90",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* 0. INTERACTIVE 90-DAY CALENDAR NAVIGATOR (Premium Top Bar) */}
      <div className="relative overflow-hidden bg-slate-900/95 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        {/* Subtle Radiant Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <CalendarIcon className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                90-Day Master Timetable Navigator
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Click any day to instantly open that day&apos;s full command center and verified resources.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setCalendarViewMode("slider")}
                className={`p-1.5 rounded-lg transition-all ${
                  calendarViewMode === "slider"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Slider View"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCalendarViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  calendarViewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Slider Navigation Arrows */}
            {calendarViewMode === "slider" && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleScrollCalendar("left")}
                  className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScrollCalendar("right")}
                  className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Phase Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhaseTab(phase.id)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                activePhaseTab === phase.id
                  ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/30"
                  : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    activePhaseTab === phase.id ? "text-indigo-400" : "text-slate-400"
                  }`}
                >
                  {phase.range}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {phase.dates.slice(0, 6)}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1 truncate">
                {phase.title}
              </h4>
            </button>
          ))}
        </div>

        {/* Days Display (Slider or Grid) */}
        <div className="pt-4">
          {calendarViewMode === "slider" ? (
            <div
              ref={calendarSliderRef}
              className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
            >
              {phaseDays.map((d) => {
                const isSelected = d.dayNumber === currentDay.dayNumber;
                const isDone = d.tasks && d.tasks.length > 0 && d.tasks.every((t) => t.completed);
                const hasStarted = d.tasks && d.tasks.some((t) => t.completed);

                return (
                  <button
                    key={d.dayNumber}
                    onClick={() => handleSelectDay(d)}
                    className={`shrink-0 w-32 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-gradient-to-b from-indigo-900/90 to-slate-900 border-indigo-400 shadow-xl shadow-indigo-600/20 ring-2 ring-indigo-500/40"
                        : isDone
                        ? "bg-emerald-950/30 border-emerald-800/50 hover:border-emerald-700"
                        : "bg-slate-950/70 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-mono font-bold ${
                          isSelected ? "text-indigo-300" : "text-slate-400"
                        }`}
                      >
                        Day {d.dayNumber}
                      </span>
                      {isDone ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      ) : hasStarted ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDate(d.date).slice(0, 6)}
                        </span>
                      )}
                    </div>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800/80 text-indigo-300 border border-slate-700/60 truncate max-w-full mb-1">
                      {d.subject.slice(0, 14)}
                    </span>
                    <p className="text-[11px] font-medium text-slate-200 line-clamp-1 leading-snug">
                      {d.topic}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
              {phaseDays.map((d) => {
                const isSelected = d.dayNumber === currentDay.dayNumber;
                const isDone = d.tasks && d.tasks.length > 0 && d.tasks.every((t) => t.completed);

                return (
                  <button
                    key={d.dayNumber}
                    onClick={() => handleSelectDay(d)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-400 shadow-md font-bold"
                        : isDone
                        ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-300 hover:border-emerald-600"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-[11px] font-mono block">Day {d.dayNumber}</span>
                    <span className="text-[9px] text-slate-400 truncate block mt-0.5">
                      {d.subject.slice(0, 8)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 1. EXECUTION RISK STATUS BAR (Section 39) */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg ${
          riskAssessment.status === "ON_TRACK"
            ? "bg-slate-900/90 border-emerald-500/40"
            : riskAssessment.status === "SLIGHTLY_BEHIND"
            ? "bg-blue-950/30 border-blue-500/40"
            : riskAssessment.status === "AT_RISK"
            ? "bg-amber-950/30 border-amber-500/40"
            : "bg-rose-950/30 border-rose-500/40"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 ${
              riskAssessment.status === "ON_TRACK"
                ? "bg-emerald-500/20 text-emerald-400"
                : riskAssessment.status === "SLIGHTLY_BEHIND"
                ? "bg-blue-500/20 text-blue-400"
                : riskAssessment.status === "AT_RISK"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-rose-500/20 text-rose-400"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{riskAssessment.badgeLabel}</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              {riskAssessment.headline}
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              {riskAssessment.details}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenWeeklyReview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 whitespace-nowrap self-start sm:self-auto transition-all"
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Weekly Review</span>
        </button>
      </div>

      {/* 2. TODAY'S PRIMARY MISSION HERO (Section 3 & 5) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                DAY {currentDay.dayNumber} / 90
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                MONTH {currentDay.month} — {currentDay.monthName.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {formatDate(currentDay.date)}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase block">
                Primary Goal: {currentDay.subject}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                {currentDay.topic}
              </h1>
            </div>

            {/* Subtopics pill cloud */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {currentDay.subtopics.map((sub, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700/60"
                >
                  {sub}
                </span>
              ))}
            </div>

            {/* Quick Action Launchers (Lecture + PYQs + Exact Topic MCQs) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={taskResources.primary.url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  taskResources.isDirect
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{taskResources.primary.actionLabel || "Watch exact lecture ▶"}</span>
              </a>
              <a
                href={taskResources.pyq.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open exact topic PYQs ↗</span>
              </a>
              <a
                href={taskResources.topicMcq.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/30"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solve Exact Topic MCQs ↗</span>
              </a>
            </div>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center shrink-0 w-full sm:w-52 shadow-inner">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Today&apos;s Execution
            </span>
            <div className="text-4xl font-extrabold text-white font-mono">
              {progressPercent}%
            </div>
            <span className="text-xs font-semibold text-emerald-400 block mt-1">
              {completedTasks} of {totalTasks} Tasks Done
            </span>
          </div>
        </div>
      </div>

      {/* 3. AI FAST COMMAND BUTTONS (Section 34) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
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
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-indigo-950/50 hover:border-indigo-500/50 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-all shadow-sm"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. SCHEDULE CHANGE PROPOSAL CARD (Section 4 & 56: Before vs After) */}
      {activeProposal && !activeProposal.applied && (
        <div className="p-5 rounded-2xl bg-indigo-950/40 border-2 border-indigo-500 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500 text-white">
                Reason: {activeProposal.reasonCode}
              </span>
              <h3 className="text-sm font-bold text-white mt-1">
                Adaptive Schedule Proposal ({activeProposal.availableHours} Hours Available)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyProposal}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
              >
                Apply Change ✓
              </button>
              <button
                onClick={handleUndoProposal}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeProposal.reasonExplanation}
          </p>

          {/* Before vs After Workload Comparison */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">BEFORE (Original)</span>
              <strong className="text-slate-300 text-sm font-mono mt-0.5 block">
                {activeProposal.beforeWorkloadMinutes} Minutes
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/50">
              <span className="text-[10px] text-indigo-400 font-semibold block">AFTER (Proposed)</span>
              <strong className="text-emerald-400 text-sm font-mono mt-0.5 block">
                {activeProposal.afterWorkloadMinutes} Minutes
              </strong>
            </div>
          </div>

          {/* Deferred Tasks Notice */}
          {activeProposal.deferredTasks.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
              <span className="text-amber-400 font-bold text-[11px] block">
                Deferred / Rescheduled Tasks:
              </span>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                {activeProposal.deferredTasks.map((def, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>• {def.title} ({def.originalMinutes}m)</span>
                    <span className="italic text-slate-400">{def.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 5. LIVE STUDY SESSION CONTROLLER & TIMER (Section 35) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
              Active Focus Controller
            </span>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              {activeSessionTaskId
                ? displayedTasks.find((t) => t.id === activeSessionTaskId)?.title || "Active Focus Block"
                : "Select a Task to Begin Session"}
            </h3>
          </div>

          {/* Live Timer Display */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-2xl font-mono font-extrabold text-white tracking-wider bg-slate-950 px-3.5 py-1 rounded-xl border border-slate-800">
              {formatTimer(sessionTimerSecs)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-2.5 rounded-xl font-bold text-white transition-all shadow-md ${
                isTimerRunning
                  ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        </div>

        {/* Early & Partial Completion Handlers (Section 36 & 37) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFinishedEarly}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-semibold transition-all"
            >
              ⚡ I finished early
            </button>
            <button
              onClick={handlePartialFinish}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold transition-all"
            >
              ⏳ Time up / partial finish
            </button>
          </div>

          {sessionFeedback && (
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-800/40 animate-in fade-in duration-200">
              {sessionFeedback}
            </span>
          )}
        </div>
      </div>

      {/* 6. AVAILABLE HOURS ADJUSTMENT CONTROLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Adjust Available Study Hours Today
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Select your hours to dynamically compress or expand tasks without breaking the master 90-day plan.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          {[2, 3, 4, 6, 8].map((hrs) => (
            <button
              key={hrs}
              onClick={() => handleSelectAvailableHours(hrs)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                availableHours === hrs
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {hrs}h
            </button>
          ))}
        </div>
      </div>

      {/* 7. DAILY AI BRIEFING (Section 6) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Daily AI Study Coach Briefing
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            Groq Reasoning Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <div>
              <strong className="text-indigo-400 uppercase text-[10px] tracking-wider block">
                Today&apos;s Mission:
              </strong>
              <p className="text-slate-200 mt-0.5 leading-relaxed font-medium">
                {currentDay.briefing?.mission || "Master today's topic and solve assigned GATE questions."}
              </p>
            </div>

            <div>
              <strong className="text-indigo-400 uppercase text-[10px] tracking-wider block">
                Why It Matters in GATE:
              </strong>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                {currentDay.briefing?.whyItMatters}
              </p>
            </div>

            <div>
              <strong className="text-indigo-400 uppercase text-[10px] tracking-wider block">
                Required Prerequisite:
              </strong>
              <p className="text-slate-400 mt-0.5">
                {currentDay.briefing?.prerequisites}
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
            <div>
              <strong className="text-emerald-400 uppercase text-[10px] tracking-wider block">
                What Exactly to Study:
              </strong>
              <p className="text-slate-200 mt-0.5 leading-relaxed">
                {currentDay.briefing?.whatToStudy}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200">
              <strong className="text-amber-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> What NOT to Study Today:
              </strong>
              <p className="mt-1 leading-relaxed">
                {currentDay.briefing?.whatNotToStudy}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200">
              <strong className="text-emerald-400 uppercase text-[10px] tracking-wider block">
                Today&apos;s Success Condition:
              </strong>
              <p className="mt-1 leading-relaxed">
                {currentDay.briefing?.successCondition}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. TODAY'S TASK SEQUENCE & RESOURCE LAUNCHER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Today&apos;s Task Sequence
            </h3>
            <p className="text-xs text-slate-400">
              {availableHours <= 3
                ? `Compressed mode: Showing ${displayedTasks.length} essential tasks for ${availableHours} hours.`
                : "Check off each task as you complete it. Click task to set as active session."}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">
            {completedTasks} / {totalTasks}
          </span>
        </div>

        <div className="space-y-3">
          {displayedTasks.map((task, idx) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                task.completed
                  ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                  : activeSessionTaskId === task.id
                  ? "bg-indigo-950/30 border-indigo-500/60 ring-1 ring-indigo-500/40 text-white"
                  : "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700"
              }`}
            >
              {/* Left: Checkbox + Title */}
              <div className="flex items-start gap-3 cursor-pointer select-none flex-1">
                <div
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                    task.completed
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  {task.completed ? "✓" : idx + 1}
                </div>
                <div onClick={() => setActiveSessionTaskId(task.id)} className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold text-white ${task.completed ? "line-through opacity-75" : ""}`}>
                      {task.title}
                    </span>
                    {task.targetCount && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {task.targetCount} Questions
                      </span>
                    )}
                    {activeSessionTaskId === task.id && !task.completed && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active Timer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                    Estimated: {task.estMinutes} Minutes
                  </span>
                </div>
              </div>

              {/* Right: Direct External Resource Launcher Link */}
              {task.resourceUrl && (
                <a
                  href={task.resourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold whitespace-nowrap transition-all shrink-0 self-start sm:self-auto"
                >
                  <span>Open {task.provider || "Resource"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 9. TODAY'S EXACT TOPIC RESOURCES (Exact Resource Map & Resolver) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Today&apos;s Exact Curated Resources ({currentDay.topic})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Day-level, topic-level verified locators for syllabus lectures, official GATE PYQs, and topic MCQs.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40 self-start sm:self-auto">
            {taskResources.isDirect ? "✓ Verified Direct Video" : "✓ Verified Topic Roadmap"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Exact Video Card */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                  Gate Smashers
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {taskResources.isDirect ? "Direct Lecture" : "Topic Locator"}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">
                {taskResources.primary.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {taskResources.isDirect
                  ? "Direct verified YouTube lecture mapped specifically to today's topic."
                  : "Gate Smashers syllabus roadmap with exact YouTube search query fallback."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900">
              <a
                href={taskResources.primary.url}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                  taskResources.isDirect
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{taskResources.primary.actionLabel || "Watch exact lecture ▶"}</span>
              </a>
              <a
                href={taskResources.backup.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
              >
                <span>Backup / topic roadmap ↗</span>
              </a>
            </div>
          </div>

          {/* Exact Topic PYQ & MCQ Card */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-purple-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-600/30 text-purple-300 border border-purple-500/30">
                  GATEOverflow & MCQs
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {currentDay.pyqResource?.target || 15} PYQs Target
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">
                {taskResources.pyq.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Curated official GATE questions with full peer solutions, along with verified exact topic MCQs directly below.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-900">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={taskResources.pyq.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open exact topic PYQs ↗</span>
                </a>
                <a
                  href={taskResources.official.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
                >
                  <span>IIT GATE paper ↗</span>
                </a>
              </div>

              {/* Exact Topic MCQs link directly below the GATEOverflow link */}
              <a
                href={taskResources.topicMcq.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{taskResources.topicMcq.actionLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 10. ASK YOUR STUDY COACH NATURAL LANGUAGE BOX (Section 7 Standard) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" /> Ask Your AI Study Coach
          </h3>
          <span className="text-xs text-slate-400">Natural Language Planner & 10-Yr PYQ Archive</span>
        </div>

        {/* Query Input */}
        <div className="flex items-center gap-2">
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
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleAskCoach()}
            disabled={!quickQuestion.trim() || coachLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Coach Answer Display */}
        {coachLoading && (
          <div className="p-4 rounded-xl bg-slate-950 text-xs text-indigo-400 flex items-center gap-2 animate-pulse">
            <Bot className="w-4 h-4" />
            <span>AI Coach is computing the optimal study decision...</span>
          </div>
        )}

        {coachAnswer && (
          <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs text-slate-200 leading-relaxed font-sans space-y-2 whitespace-pre-wrap">
            {coachAnswer}
          </div>
        )}
      </div>

      {/* 11. 90-DAY OVERALL PROGRESS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" /> 90-Day Master Timetable Progress
          </span>
          <span className="font-mono text-indigo-400 font-bold">
            {overall90DayPercent}% ({totalCompletedDays} of 90 Days Completed)
          </span>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(overall90DayPercent, 2)}%` }}
          />
        </div>
      </div>

      {/* 12. WEEKLY REVIEW MODAL (Section 17) */}
      {weeklyReviewOpen && weeklyReviewData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" /> Weekly GATE Review: Week {weeklyReviewData.weekNumber}
                </h3>
                <p className="text-xs text-slate-400">Diagnostic performance analysis generated by Study Engine.</p>
              </div>
              <button
                onClick={() => setWeeklyReviewOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Study Time Completed</span>
                <strong className="text-white text-sm font-mono mt-0.5 block">
                  {weeklyReviewData.completedHours}h / {weeklyReviewData.plannedHours}h ({weeklyReviewData.completionPercent}%)
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">PYQ Accuracy Rate</span>
                <strong className="text-emerald-400 text-sm font-mono mt-0.5 block">
                  {weeklyReviewData.pyqAccuracyPercent}%
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Strongest Subject</span>
                <strong className="text-indigo-300 text-xs mt-0.5 block">
                  {weeklyReviewData.bestSubject}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Weakest Area</span>
                <strong className="text-rose-400 text-xs mt-0.5 block">
                  {weeklyReviewData.weakestSubject}
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
              <strong className="text-indigo-400 block font-semibold">Behavioral Pattern Insight:</strong>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {weeklyReviewData.behavioralInsight}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <strong className="text-slate-200 block font-semibold">Next Week AI Adjustments:</strong>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {weeklyReviewData.nextWeekAdjustments.map((adj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span>{adj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setWeeklyReviewOpen(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TodayCommandCenterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh] text-xs text-indigo-400">
          Loading command center...
        </div>
      }
    >
      <TodayCommandCenterContent />
    </Suspense>
  );
}
