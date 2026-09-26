"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Flame,
  Send,
  Award,
  Layers,
  Repeat,
} from "lucide-react";
import { getCurrentPlanDay, getPlanDays, getResources } from "@/lib/data";
import { StudyDay, DailyTask } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function TodayCommandCenterPage() {
  const [currentDay, setCurrentDay] = useState<StudyDay | null>(null);
  const [allDays, setAllDays] = useState<StudyDay[]>([]);
  const [availableHours, setAvailableHours] = useState<number>(6);
  const [quickQuestion, setQuickQuestion] = useState("");
  const [coachAnswer, setCoachAnswer] = useState<string | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [isPreLaunch, setIsPreLaunch] = useState(false);
  const [daysUntilLaunch, setDaysUntilLaunch] = useState(0);

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
        const match = parsed.find((d) => d.dayNumber === day.dayNumber);
        if (match) day = match;
        setAllDays(parsed);
      }
      const savedHours = localStorage.getItem("gate_daily_hours");
      if (savedHours) setAvailableHours(Number(savedHours));
    } catch (e) {
      console.warn("Could not read localStorage", e);
    }

    setCurrentDay(day);
  }, []);

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

    // Trigger celebration if all core tasks completed
    const allCoreDone = updatedTasks.filter((t) => t.isCore).every((t) => t.completed);
    if (allCoreDone) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleAskCoach = async (queryText?: string) => {
    const q = queryText || quickQuestion;
    if (!q.trim() || coachLoading || !currentDay) return;

    setCoachLoading(true);
    setCoachAnswer(null);

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
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setCoachAnswer(data.reply);
      }
    } catch (e) {
      setCoachAnswer("Unable to reach AI Coach right now. Please check your network or enter a Groq API key in Settings.");
    } finally {
      setCoachLoading(false);
    }
  };

  if (!currentDay) return null;

  // Filter tasks based on Available-Time Mode
  // If user has 2h or 3h: show only Core tasks. If 6h+: show all.
  const displayedTasks =
    availableHours <= 3
      ? currentDay.tasks.filter((t) => t.isCore)
      : currentDay.tasks;

  const totalTasks = displayedTasks.length;
  const completedTasks = displayedTasks.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 90-Day total completion
  const totalCompletedDays = allDays.filter((d) => d.tasks.every((t) => t.completed)).length;
  const overall90DayPercent = Math.round((totalCompletedDays / 90) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Pre-launch Notification Banner */}
      {isPreLaunch && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-800/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Kickoff in {daysUntilLaunch} Days: Official Launch on October 1, 2026
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                The 90-day timetable is locked from October 1 to December 29, 2026. You can explore Day 1 tasks below or review the 3-month schedule.
              </p>
            </div>
          </div>
          <Link
            href="/plan"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold whitespace-nowrap self-start sm:self-auto transition-colors"
          >
            Explore 90-Day Schedule →
          </Link>
        </div>
      )}

      {/* TODAY'S MISSION HERO (Section 5 Standard) */}
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
                Today&apos;s Main Subject: {currentDay.subject}
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

      {/* AVAILABLE-TIME MODE (Section 19: 2h / 3h / 4h / 6h / 8h+) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> I Have Today Available:
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            AI automatically compresses your schedule if your time is constrained.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {[2, 3, 4, 6, 8].map((hrs) => (
            <button
              key={hrs}
              onClick={() => {
                setAvailableHours(hrs);
                localStorage.setItem("gate_daily_hours", String(hrs));
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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

      {/* DAILY AI BRIEFING (Section 6 Standard) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Daily AI Study Coach Briefing
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            Groq Llama 3.3 Active
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

      {/* TODAY'S TASK SEQUENCE & RESOURCE LAUNCHER (Section 5 Standard) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Today&apos;s Task Sequence
            </h3>
            <p className="text-xs text-slate-400">
              {availableHours <= 3
                ? `Compressed mode: Showing ${displayedTasks.length} essential core tasks for ${availableHours} hours.`
                : "Full schedule: Check off each task as you complete it."}
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
                  : "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700"
              }`}
            >
              {/* Left: Checkbox + Title */}
              <div
                onClick={() => handleToggleTask(task.id)}
                className="flex items-start gap-3 cursor-pointer select-none flex-1"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                    task.completed
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  {task.completed ? "✓" : idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold text-white ${task.completed ? "line-through opacity-75" : ""}`}>
                      {task.title}
                    </span>
                    {task.targetCount && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {task.targetCount} Questions
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                    Estimated Time: {task.estMinutes} Minutes
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

      {/* EXTERNAL RESOURCE SHORTCUTS (Section 16 Standard) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href={currentDay.learningResource?.url || "https://www.gatesmashers.com/learn"}
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 hover:border-indigo-500 flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-indigo-400 block">
              Learning Resource ↗
            </span>
            <span className="text-xs font-bold text-white mt-0.5 block">
              {currentDay.learningResource?.provider || "Gate Smashers"}
            </span>
            <span className="text-[11px] text-slate-400">
              {currentDay.learningResource?.title || "Syllabus Roadmap"}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
        </a>

        <a
          href={currentDay.pyqResource?.url || "https://gateoverflow.in/questions?sort=gate"}
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 hover:border-emerald-500 flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-400 block">
              PYQ Practice ↗
            </span>
            <span className="text-xs font-bold text-white mt-0.5 block">
              GATEOverflow
            </span>
            <span className="text-[11px] text-slate-400">
              Target: {currentDay.pyqResource?.target || 8} PYQs
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </a>

        <a
          href="https://gate2027.iitm.ac.in/exam_papers_and_syllabus"
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/50 hover:border-purple-500 flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-purple-400 block">
              Official Syllabus ↗
            </span>
            <span className="text-xs font-bold text-white mt-0.5 block">
              IIT Madras Official
            </span>
            <span className="text-[11px] text-slate-400">
              CS Syllabus & Test Papers
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </a>
      </div>

      {/* 90-DAY OVERALL PROGRESS BAR (Section 40 Standard) */}
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

      {/* ASK YOUR STUDY COACH NATURAL LANGUAGE BOX (Section 7 Standard) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" /> Ask Your AI Study Coach
          </h3>
          <span className="text-xs text-slate-400">Natural Language Advice</span>
        </div>

        {/* Quick prompt chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            "What should I do today?",
            "I have only 3 hours today. What should I skip?",
            "I could not finish yesterday. Fix today's plan.",
            "I am weak in pointers. What should I revise?",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setQuickQuestion(prompt);
                handleAskCoach(prompt);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask your coach anything about today's schedule, recovery, or priorities..."
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
    </div>
  );
}
