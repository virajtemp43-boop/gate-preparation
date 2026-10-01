"use client";

import React, { useState, useEffect } from "react";
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
  FileText,
  Sparkles,
  Calendar as CalendarIcon,
} from "lucide-react";
import { StudyDay } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getDayResourceMap, getPlanDays } from "@/lib/data";
import { PostponeModal } from "@/components/ai/postpone-modal";

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
  const [dayNotes, setDayNotes] = useState<{ [dayNumber: number]: string }>({});
  const [allDays, setAllDays] = useState<StudyDay[]>([]);
  const [isPostponeOpen, setIsPostponeOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gate_day_notes");
      if (saved) setDayNotes(JSON.parse(saved));

      const savedDays = localStorage.getItem("gate_study_days");
      if (savedDays) setAllDays(JSON.parse(savedDays));
      else setAllDays(getPlanDays());
    } catch (e) {
      console.warn("Could not read day notes or days in drawer", e);
    }
  }, []);

  const handleUpdateNote = (dayNum: number, text: string) => {
    const updated = { ...dayNotes, [dayNum]: text };
    setDayNotes(updated);
    try {
      localStorage.setItem("gate_day_notes", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save day notes in drawer", e);
    }
  };

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
      className="fixed inset-0 z-50 bg-slate-950/60 flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full luxury-glass border-l border-white/90 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* HEADER & TOPIC TITLE */}
          <div className="flex items-start justify-between border-b border-emerald-100/70 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs font-mono">
                  DAY {day.dayNumber} OF 90
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {formatDate(day.date)}
                </span>
                {day.isTestDay && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    TEST DAY
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsPostponeOpen(true)}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Postpone this day's date or reschedule"
                >
                  <CalendarIcon className="w-3 h-3 text-amber-700" />
                  <span>Postpone Date</span>
                </button>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {day.topic}
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Subject: <span className="text-emerald-700 font-bold">{day.subject}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="luxury-glass-card rounded-2xl p-3.5 border border-emerald-200/60">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Planned Time
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1 font-mono">
                {day.plannedHours} Hours
              </p>
            </div>
            <div className="luxury-glass-card rounded-2xl p-3.5 border border-emerald-200/60">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> PYQ Target
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1 font-mono">
                {day.pyqResource?.target || 15} PYQs
              </p>
            </div>
            <div className="luxury-glass-card rounded-2xl p-3.5 border border-emerald-200/60">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Bookmark className="w-3.5 h-3.5 text-amber-600" /> Scope
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1 font-mono">
                {subtopicsList.length} Concepts
              </p>
            </div>
          </div>

          {/* TODAY'S EXACT RESOURCES SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Today&apos;s Exact Resources
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Exact Topic Resolution
              </span>
            </div>

            {/* EXACT VIDEO CARD */}
            <div className="p-4 rounded-2xl luxury-glass border border-emerald-300/70 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Video className="w-3 h-3" /> Gate Smashers
                  </span>
                  {hasDirectVideo ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Verified Direct
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Topic Locator
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-emerald-600">VIDEO</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {videoTitle}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {hasDirectVideo
                    ? "Direct verified video lecture mapped to today's syllabus topic."
                    : "Curated Gate Smashers syllabus roadmap with exact YouTube search locator backup."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-100">
                <a
                  href={videoLocator?.directUrl || videoLocator?.roadmapUrl || day.learningResource?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold metallic-emerald-btn"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{hasDirectVideo ? "Watch exact lecture ▶" : "Open topic roadmap ↗"}</span>
                </a>

                {videoLocator?.searchFallbackUrl && (
                  <a
                    href={videoLocator.searchFallbackUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl luxury-glass-card hover:bg-white text-slate-800 text-xs font-bold border border-white/90 transition-all shadow-2xs"
                  >
                    <Search className="w-3 h-3 text-emerald-700" />
                    <span>Backup roadmap ↗</span>
                  </a>
                )}
              </div>
            </div>

            {/* EXACT PYQ & MCQ CARD */}
            <div className="p-4 rounded-2xl luxury-glass-gold border border-amber-300/70 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <FileQuestion className="w-3 h-3" /> GATEOverflow & MCQs
                </span>
                <span className="text-[10px] font-bold text-slate-700 font-mono">
                  {day.pyqResource?.target || 15} PYQs Target
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {pyqTitle}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Curated official GATE questions with full peer solutions, along with exact topic MCQs below.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-amber-200/80">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={pyqLocator?.url || day.pyqResource?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open exact topic PYQs ↗</span>
                  </a>
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl luxury-glass-card hover:bg-white text-slate-800 text-xs font-bold border border-white/90 transition-all shadow-2xs"
                  >
                    <span>IIT paper ↗</span>
                  </a>
                </div>

                {/* Exact Topic MCQs link directly below the GATEOverflow link */}
                <a
                  href={mcqUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl metallic-emerald-btn text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solve Exact Topic MCQs & Quiz ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* DAY NOTES SECTION */}
          <div className="space-y-2 p-3.5 rounded-2xl luxury-glass border border-amber-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1 font-mono">
                <FileText className="w-3.5 h-3.5 text-amber-600" /> Day {day.dayNumber} Notes & Traps
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">Auto-saved</span>
            </div>
            <textarea
              rows={2}
              value={dayNotes[day.dayNumber] || ""}
              onChange={(e) => handleUpdateNote(day.dayNumber, e.target.value)}
              placeholder="Add key formulas, tricky corner cases, and error traps..."
              className="w-full bg-white/80 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />
          </div>

          {/* SUBTOPICS SCOPE */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block font-mono">
              Syllabus Scope for Day {day.dayNumber}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {subtopicsList.map((sub, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl text-xs luxury-glass-card border border-white/90 text-slate-900 font-bold shadow-2xs"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* TASK CHECKLIST */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">
                Task Execution Sequence
              </span>
              <span className="text-xs font-mono text-emerald-800 font-black">
                {completedCount} / {tasks.length} Done ({progressPercent}%)
              </span>
            </div>

            <div className="space-y-1.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                    task.completed
                      ? "luxury-glass-emerald border-emerald-300/80 text-emerald-950 line-through opacity-80"
                      : "luxury-glass-card border-white/90 text-slate-950 font-bold shadow-2xs hover:border-emerald-400"
                  }`}
                >
                  <button
                    onClick={() => onToggleTask && onToggleTask(day.dayNumber, task.id)}
                    className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        task.completed ? "text-emerald-700" : "text-slate-400"
                      }`}
                    />
                    <span className={task.completed ? "opacity-75" : ""}>
                      {task.title} ({task.estMinutes}m)
                    </span>
                  </button>

                  {task.resourceUrl && (
                    <a
                      href={task.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/90 text-emerald-950 hover:bg-emerald-200 border border-emerald-300 text-[11px] font-black shrink-0 cursor-pointer shadow-2xs"
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

        {/* FULL DAY VIEW & AI COACH LAUNCHERS */}
        <div className="pt-6 border-t border-emerald-200/50 mt-6 space-y-2">
          <Link
            href={`/?day=${day.dayNumber}`}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl metallic-emerald-btn text-white text-xs font-black shadow-md cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Open Day {day.dayNumber} Full View ↗
          </Link>
          <Link
            href={`/ai?day=${day.dayNumber}&subject=${encodeURIComponent(day.subject)}&topic=${encodeURIComponent(day.topic)}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl luxury-glass-card hover:bg-white text-slate-900 text-xs font-extrabold border border-white/90 transition-all shadow-2xs cursor-pointer"
          >
            <Bot className="w-4 h-4 text-emerald-700" /> Ask AI Study Coach About Day {day.dayNumber}
          </Link>
        </div>
      </div>

      {/* Dynamic Date Postponement Modal */}
      {isPostponeOpen && day && (
        <PostponeModal
          isOpen={isPostponeOpen}
          onClose={() => setIsPostponeOpen(false)}
          day={day}
          allDays={allDays}
          onScheduleUpdated={(updatedDays) => {
            setAllDays(updatedDays);
            setIsPostponeOpen(false);
          }}
        />
      )}
    </div>
  );
};
