"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Bot,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { StudyDay } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  postponeDay,
  resetScheduleToBaseline,
  PostponeMode,
  findNextBufferDay,
  addDaysToDateString,
  getPostponeAiAnalysis,
} from "@/lib/ai/postpone-engine";

interface PostponeModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: StudyDay;
  allDays: StudyDay[];
  onScheduleUpdated: (updatedDays: StudyDay[], message: string) => void;
}

export const PostponeModal: React.FC<PostponeModalProps> = ({
  isOpen,
  onClose,
  day,
  allDays,
  onScheduleUpdated,
}) => {
  const [mode, setMode] = useState<PostponeMode>("shift_all");
  const [daysShift, setDaysShift] = useState<number>(1);
  const [targetDate, setTargetDate] = useState<string>(
    addDaysToDateString(day.date, 1)
  );
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setTargetDate(addDaysToDateString(day.date, daysShift));
  }, [day.date, daysShift]);

  if (!isOpen) return null;

  const bufferDay = findNextBufferDay(allDays, day.dayNumber);

  // Dynamic live AI guidance based on selected mode
  const liveAiAdvice = getPostponeAiAnalysis(day, mode, daysShift, allDays);

  const handleConfirmPostpone = () => {
    setLoading(true);
    setTimeout(() => {
      const result = postponeDay(allDays, day.dayNumber, mode, {
        daysToShift: daysShift,
        targetDate: mode === "custom_date" ? targetDate : undefined,
      });

      setSuccessMessage(result.message);
      onScheduleUpdated(result.updatedDays, result.message);
      setLoading(false);

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1400);
    }, 200);
  };

  const handleResetSchedule = () => {
    if (confirm("Restore the entire 90-day timetable back to its original baseline dates?")) {
      const original = resetScheduleToBaseline();
      onScheduleUpdated(original, "Timetable restored to original 90-day baseline.");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#064e3b] text-[#fef9c3] border border-amber-400/80 flex items-center justify-center shadow-sm shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-100 text-amber-950 border border-amber-300">
                  DAY {day.dayNumber} OF 90
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {formatDate(day.date)}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                Postpone & Reschedule: {day.topic}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Postpone Strategy Selector */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider block">
            Select Postponement Strategy:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Strategy 1: Shift Sequential */}
            <button
              type="button"
              onClick={() => setMode("shift_all")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                mode === "shift_all"
                  ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#011c15]">
                  ⏩ Shift Schedule (+1 or +N Days)
                </span>
                {mode === "shift_all" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                )}
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-1 leading-relaxed">
                Moves Day {day.dayNumber} and pushes all subsequent days forward sequentially.
              </p>
            </button>

            {/* Strategy 2: Move to Buffer Day */}
            <button
              type="button"
              onClick={() => setMode("move_to_buffer")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                mode === "move_to_buffer"
                  ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#011c15]">
                  🔀 Move to Buffer Day
                </span>
                {mode === "move_to_buffer" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                )}
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-1 leading-relaxed">
                {bufferDay
                  ? `Absorbs this topic into Day ${bufferDay.dayNumber} Buffer without pushing the 90-day finish line.`
                  : "Moves topic to upcoming revision buffer block."}
              </p>
            </button>
          </div>

          {/* Detailed Configuration according to mode */}
          {mode === "shift_all" && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800">Days to shift forward:</span>
                <p className="text-[11px] text-slate-500 font-medium">
                  New scheduled date will be:{" "}
                  <strong className="text-emerald-900 font-black">
                    {formatDate(targetDate)}
                  </strong>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDaysShift(num)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      daysShift === num
                        ? "bg-[#064e3b] text-[#fef9c3] border border-amber-400 shadow-xs"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    +{num}d
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "move_to_buffer" && bufferDay && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-300 text-amber-950 text-xs font-medium space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Destination Buffer Day Identified:</span>
              </div>
              <p>
                <strong>Day {bufferDay.dayNumber}</strong> ({formatDate(bufferDay.date)}) — &quot;{bufferDay.topic}&quot;.
              </p>
              <p className="text-[11px] text-amber-800">
                Today becomes a rest/light buffer, and your full syllabus timetable maintains its original dates.
              </p>
            </div>
          )}
        </div>

        {/* Real-Time AI Live Guidance Box */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-[#022c22]">
            <Bot className="w-4 h-4 text-[#064e3b]" />
            <span>AI Real-Time Schedule Advisor:</span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            {liveAiAdvice}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResetSchedule}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-900 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Reset entire timetable to original dates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Timetable</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmPostpone}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#04382c] text-[#fef9c3] border border-amber-400/80 text-xs font-black shadow-md transition-all hover:scale-105 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <span>{loading ? "Updating Schedule..." : "Confirm Postponement"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostponeModal;
