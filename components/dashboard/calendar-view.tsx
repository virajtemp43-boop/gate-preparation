"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudyDay } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Check, Trophy, ExternalLink, Calendar, Play } from "lucide-react";

interface CalendarViewProps {
  days: StudyDay[];
  currentDayNumber: number;
  onSelectDay: (day: StudyDay) => void;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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
      label: "Month 1 — Foundation & Mathematics",
      dates: "01 Oct – 30 Oct 2026",
      daysRange: "Days 1–30",
      // Oct 1, 2026 is Thursday -> 3 days padding (Mon, Tue, Wed)
      startDayOffset: 3,
    },
    {
      id: 2 as const,
      label: "Month 2 — Core Systems & Architecture",
      dates: "31 Oct – 29 Nov 2026",
      daysRange: "Days 31–60",
      // Oct 31, 2026 is Saturday -> 5 days padding (Mon..Fri)
      startDayOffset: 5,
    },
    {
      id: 3 as const,
      label: "Month 3 — Networks, Theory & Revision",
      dates: "30 Nov – 29 Dec 2026",
      daysRange: "Days 61–90",
      // Nov 30, 2026 is Monday -> 0 days padding
      startDayOffset: 0,
    },
  ];

  const currentPhaseConfig = phases.find((p) => p.id === activePhase) || phases[0];

  // Create calendar cells with padding for correct weekday alignment
  const padCells = Array.from({ length: currentPhaseConfig.startDayOffset });

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
      {/* Calendar Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-600" /> 90-Day Master Timetable Calendar
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Full calendar view aligned to exact weekdays from October 1 to December 29, 2026.
          </p>
        </div>

        {/* Phase Selectors */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-auto overflow-x-auto">
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePhase(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activePhase === p.id
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {p.daysRange}
            </button>
          ))}
        </div>
      </div>

      {/* Month Subtitle & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <span className="font-bold text-slate-800">
          {currentPhaseConfig.label}
        </span>
        <span className="font-mono text-indigo-600 font-semibold">
          {currentPhaseConfig.dates}
        </span>
      </div>

      {/* Weekday Header Strip */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {WEEKDAYS.map((dayName, idx) => (
          <div
            key={dayName}
            className={`py-2 text-[11px] font-bold rounded-xl ${
              idx >= 5 ? "bg-amber-50/70 text-amber-700" : "bg-slate-100/70 text-slate-600"
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Days Grid Aligned to Real Weekdays */}
      <div className="grid grid-cols-7 gap-2.5">
        {/* Empty padding cells for correct weekday start */}
        {padCells.map((_, i) => (
          <div
            key={`pad-${i}`}
            className="h-28 rounded-2xl border border-dashed border-slate-100 bg-slate-50/30 hidden sm:block opacity-40"
          />
        ))}

        {/* Real Day Cards */}
        {phaseDays.map((day) => {
          const isToday = day.dayNumber === currentDayNumber;
          const tasks = day.tasks || [];
          const isCompleted = tasks.length > 0 && tasks.every((c) => c.completed);
          const hasProgress = tasks.some((c) => c.completed);

          return (
            <div
              key={day.dayNumber}
              onClick={() => onSelectDay(day)}
              className={`group relative p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 text-left hover:-translate-y-0.5 hover:shadow-md ${
                isToday
                  ? "bg-indigo-50/90 border-indigo-500 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/30"
                  : isCompleted
                  ? "bg-emerald-50/60 border-emerald-300 hover:border-emerald-500"
                  : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-indigo-300"
              }`}
            >
              {/* Top Row: Day number & Status Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold ${
                    isToday ? "text-indigo-700" : "text-slate-600 group-hover:text-indigo-600"
                  }`}
                >
                  Day {day.dayNumber}
                </span>

                {day.isTestDay ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    TEST
                  </span>
                ) : isCompleted ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                    ✓
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
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white text-indigo-700 border border-slate-200 truncate max-w-full shadow-2xs">
                  {day.subject.slice(0, 15)}
                </span>
              </div>

              {/* Bottom: Topic Title + Direct Quick Launch Link */}
              <div className="flex items-end justify-between gap-1">
                <p className="text-[11px] font-medium text-slate-700 line-clamp-2 leading-tight group-hover:text-slate-900 transition-colors flex-1">
                  {day.topic}
                </p>
                <Link
                  href={`/?day=${day.dayNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs text-[10px] shrink-0"
                  title="Open Full View on Starting Page"
                >
                  ↗
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
