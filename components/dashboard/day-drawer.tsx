"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Clock,
  ExternalLink,
  HelpCircle,
  Bot,
  CheckCircle2,
  ShieldCheck,
  Bookmark,
  Play,
  Video,
  FileQuestion,
  Search,
} from "lucide-react";
import { StudyDay } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getDayResourceMap } from "@/lib/data";

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

  // Resolve exact day-level topic resources
  const exact = day.exactResources || getDayResourceMap(day.dayNumber);
  const videoLocator = exact?.videos?.[0];
  const pyqLocator = exact?.pyqs?.[0];
  const officialUrl = exact?.pyqs?.[1]?.url || "https://gate2027.iitm.ac.in/";
  const mcqUrl = exact?.mcqs?.url || "https://www.geeksforgeeks.org/gate-cs-notes-gq/";

  const hasDirectVideo = Boolean(videoLocator?.directUrl);
  const videoTitle = videoLocator?.title || day.learningResource?.title || `${day.topic} Lecture`;
  const pyqTitle = pyqLocator?.title || day.pyqResource?.title || `${day.topic} Previous GATE Questions`;
  const subtopicsList = exact?.subtopics?.length ? exact.subtopics : day.subtopics;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-white border-l border-slate-200 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* PRIORITY 1: EXACT TOPIC TITLE & HEADER */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  DAY {day.dayNumber} OF 90
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {formatDate(day.date)}
                </span>
                {day.isTestDay && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    TEST DAY
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {day.topic}
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Subject: <span className="text-indigo-600 font-semibold">{day.subject}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Planned Time
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {day.plannedHours} Hours
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> PYQ Target
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {day.pyqResource?.target || 15} PYQs
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Bookmark className="w-3.5 h-3.5 text-purple-600" /> Scope
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {subtopicsList.length} Concepts
              </p>
            </div>
          </div>

          {/* TODAY'S EXACT RESOURCES SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Today&apos;s Exact Resources
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Exact Topic Resolution
              </span>
            </div>

            {/* PRIORITY 2: EXACT VIDEO CARD */}
            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                    <Video className="w-3 h-3" /> Gate Smashers
                  </span>
                  {hasDirectVideo ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Verified Direct
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Topic Locator
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400">VIDEO</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {videoTitle}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {hasDirectVideo
                    ? "Direct verified video lecture mapped to today's syllabus topic."
                    : "Curated Gate Smashers syllabus roadmap with exact YouTube search locator backup."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-indigo-100">
                <a
                  href={videoLocator?.directUrl || videoLocator?.roadmapUrl || day.learningResource?.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    hasDirectVideo
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{hasDirectVideo ? "Watch exact lecture ▶" : "Open topic roadmap ↗"}</span>
                </a>

                {videoLocator?.searchFallbackUrl && (
                  <a
                    href={videoLocator.searchFallbackUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all shadow-xs"
                  >
                    <Search className="w-3 h-3" />
                    <span>Backup / topic roadmap ↗</span>
                  </a>
                )}
              </div>
            </div>

            {/* PRIORITY 3: EXACT PYQ & MCQ CARD */}
            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200/80 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <FileQuestion className="w-3 h-3" /> GATEOverflow & MCQs
                </span>
                <span className="text-[10px] font-bold text-slate-600">
                  {day.pyqResource?.target || 15} PYQs Target
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {pyqTitle}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Curated official GATE questions with full peer solutions, along with exact topic MCQs below.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-purple-100">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={pyqLocator?.url || day.pyqResource?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open exact topic PYQs ↗</span>
                  </a>
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all shadow-xs"
                  >
                    <span>IIT paper ↗</span>
                  </a>
                </div>

                {/* Exact Topic MCQs link directly below the GATEOverflow link */}
                <a
                  href={mcqUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solve Exact Topic MCQs & Quiz ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* PRIORITY 4: SUBTOPICS SCOPE */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Syllabus Scope for Day {day.dayNumber}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {subtopicsList.map((sub, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl text-xs bg-slate-100 border border-slate-200 text-slate-700"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* TODAY'S TASK CHECKLIST */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Task Execution Sequence
              </span>
              <span className="text-xs font-mono text-slate-500">
                {completedCount} / {tasks.length} Done ({progressPercent}%)
              </span>
            </div>

            <div className="space-y-1.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                    task.completed
                      ? "bg-emerald-50/50 border-emerald-200 text-slate-500"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <button
                    onClick={() => onToggleTask && onToggleTask(day.dayNumber, task.id)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        task.completed ? "text-emerald-600" : "text-slate-400"
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
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:text-indigo-900 border border-indigo-200 text-[11px] font-semibold shrink-0"
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

        {/* PRIORITY 5: FULL DAY VIEW & AI COACH LAUNCHERS */}
        <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
          <Link
            href={`/?day=${day.dayNumber}`}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Open Day {day.dayNumber} Full View ↗
          </Link>
          <Link
            href={`/ai?day=${day.dayNumber}&subject=${encodeURIComponent(day.subject)}&topic=${encodeURIComponent(day.topic)}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
          >
            <Bot className="w-4 h-4 text-indigo-600" /> Ask AI Study Coach About Day {day.dayNumber}
          </Link>
        </div>
      </div>
    </div>
  );
};
