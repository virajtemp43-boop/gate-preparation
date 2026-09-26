"use client";

import React, { useEffect } from "react";
import { Lightbulb, Sparkles, X, ArrowRight, Calendar, Target, CheckCircle2 } from "lucide-react";

interface ThoughtModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  thought: {
    dayNumber: number;
    thought: string;
    author: string;
    tag: string;
  };
}

export const ThoughtModal: React.FC<ThoughtModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  thought,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 z-10 animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          title="Close Popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Glowing Icon */}
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/25">
            <Lightbulb className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-mono">
                Day {dayNumber} Mindset
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {thought.tag}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Today&apos;s Daily GATE Aspirant Thought
            </h3>
          </div>
        </div>

        {/* Big Thought Card */}
        <div className="bg-gradient-to-br from-amber-50/60 via-slate-50 to-indigo-50/50 border border-amber-200/70 rounded-2xl p-5 sm:p-6 shadow-inner space-y-3">
          <p className="text-base sm:text-lg font-semibold text-slate-800 italic leading-relaxed">
            &ldquo;{thought.thought}&rdquo;
          </p>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200/40">
            <span className="text-slate-500 font-medium">
              — {thought.author}
            </span>
            <span className="text-indigo-600 font-mono font-semibold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 fill-indigo-600" /> Focus First
            </span>
          </div>
        </div>

        {/* Actionable Guideline for Today */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800 block">Today&apos;s Non-Negotiable Standard</span>
            <p>
              Complete the exact theory video, solve topic-level GATEOverflow questions, and log every mistake immediately in your Error Book.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full flex-1 py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
          >
            <span>Let&apos;s Conquer Day {dayNumber}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
