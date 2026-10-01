"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  List,
  Layers,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bot,
  Flame,
  Award,
  Play,
} from "lucide-react";
import { getPlanDays, getSubjects, getCurrentPlanDay } from "@/lib/data";
import { StudyDay, DayStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { DayDrawer } from "@/components/dashboard/day-drawer";
import GlassSurface from "@/components/ui/GlassSurface";

type ViewMode = "timeline" | "subject";

export default function PlanPage() {
  const subjects = getSubjects();
  const [days, setDays] = useState<StudyDay[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeDrawerDay, setActiveDrawerDay] = useState<StudyDay | null>(null);
  const [recoveryPromptDay, setRecoveryPromptDay] = useState<StudyDay | null>(null);

  const planInfo = getCurrentPlanDay();

  useEffect(() => {
    const loadDays = () => {
      try {
        const saved = localStorage.getItem("gate_study_days");
        if (saved) {
          setDays(JSON.parse(saved));
        } else {
          const initial = getPlanDays();
          setDays(initial);
          localStorage.setItem("gate_study_days", JSON.stringify(initial));
        }
      } catch {
        setDays(getPlanDays());
      }
    };

    loadDays();

    const handleScheduleUpdated = () => loadDays();
    window.addEventListener("gate-schedule-updated", handleScheduleUpdated);
    return () => window.removeEventListener("gate-schedule-updated", handleScheduleUpdated);
  }, []);

  const handleUpdateDayStatus = (dayNumber: number, newStatus: DayStatus) => {
    const updated = days.map((d) => {
      if (d.dayNumber !== dayNumber) return d;
      let newTasks = d.tasks;
      if (newStatus === "completed") {
        newTasks = d.tasks.map((t) => ({ ...t, completed: true }));
      } else if (newStatus === "pending") {
        newTasks = d.tasks.map((t) => ({ ...t, completed: false }));
      }
      return {
        ...d,
        status: newStatus,
        tasks: newTasks,
      };
    });

    setDays(updated);
    localStorage.setItem("gate_study_days", JSON.stringify(updated));

    if (newStatus === "missed") {
      const missedDay = updated.find((d) => d.dayNumber === dayNumber);
      if (missedDay) setRecoveryPromptDay(missedDay);
    } else if (recoveryPromptDay?.dayNumber === dayNumber) {
      setRecoveryPromptDay(null);
    }
  };

  const handleToggleTask = (dayNumber: number, taskId: string) => {
    const updated = days.map((d) => {
      if (d.dayNumber !== dayNumber) return d;
      const newTasks = d.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      const allDone = newTasks.every((t) => t.completed);
      const anyDone = newTasks.some((t) => t.completed);
      const status: DayStatus = allDone ? "completed" : anyDone ? "in_progress" : "pending";
      return { ...d, tasks: newTasks, status };
    });

    setDays(updated);
    localStorage.setItem("gate_study_days", JSON.stringify(updated));
    if (activeDrawerDay && activeDrawerDay.dayNumber === dayNumber) {
      const active = updated.find((d) => d.dayNumber === dayNumber);
      if (active) setActiveDrawerDay(active);
    }
  };

  // Filter Logic
  const filteredDays = days.filter((d) => {
    if (selectedMonth !== "all" && String(d.month) !== selectedMonth) return false;
    if (selectedSubject !== "all" && !d.subject.toLowerCase().includes(selectedSubject.toLowerCase())) {
      return false;
    }
    const currentStatus = d.status || (d.tasks.every((t) => t.completed) ? "completed" : "pending");
    if (selectedStatus !== "all" && currentStatus !== selectedStatus) return false;
    return true;
  });

  const completedCount = days.filter(
    (d) => d.status === "completed" || (d.tasks && d.tasks.every((t) => t.completed))
  ).length;

  return (
    <div className="space-y-6 w-full max-w-[1620px] mx-auto pt-4 pb-24 animate-fade-in-up text-slate-900">
      {/* Header Banner - Luxury Liquid Glass with Emerald & Gold */}
      <GlassSurface
        borderRadius={28}
        className="p-6 sm:p-8 shadow-xl space-y-5 relative overflow-hidden border border-white/95"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-amber-400/25 via-[#022c22]/20 to-transparent rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-[#022c22] border border-emerald-300 font-mono">
              <CalendarIcon className="w-3.5 h-3.5 text-[#064e3b]" /> 90-Day Execution Timeline
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#011c15]">
              GATE 2027 Execution Timeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
              Every day from October 1 to December 29, 2026 is mathematically scheduled with subtopics, hours, and external study resources. Total fixed window: 90 days.
            </p>
          </div>

          {/* Quick Progress Badge */}
          <div className="rounded-2xl p-4 shrink-0 flex items-center gap-4 shadow-sm border border-emerald-300/80 bg-white/85">
            <div className="w-13 h-13 rounded-2xl metallic-shining-gold-btn text-[#011c15] flex items-center justify-center font-black text-xl font-mono shadow-md">
              {Math.round((completedCount / (days.length || 90)) * 100)}%
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-[#011c15] block">
                {completedCount} of {days.length || 90} Days Completed
              </span>
              <span className="text-xs text-[#064e3b] font-mono font-black block mt-0.5">
                Current: Day {planInfo.dayNumber}
              </span>
            </div>
          </div>
        </div>
      </GlassSurface>

      {/* Missed Day Recovery Alert */}
      {recoveryPromptDay && (
        <GlassSurface
          borderRadius={24}
          className="p-5 luxury-glass-gold flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300 shadow-md border border-amber-400/80"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-200 text-[#451a03] border border-amber-300 shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#451a03]">
                Missed Day {recoveryPromptDay.dayNumber}: {recoveryPromptDay.topic}
              </h4>
              <p className="text-xs text-[#451a03] mt-0.5 font-bold">
                Don&apos;t panic or shift the timeline. Use AI Study Coach to compress this topic into 2 recovery hours or distribute across Month 3 buffer days.
              </p>
            </div>
          </div>

          <Link
            href={`/ai?mode=recovery&day=${recoveryPromptDay.dayNumber}`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl metallic-shining-gold-btn text-[#011c15] font-black text-xs shadow-md transition-all shrink-0 cursor-pointer hover:scale-102"
          >
            <Bot className="w-4 h-4" />
            <span>Generate Recovery Plan</span>
          </Link>
        </GlassSurface>
      )}

      {/* Streamlined View Switcher & Filters */}
      <GlassSurface
        borderRadius={24}
        className="p-5 space-y-4 shadow-lg border border-white/95"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-900/10 pb-3.5">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-2xl border border-white/90 self-start">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                viewMode === "timeline"
                  ? "metallic-dark-green-btn text-[#fef9c3] shadow-md border-amber-400/80"
                  : "text-[#011c15] hover:text-[#064e3b] hover:bg-white"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline Cards</span>
            </button>

            <button
              onClick={() => setViewMode("subject")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                viewMode === "subject"
                  ? "metallic-dark-green-btn text-[#fef9c3] shadow-md border-amber-400/80"
                  : "text-[#011c15] hover:text-[#064e3b] hover:bg-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Subject View</span>
            </button>
          </div>

          <span className="text-xs text-[#022c22] font-mono font-black bg-[#fef9c3] px-3 py-1 rounded-xl border border-[#d4af37]/80 shadow-2xs">
            Showing {filteredDays.length} of 90 Days
          </span>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#011c15] font-mono">
            <Filter className="w-3.5 h-3.5 text-[#064e3b]" /> Filters:
          </div>

          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white/90 border border-slate-300 text-[#011c15] text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400 font-bold cursor-pointer shadow-2xs"
          >
            <option value="all">All 3 Months (Days 1–90)</option>
            <option value="1">Month 1 (Oct 1–Oct 30)</option>
            <option value="2">Month 2 (Oct 31–Nov 29)</option>
            <option value="3">Month 3 (Nov 30–Dec 29)</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-white/90 border border-slate-300 text-[#011c15] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 max-w-[220px] font-bold cursor-pointer shadow-2xs"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white/90 border border-slate-300 text-[#011c15] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 font-bold cursor-pointer shadow-2xs"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </GlassSurface>

      {/* Chronological Timeline Cards */}
      {viewMode === "timeline" && (
        <div className="space-y-4">
          {filteredDays.map((day) => {
            const isToday = day.dayNumber === planInfo.dayNumber;
            const currentStatus: DayStatus =
              day.status ||
              (day.tasks.length > 0 && day.tasks.every((t) => t.completed) ? "completed" : "pending");

            return (
              <div
                key={day.dayNumber}
                className={`luxury-glass-card rounded-3xl p-5 sm:p-6 shadow-md transition-all space-y-4 border ${
                  isToday
                    ? "ring-2 ring-amber-400 border-2 border-amber-500 shadow-[0_0_25px_rgba(250,204,21,0.25)] bg-white/45"
                    : currentStatus === "completed"
                    ? "luxury-glass-emerald border-emerald-400/80"
                    : currentStatus === "missed"
                    ? "luxury-glass-gold border-amber-400/80"
                    : "border-white/80 hover:border-amber-400/80"
                }`}
              >
                {/* Day Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-950 font-black font-mono text-xs flex items-center justify-center border border-emerald-300 shadow-2xs">
                      D{day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-black text-slate-950 tracking-tight">
                          {day.topic}
                        </h3>
                        {day.isTestDay && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                            TEST
                          </span>
                        )}
                        {isToday && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300">
                            TODAY
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">
                        {day.subject} • <span className="font-mono">{formatDate(day.date)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        handleUpdateDayStatus(day.dayNumber, e.target.value as DayStatus)
                      }
                      className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none transition-all cursor-pointer shadow-2xs ${
                        currentStatus === "completed"
                          ? "bg-emerald-100 border-emerald-400 text-emerald-950"
                          : currentStatus === "missed"
                          ? "bg-amber-100 border-amber-400 text-amber-950"
                          : currentStatus === "in_progress"
                          ? "bg-blue-100 border-blue-400 text-blue-950"
                          : "bg-white/80 border-slate-300 text-slate-800"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="missed">Missed</option>
                    </select>

                    <button
                      onClick={() => setActiveDrawerDay(day)}
                      className="px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white text-slate-800 text-xs font-bold border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                    >
                      Details
                    </button>

                    <Link
                      href={`/?day=${day.dayNumber}`}
                      className="px-3.5 py-1.5 rounded-xl metallic-shining-gold-btn text-[#022018] text-xs font-black shadow-xs transition-all cursor-pointer hover:scale-102"
                    >
                      Open Full View ↗
                    </Link>
                  </div>
                </div>

                {/* Subtopics Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {day.subtopics.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl text-[11px] bg-white/60 border border-slate-200/90 text-slate-800 font-semibold shadow-2xs"
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                {/* Bottom Launchers */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-4 text-slate-700">
                    <span className="flex items-center gap-1 font-semibold font-mono">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      {day.plannedHours} hrs planned
                    </span>
                    <span className="flex items-center gap-1 font-semibold font-mono">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      {day.pyqResource?.target || 15} PYQs
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {day.learningResource && (
                      <a
                        href={day.learningResource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100/90 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 font-bold transition-all shadow-2xs"
                      >
                        <span>Open Gate Smashers</span>
                        <ExternalLink className="w-3 h-3 text-emerald-700" />
                      </a>
                    )}
                    {day.pyqResource && (
                      <a
                        href={day.pyqResource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold transition-all shadow-2xs"
                      >
                        <span>Open GATEOverflow</span>
                        <ExternalLink className="w-3 h-3 text-amber-700" />
                      </a>
                    )}
                    {day.exactResources?.mcqs && (
                      <a
                        href={day.exactResources.mcqs.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-100/90 hover:bg-teal-200 text-teal-950 border border-teal-300 font-bold transition-all shadow-2xs"
                      >
                        <span>Solve Topic MCQs</span>
                        <ExternalLink className="w-3 h-3 text-teal-700" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subject Breakdown */}
      {viewMode === "subject" && (
        <div className="space-y-6">
          {subjects.map((sub) => {
            const subjectDays = days.filter(
              (d) =>
                d.subject.toLowerCase().includes(sub.name.toLowerCase()) ||
                sub.name.toLowerCase().includes(d.subject.toLowerCase())
            );
            if (subjectDays.length === 0) return null;

            const totalHours = subjectDays.reduce((sum, d) => sum + d.plannedHours, 0);
            const doneDays = subjectDays.filter(
              (d) => d.status === "completed" || d.tasks.every((t) => t.completed)
            ).length;
            const percent = Math.round((doneDays / subjectDays.length) * 100);

            return (
              <div
                key={sub.id}
                className="luxury-glass rounded-3xl p-6 shadow-md space-y-4 border border-white/90"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/10 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-950 tracking-tight">
                      {sub.name}
                    </h3>
                    <span className="text-xs text-slate-600 font-medium">
                      {subjectDays.length} Days allocated • {totalHours} Total Hours
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-xl border border-emerald-300">
                      {doneDays}/{subjectDays.length} Days Done ({percent}%)
                    </span>
                    {sub.gateSmashersUrl && (
                      <a
                        href={sub.gateSmashersUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white text-slate-800 text-xs font-bold border border-slate-300 transition-colors shadow-2xs"
                      >
                        <span>Roadmap ↗</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Subject Days Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subjectDays.map((d) => (
                    <div
                      key={d.dayNumber}
                      onClick={() => setActiveDrawerDay(d)}
                      className="p-3.5 rounded-2xl luxury-glass-card border border-white/80 hover:border-amber-400 cursor-pointer space-y-1.5 transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-black text-emerald-900">
                          Day {d.dayNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatDate(d.date).slice(0, 6)}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-950 truncate">
                        {d.topic}
                      </p>
                      <div className="text-[10px] text-slate-600 truncate font-medium">
                        {d.subtopics.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day Drawer Modal */}
      <DayDrawer
        day={activeDrawerDay}
        onClose={() => setActiveDrawerDay(null)}
        onToggleTask={handleToggleTask}
      />
    </div>
  );
}
