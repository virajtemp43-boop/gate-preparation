"use client";

import React, { useState } from "react";
import { StudyDay } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Check, Flame, Trophy, ExternalLink, Calendar } from "lucide-react";

interface CalendarViewProps {
  days: StudyDay[];
  currentDayNumber: number;
  onSelectDay: (day: StudyDay) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  days,
  currentDayNumber,
  onSelectDay,
}) => {
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);

  const phaseDays = days.filter((d) => d.month === activePhase);

  const phases = [
    {
      id: 1 as const,
      label: "MONTH 1 — FOUNDATION & MATHEMATICS",
      dates: "01 Oct – 30 Oct 2026",
      daysRange: "Days 1–30",
    },
    {
      id: 2 as const,
      label: "MONTH 2 — CORE SYSTEMS",
      dates: "31 Oct – 29 Nov 2026",
      daysRange: "Days 31–60",
    },
    {
      id: 3 as const,
      label: "MONTH 3 — NETWORKS, THEORY & REVISION",
      dates: "30 Nov – 29 Dec 2026",
      daysRange: "Days 61–90",
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Calendar Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-400" /> 90-Day Master Timetable
          </h3>
          <p className="text-xs text-slate-400">
            Interactive syllabus execution calendar from October 1 to December 29, 2026.
          </p>
        </div>

        {/* Phase Selectors */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto">
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePhase(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activePhase === p.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p.daysRange}
            </button>
          ))}
        </div>
      </div>

      {/* Month Subtitle & Quick Stats */}
      <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
        <span className="font-semibold text-slate-200">
          {phases.find((p) => p.id === activePhase)?.label}
        </span>
        <span className="font-mono text-indigo-400">
          {phases.find((p) => p.id === activePhase)?.dates}
        </span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2.5">
        {phaseDays.map((day) => {
          const isToday = day.dayNumber === currentDayNumber;
          const tasks = day.tasks || [];
          const isCompleted = tasks.length > 0 && tasks.every((c) => c.completed);
          const hasProgress = tasks.some((c) => c.completed);

          return (
            <div
              key={day.dayNumber}
              onClick={() => onSelectDay(day)}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-28 text-left ${
                isToday
                  ? "bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/50"
                  : isCompleted
                  ? "bg-emerald-950/20 border-emerald-800/50 hover:border-emerald-700"
                  : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700"
              }`}
            >
              {/* Top Row: Day number & Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold ${
                    isToday ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  Day {day.dayNumber}
                </span>

                {day.isTestDay ? (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    TEST
                  </span>
                ) : isCompleted ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                ) : hasProgress ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatDate(day.date).slice(0, 6)}
                  </span>
                )}
              </div>

              {/* Middle: Subject Pill */}
              <div className="my-1">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-indigo-300 border border-slate-700/60 truncate max-w-full">
                  {day.subject}
                </span>
              </div>

              {/* Bottom: Topic Title */}
              <p className="text-[11px] font-medium text-slate-300 line-clamp-2 leading-tight group-hover:text-white transition-colors">
                {day.topic}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
