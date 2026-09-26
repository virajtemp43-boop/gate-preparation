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

type ViewMode = "calendar" | "timeline" | "subject";

export default function PlanPage() {
  const subjects = getSubjects();
  const [days, setDays] = useState<StudyDay[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeDrawerDay, setActiveDrawerDay] = useState<StudyDay | null>(null);
  const [recoveryPromptDay, setRecoveryPromptDay] = useState<StudyDay | null>(null);

  const planInfo = getCurrentPlanDay();

  useEffect(() => {
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
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-fade-in-up">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <CalendarIcon className="w-3.5 h-3.5" /> 90-Day Master Timetable
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              GATE 2027 Execution Blueprint
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every day from October 1 to December 29, 2026 is mathematically scheduled with subtopics, hours, and external study resources. Total fixed window: 90 days.
            </p>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shrink-0 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-lg font-mono">
              {Math.round((completedCount / (days.length || 90)) * 100)}%
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {completedCount} of {days.length || 90} Days Completed
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Current: Day {planInfo.dayNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Missed Day Recovery Alert */}
      {recoveryPromptDay && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                Missed Day {recoveryPromptDay.dayNumber}: {recoveryPromptDay.topic}
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Don&apos;t panic or shift the calendar. Use AI Study Coach to compress this topic into 2 recovery hours or distribute across Month 3 buffer days.
              </p>
            </div>
          </div>

          <Link
            href={`/ai?mode=recovery&day=${recoveryPromptDay.dayNumber}`}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition-all shrink-0"
          >
            <Bot className="w-4 h-4" />
            <span>Generate Recovery Plan</span>
          </Link>
        </div>
      )}

      {/* View Switcher & Filters */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "calendar"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "timeline"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline (Days 1–90)</span>
            </button>

            <button
              onClick={() => setViewMode("subject")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "subject"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Subject View</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Showing {filteredDays.length} of 90 Days
          </span>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-indigo-600" /> Filters:
          </div>

          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-indigo-500 font-medium"
          >
            <option value="all">All 3 Months</option>
            <option value="1">Month 1 (Oct 1–Oct 30)</option>
            <option value="2">Month 2 (Oct 31–Nov 29)</option>
            <option value="3">Month 3 (Nov 30–Dec 29)</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-indigo-500 max-w-[220px] font-medium"
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
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-indigo-500 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </div>

      {/* View 1: Calendar */}
      {viewMode === "calendar" && (
        <CalendarView
          days={days}
          currentDayNumber={planInfo.dayNumber}
          onSelectDay={(day) => setActiveDrawerDay(day)}
        />
      )}

      {/* View 2: Chronological Timeline */}
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
                className={`bg-white border rounded-3xl p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                  isToday
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : currentStatus === "completed"
                    ? "border-emerald-300 bg-emerald-50/20"
                    : currentStatus === "missed"
                    ? "border-amber-300 bg-amber-50/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Day Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold font-mono text-xs flex items-center justify-center border border-indigo-200">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                          {day.topic}
                        </h3>
                        {day.isTestDay && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            TEST
                          </span>
                        )}
                        {isToday && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            TODAY
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                        {day.subject} • <span className="font-mono">{formatDate(day.date)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        handleUpdateDayStatus(day.dayNumber, e.target.value as DayStatus)
                      }
                      className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-hidden transition-all ${
                        currentStatus === "completed"
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : currentStatus === "missed"
                          ? "bg-amber-50 border-amber-300 text-amber-800"
                          : currentStatus === "in_progress"
                          ? "bg-blue-50 border-blue-300 text-blue-800"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="missed">Missed</option>
                    </select>

                    <button
                      onClick={() => setActiveDrawerDay(day)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                    >
                      Details
                    </button>

                    <Link
                      href={`/?day=${day.dayNumber}`}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all"
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
                      className="px-2.5 py-1 rounded-xl text-[11px] bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                {/* Bottom Launchers */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {day.plannedHours} hrs planned
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      {day.pyqResource?.target || 15} PYQs
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {day.learningResource && (
                      <a
                        href={day.learningResource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold transition-all shadow-2xs"
                      >
                        <span>Open Gate Smashers</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {day.pyqResource && (
                      <a
                        href={day.pyqResource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold transition-all shadow-2xs"
                      >
                        <span>Open GATEOverflow</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {day.exactResources?.mcqs && (
                      <a
                        href={day.exactResources.mcqs.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-semibold transition-all shadow-2xs"
                      >
                        <span>Solve Topic MCQs</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 3: Subject Breakdown */}
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
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {sub.name}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {subjectDays.length} Days allocated • {totalHours} Total Hours
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-indigo-700">
                      {doneDays}/{subjectDays.length} Days Done ({percent}%)
                    </span>
                    {sub.gateSmashersUrl && (
                      <a
                        href={sub.gateSmashersUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
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
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-white cursor-pointer space-y-1.5 transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-indigo-700">
                          Day {d.dayNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatDate(d.date).slice(0, 6)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {d.topic}
                      </p>
                      <div className="text-[10px] text-slate-500 truncate">
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
