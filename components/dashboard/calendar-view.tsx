"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudyDay } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Clock3, Clock, Sparkles } from "lucide-react";

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
  const [dayNotes, setDayNotes] = useState<{ [dayNumber: number]: string }>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gate_day_notes");
      if (saved) setDayNotes(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not read day notes", e);
    }
  }, []);

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
  const padCells = Array.from({ length: currentPhaseConfig.startDayOffset });

  return (
    <div className="luxury-glass rounded-3xl p-5 sm:p-7 space-y-5 border border-white/95 shadow-xl">
      {/* Timeline Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100/70 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25">
              <Clock3 className="w-5 h-5" />
            </span>
            <span className="metallic-gold-text">90-Day Master Timetable</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Exact weekday-aligned schedule from October 1 to December 29, 2026. Click any day to open its full dashboard.
          </p>
        </div>

        {/* Phase Selectors */}
        <div className="flex items-center gap-2 p-1.5 bg-white/80 rounded-2xl border border-slate-200/80 self-start md:self-auto overflow-x-auto">
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePhase(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activePhase === p.id
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/30 scale-102"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              {p.daysRange}
            </button>
          ))}
        </div>
      </div>

      {/* Month Subtitle & Dates Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs p-3.5 rounded-2xl luxury-glass-card border border-emerald-200/70">
        <span className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          {currentPhaseConfig.label}
        </span>
        <span className="font-mono text-emerald-800 font-extrabold bg-white/90 px-3 py-1 rounded-xl border border-emerald-200/80">
          {currentPhaseConfig.dates}
        </span>
      </div>

      {/* Weekday Header Strip with Crisp Light Borders */}
      <div className="grid grid-cols-7 gap-2.5 text-center">
        {WEEKDAYS.map((dayName, idx) => (
          <div
            key={dayName}
            className={`py-2 text-xs font-mono font-bold tracking-wider rounded-xl border shadow-2xs ${
              idx >= 5
                ? "bg-gradient-to-r from-amber-100/80 to-yellow-100/70 text-amber-900 border-amber-200/80"
                : "bg-gradient-to-r from-emerald-50/80 to-teal-50/70 text-emerald-900 border-emerald-200/70"
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Days Grid with Architectural Card Structure & Explicit Borders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {/* Empty padding cells */}
        {padCells.map((_, i) => (
          <div
            key={`pad-${i}`}
            className="min-h-[140px] rounded-2xl border border-dashed border-slate-300/40 bg-slate-50/20 hidden lg:block opacity-40"
          />
        ))}

        {/* Real Day Cards */}
        {phaseDays.map((day) => {
          const isToday = day.dayNumber === currentDayNumber;
          const tasks = day.tasks || [];
          const isCompleted = tasks.length > 0 && tasks.every((c) => c.completed);
          const hasProgress = tasks.some((c) => c.completed);
          const dayNote = dayNotes[day.dayNumber];

          return (
            <div
              key={day.dayNumber}
              onClick={() => onSelectDay(day)}
              className={`group relative p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] text-left hover:-translate-y-1 ${
                isToday
                  ? "luxury-glass-selected shadow-emerald-600/35 ring-2 ring-emerald-400"
                  : isCompleted
                  ? "luxury-glass-emerald border-emerald-300/80 hover:border-emerald-500 shadow-xs"
                  : "luxury-glass-card hover:border-emerald-400 hover:bg-white/95 shadow-2xs"
              }`}
            >
              {/* Top Row: Day Number, Date, Status Dot */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-mono font-extrabold ${
                      isToday ? "text-white" : "text-slate-900 group-hover:text-emerald-950"
                    }`}
                  >
                    Day {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                  </span>
                  <span
                    className={`text-[10px] font-mono ${
                      isToday ? "text-emerald-100" : "text-slate-500"
                    }`}
                  >
                    • {formatDate(day.date).slice(0, 6)}
                  </span>
                </div>

                {day.isTestDay ? (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isToday ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700 border border-rose-200"
                    }`}
                  >
                    TEST
                  </span>
                ) : isCompleted ? (
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isToday ? "bg-white text-emerald-700" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    ✓
                  </span>
                ) : hasProgress ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-200 animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                )}
              </div>

              {/* Structural Divider */}
              <div className="w-full h-px bg-emerald-500/15 my-1.5" />

              {/* Middle: Subject Pill */}
              <div className="w-full">
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold font-mono truncate max-w-full ${
                    isToday
                      ? "bg-white/20 text-white border border-white/30"
                      : "bg-white/90 text-emerald-900 border border-emerald-200/80 shadow-2xs"
                  }`}
                >
                  {day.subject.slice(0, 18)}
                </span>
              </div>

              {/* Topic Title */}
              <p
                className={`text-[11px] font-semibold line-clamp-2 leading-tight mt-1 ${
                  isToday ? "text-white" : "text-slate-800 group-hover:text-emerald-950"
                }`}
              >
                {day.topic}
              </p>

              {/* Structural Divider */}
              <div className="w-full h-px bg-emerald-500/15 my-1.5" />

              {/* Bottom: Hours & Notes */}
              <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
                <span
                  className={`flex items-center gap-1 ${
                    isToday ? "text-emerald-100" : "text-slate-600"
                  }`}
                >
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>{day.plannedHours || 6}h</span>
                </span>

                {dayNote ? (
                  <span
                    className={`flex items-center gap-1 font-sans font-bold px-1.5 py-0.5 rounded text-[9px] ${
                      isToday
                        ? "bg-amber-400/30 text-amber-100 border border-amber-300/40"
                        : "bg-amber-50 text-amber-900 border border-amber-200"
                    }`}
                  >
                    📝 Note
                  </span>
                ) : (
                  <Link
                    href={`/?day=${day.dayNumber}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold ${
                      isToday ? "text-white" : "text-emerald-700"
                    }`}
                  >
                    View ↗
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
