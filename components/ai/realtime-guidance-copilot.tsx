"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Zap,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { StudyDay } from "@/lib/types";
import { getCurrentPlanDay, getPlanDays } from "@/lib/data";
import {
  getRealtimeAiGuidance,
  RealtimeGuidance,
} from "@/lib/ai/postpone-engine";
import { PostponeModal } from "@/components/ai/postpone-modal";
import Link from "next/link";

export const RealtimeGuidanceCopilot: React.FC = () => {
  const [allDays, setAllDays] = useState<StudyDay[]>([]);
  const [currentDay, setCurrentDay] = useState<StudyDay | null>(null);
  const [guidance, setGuidance] = useState<RealtimeGuidance | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isPostponeOpen, setIsPostponeOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"next_step" | "traps" | "time_adjust">("next_step");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadScheduleState = () => {
    try {
      let days = getPlanDays();
      const saved = localStorage.getItem("gate_study_days");
      if (saved) {
        days = JSON.parse(saved);
      }
      setAllDays(days);

      const planInfo = getCurrentPlanDay();
      const active =
        days.find((d) => d.dayNumber === planInfo.dayNumber) || days[0];
      setCurrentDay(active);

      const computedGuidance = getRealtimeAiGuidance(active, days);
      setGuidance(computedGuidance);
    } catch (e) {
      console.warn("Could not load schedule state for copilot", e);
    }
  };

  useEffect(() => {
    loadScheduleState();

    const handleScheduleUpdated = (e: any) => {
      loadScheduleState();
      if (e?.detail?.message) {
        showToast(e.detail.message);
      }
    };

    window.addEventListener("gate-schedule-updated", handleScheduleUpdated);
    return () => window.removeEventListener("gate-schedule-updated", handleScheduleUpdated);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScheduleUpdated = (updatedDays: StudyDay[], msg: string) => {
    setAllDays(updatedDays);
    if (currentDay) {
      const match = updatedDays.find((d) => d.dayNumber === currentDay.dayNumber) || updatedDays[0];
      setCurrentDay(match);
      setGuidance(getRealtimeAiGuidance(match, updatedDays));
    }
    showToast(msg);
  };

  if (!currentDay || !guidance) return null;

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#064e3b] text-[#fef9c3] border border-amber-400 text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Real-Time AI Copilot Bar */}
      <div className="fixed bottom-3 right-3 sm:right-6 z-40 max-w-[94vw] sm:max-w-xl">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-2.5 sm:p-3 transition-all duration-200">
          <div className="flex items-center justify-between gap-3">
            {/* Left: AI Indicator & Live Next Action */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2.5 text-left flex-1 min-w-0 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#064e3b] text-[#fef9c3] border border-amber-400/80 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-black text-[#064e3b] uppercase tracking-wider">
                    AI Real-Time Guide
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                    Day {currentDay.dayNumber}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {guidance.headline}
                </p>
              </div>
            </button>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsPostponeOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Postpone Date / Reschedule Schedule"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Postpone</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title={isExpanded ? "Collapse guidance" : "Expand guidance"}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded Tactical Panel */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("next_step")}
                  className={`flex-1 py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    activeTab === "next_step"
                      ? "bg-white text-slate-950 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🎯 Right Now
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("traps")}
                  className={`flex-1 py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    activeTab === "traps"
                      ? "bg-white text-slate-950 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ⚠️ Exam Traps
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("time_adjust")}
                  className={`flex-1 py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    activeTab === "time_adjust"
                      ? "bg-white text-slate-950 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ⏱️ Adjust Time
                </button>
              </div>

              {/* Tab Content: Right Now */}
              {activeTab === "next_step" && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-500 font-bold">
                        {currentDay.subject} → {currentDay.topic}
                      </span>
                      <span className="font-mono font-black text-emerald-800">
                        {guidance.completedCount}/{guidance.totalTasks} Tasks Done
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {guidance.actionText}
                    </p>
                    {guidance.nextTask && guidance.nextTask.resourceUrl && (
                      <div className="pt-1">
                        <a
                          href={guidance.nextTask.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-black text-[#064e3b] hover:underline"
                        >
                          <span>Open Resource for &quot;{guidance.nextTask.title}&quot;</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsPostponeOpen(true)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold text-center transition-colors cursor-pointer"
                    >
                      📅 Postpone This Date
                    </button>
                    <Link
                      href={`/ai?day=${currentDay.dayNumber}&subject=${encodeURIComponent(currentDay.subject)}&topic=${encodeURIComponent(currentDay.topic)}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#064e3b] hover:bg-[#04382c] text-[#fef9c3] border border-amber-400/80 text-xs font-black text-center transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask AI Coach</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Tab Content: Exam Traps */}
              {activeTab === "traps" && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Common GATE Traps in {currentDay.topic}:</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    {guidance.examTrap}
                  </p>
                </div>
              )}

              {/* Tab Content: Adjust Time */}
              {activeTab === "time_adjust" && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700 font-medium">
                    How many hours can you dedicate today? AI Coach will dynamically compress your workload:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[2, 3, 6].map((hrs) => (
                      <Link
                        key={hrs}
                        href={`/?day=${currentDay.dayNumber}&hours=${hrs}`}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-center transition-colors cursor-pointer"
                      >
                        <span className="block text-xs font-black text-slate-900 font-mono">
                          {hrs} Hours
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {hrs <= 2 ? "High Yield" : hrs === 3 ? "Core + PYQs" : "Full Standard"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Date Postponement Modal */}
      <PostponeModal
        isOpen={isPostponeOpen}
        onClose={() => setIsPostponeOpen(false)}
        day={currentDay}
        allDays={allDays}
        onScheduleUpdated={handleScheduleUpdated}
      />
    </>
  );
};

export default RealtimeGuidanceCopilot;
