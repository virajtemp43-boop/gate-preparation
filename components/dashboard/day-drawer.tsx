"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  ExternalLink,
  HelpCircle,
  Code,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Bookmark,
} from "lucide-react";
import { StudyDay } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface DayDrawerProps {
  day: StudyDay | null;
  onClose: () => void;
  onToggleTask?: (dayNumber: number, taskId: string) => void;
}

export const DayDrawer: React.FC<DayDrawerProps> = ({
  day,
  onClose,
  onToggleTask,
}) => {
  if (!day) return null;

  const tasks = day.tasks || [];
  const completedCount = tasks.filter((c) => c.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                  DAY {day.dayNumber} OF 90
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {formatDate(day.date)}
                </span>
                {day.isTestDay && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    TEST DAY
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {day.topic}
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Subject: <span className="text-indigo-300 font-semibold">{day.subject}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Planned Time
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {day.plannedHours} Hours
              </p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> PYQ Target
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {day.pyqResource?.target || 15} PYQs
              </p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-purple-400" /> Subtopics
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {day.subtopics.length} Concepts
              </p>
            </div>
          </div>

          {/* Daily AI Briefing */}
          {day.briefing && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Day Mission Briefing
              </div>
              <p className="text-xs text-white font-medium">
                {day.briefing.mission}
              </p>
              <p className="text-[11px] text-slate-400">
                <strong className="text-slate-300">Why it matters:</strong> {day.briefing.whyItMatters}
              </p>
            </div>
          )}

          {/* Subtopics */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Syllabus Scope
            </h4>
            <ul className="space-y-1.5">
              {day.subtopics.map((sub, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-800/60"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>{sub}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tasks Sequence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Task Execution Sequence
              </h4>
              <span className="text-xs font-bold text-indigo-400">
                {progressPercent}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    task.completed
                      ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                      : "bg-slate-800/50 border-slate-700/60 text-slate-300"
                  }`}
                >
                  <button
                    onClick={() => onToggleTask && onToggleTask(day.dayNumber, task.id)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        task.completed ? "text-emerald-400" : "text-slate-500"
                      }`}
                    />
                    <span className={task.completed ? "line-through opacity-80" : ""}>
                      {task.title} ({task.estMinutes}m)
                    </span>
                  </button>

                  {task.resourceUrl && (
                    <a
                      href={task.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 hover:text-white hover:bg-indigo-600 text-[11px] font-semibold shrink-0"
                    >
                      <span>{task.provider || "Open"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Resource Launchers */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {day.learningResource && (
              <a
                href={day.learningResource.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <span>Gate Smashers ↗</span>
              </a>
            )}
            {day.pyqResource && (
              <a
                href={day.pyqResource.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
              >
                <span>GATEOverflow ↗</span>
              </a>
            )}
          </div>
          <Link
            href={`/ai?subject=${encodeURIComponent(day.subject)}&topic=${encodeURIComponent(day.topic)}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Bot className="w-4 h-4" /> Ask AI Study Coach About This Day
          </Link>
        </div>
      </div>
    </div>
  );
};
