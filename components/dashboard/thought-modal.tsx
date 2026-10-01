"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Lightbulb, Sparkles, X, ArrowRight, CheckCircle2 } from "lucide-react";
import GlassSurface from "@/components/ui/GlassSurface";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Ambient Dark Backdrop */}
      <div
        className="fixed inset-0 bg-[#01140e]/75 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Static Dark Green & Shining Gold Ambient Radiance Behind Modal */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#022c22]/30 blur-[100px] pointer-events-none -top-16 -left-16" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#d4af37]/25 blur-[100px] pointer-events-none -bottom-16 -right-16" />

      {/* React Bits GlassSurface Modal Card - Cinematic Full View */}
      <GlassSurface
        borderRadius={32}
        className="relative w-full max-w-2xl p-7 sm:p-10 shadow-[0_25px_80px_rgba(2,44,34,0.4)] space-y-7 z-10 animate-fade-in-up border border-white/95"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 transition-all border border-slate-200/80 shadow-xs cursor-pointer hover:scale-105 z-20"
          title="Close Popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Glowing Gold & Dark Green Icon */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-3xl metallic-shining-gold-btn text-[#022018] shadow-xl ring-4 ring-[#022c22]/20 shrink-0">
            <Lightbulb className="w-7 h-7 fill-current text-[#022018] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full metallic-dark-green-btn text-[#fef9c3] border-amber-400/80 shadow-xs font-mono">
                Day {dayNumber} of 90 Mindset
              </span>
              <span className="text-xs font-black text-[#451a03] bg-amber-200/90 px-2.5 py-0.5 rounded-lg border border-amber-400">
                {thought.tag}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#022018] mt-1.5 tracking-tight">
              Daily GATE Aspirant Mindset & Directive
            </h3>
          </div>
        </div>

        {/* Big Thought Card - Liquid Glass with Gold Reflections */}
        <div className="relative overflow-hidden luxury-glass-gold rounded-3xl p-6 sm:p-8 space-y-4 border border-amber-400/80 shadow-md">
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-400/25 to-transparent rounded-full pointer-events-none" />
          <div className="text-3xl text-amber-600/40 font-serif leading-none select-none">“</div>
          <p className="text-lg sm:text-2xl font-black text-[#022018] italic leading-relaxed relative z-10 -mt-3">
            {thought.thought}
          </p>
          <div className="flex items-center justify-between text-xs sm:text-sm pt-4 border-t border-amber-400/60 relative z-10">
            <span className="text-amber-950 font-black">
              — {thought.author}
            </span>
            <span className="text-[#022c22] font-mono font-black flex items-center gap-1.5 text-xs bg-white/80 px-3 py-1 rounded-full border border-amber-300">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" /> Focus First
            </span>
          </div>
        </div>

        {/* Actionable Guideline for Today */}
        <div className="luxury-glass-dark-green rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-slate-900 border border-[#064e3b]/50 shadow-xs">
          <div className="p-2.5 rounded-xl metallic-dark-green-btn text-[#fef9c3] shrink-0 mt-0.5 shadow-md shadow-[#022c22]/40">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-black text-[#022c22] block text-xs sm:text-sm tracking-wide">
              Today&apos;s Non-Negotiable Standard
            </span>
            <p className="leading-relaxed text-slate-800 text-xs sm:text-[13px] font-medium">
              Complete the exact theory video, solve topic-level GATEOverflow questions, and log every mistake immediately in your Error Book.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-4 px-6 rounded-2xl metallic-dark-green-btn text-[#fef9c3] text-sm sm:text-base font-black shadow-xl shadow-[#022c22]/40 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <span>Let&apos;s Conquer Day {dayNumber} Mission ▶</span>
            <ArrowRight className="w-5 h-5 text-[#fef9c3]" />
          </button>
        </div>
      </GlassSurface>
    </div>
  );

  return createPortal(modalContent, document.body);
};
