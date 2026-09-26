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

  const hasDirectVideo = Boolean(videoLocator?.directUrl);
  const videoTitle = videoLocator?.title || day.learningResource?.title || `${day.topic} Lecture`;
  const pyqTitle = pyqLocator?.title || day.pyqResource?.title || `${day.topic} Previous GATE Questions`;
  const subtopicsList = exact?.subtopics?.length ? exact.subtopics : day.subtopics;

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
          {/* PRIORITY 1: EXACT TOPIC TITLE & HEADER */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
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
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
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
                <Bookmark className="w-3.5 h-3.5 text-purple-400" /> Scope
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {subtopicsList.length} Concepts
              </p>
            </div>
          </div>

          {/* TODAY'S EXACT RESOURCES SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Today&apos;s Exact Resources
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Exact Topic Resolution
              </span>
            </div>

            {/* PRIORITY 2: EXACT VIDEO CARD */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <Video className="w-3 h-3" /> Gate Smashers
                  </span>
                  {hasDirectVideo ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Verified Direct
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      Topic Locator
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400">VIDEO</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {videoTitle}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {hasDirectVideo
                    ? "Direct verified video lecture mapped to today's syllabus topic."
                    : "Curated Gate Smashers syllabus roadmap with exact YouTube search locator backup."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {hasDirectVideo ? (
                  <>
                    <a
                      href={videoLocator!.directUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch exact lecture ▶</span>
                    </a>
                    <a
                      href={videoLocator?.roadmapUrl || "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                    >
                      <span>Backup / topic roadmap ↗</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href={videoLocator?.roadmapUrl || "https://www.gatesmashers.com/roadmaps/data-structures-and-algorithms"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
                    >
                      <span>Open topic roadmap ↗</span>
                    </a>
                    <a
                      href={videoLocator?.searchFallbackUrl || `https://www.youtube.com/results?search_query=Gate+Smashers+${encodeURIComponent(day.topic)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                    >
                      <Search className="w-3 h-3" />
                      <span>Backup / topic roadmap ↗</span>
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* PRIORITY 3: EXACT TOPIC PYQ CARD */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-purple-500/30 space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <FileQuestion className="w-3 h-3" /> GATEOverflow
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {day.pyqResource?.target || 15} PYQs Target
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">PYQS</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {pyqTitle}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Filtered official GATE question archive with student & topper discussion threads.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href={pyqLocator?.url || day.pyqResource?.url || "https://gateoverflow.in/questions?sort=gate"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open exact topic PYQs ↗</span>
                </a>
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open official GATE paper ↗</span>
                </a>
              </div>

              {/* EXACT TOPIC-WISE MCQ PRACTICE LINK (Directly Below GATEOverflow) */}
              <div className="pt-1.5 border-t border-slate-900">
                <a
                  href={exact?.mcqs?.url || "https://www.geeksforgeeks.org/gate-cs-notes-gq/"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/30 text-xs font-bold transition-all shadow-sm group"
                >
                  <Bookmark className="w-3.5 h-3.5 text-teal-400 group-hover:text-white" />
                  <span>Solve Exact Topic MCQs & Quiz ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* PRIORITY 4: REMAINING SUBTOPICS */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Syllabus Scope & Subtopics
            </h4>
            <ul className="space-y-1.5">
              {subtopicsList.map((sub, i) => (
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

          {/* Task Execution Sequence */}
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

        {/* PRIORITY 5: FULL DAY VIEW & AI COACH LAUNCHERS */}
        <div className="pt-6 border-t border-slate-800 mt-6 space-y-2">
          <Link
            href={`/?day=${day.dayNumber}`}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Open Day {day.dayNumber} Full View ↗
          </Link>
          <Link
            href={`/ai?day=${day.dayNumber}&subject=${encodeURIComponent(day.subject)}&topic=${encodeURIComponent(day.topic)}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Bot className="w-4 h-4 text-indigo-400" /> Ask AI Study Coach About Day {day.dayNumber}
          </Link>
        </div>
      </div>
    </div>
  );
};
