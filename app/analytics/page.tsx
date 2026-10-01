"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
} from "lucide-react";
import { getPlanDays } from "@/lib/data";
import { StudyDay } from "@/lib/types";
import GlassSurface from "@/components/ui/GlassSurface";

export default function AnalyticsPage() {
  const [days, setDays] = useState<StudyDay[]>([]);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    try {
      const savedDays = localStorage.getItem("gate_study_days");
      if (savedDays) {
        setDays(JSON.parse(savedDays));
      } else {
        setDays(getPlanDays());
      }

      const savedErrors = localStorage.getItem("gate_error_book");
      if (savedErrors) {
        setErrorCount(JSON.parse(savedErrors).length);
      }
    } catch {
      setDays(getPlanDays());
    }
  }, []);

  const totalDays = days.length || 90;
  const completedDays = days.filter(
    (d) => d.status === "completed" || (d.tasks && d.tasks.length > 0 && d.tasks.every((c) => c.completed))
  ).length;
  const completionPercent = Math.round((completedDays / totalDays) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-fade-in-up text-slate-900">
      {/* Header Banner - Liquid Glass */}
      <GlassSurface
        borderRadius={28}
        className="p-6 sm:p-8 shadow-xl space-y-3 relative overflow-hidden border border-white/95"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-amber-400/25 via-[#022c22]/20 to-transparent rounded-full pointer-events-none" />
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-[#022c22] border border-emerald-300 font-mono">
            <BarChart3 className="w-3.5 h-3.5 text-[#064e3b]" /> Quantitative Cockpit Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#011c15] tracking-tight">
            Preparation Health & Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
            Never judge preparation by hours alone. Judge yourself using questions attempted, accuracy rate, repeated errors eliminated, and topics remaining.
          </p>
        </div>
      </GlassSurface>

      {/* Top 4 KPI Metrics - Optical Liquid GlassSurface */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassSurface
          borderRadius={24}
          className="p-5 sm:p-6 shadow-xl space-y-2 border border-white/95 hover:border-amber-400 transition-all"
        >
          <span className="text-xs text-slate-800 font-black flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#064e3b]" /> Syllabus Coverage
          </span>
          <div className="text-3xl font-black text-[#011c15]">{completionPercent}%</div>
          <span className="text-[11px] text-slate-800 font-mono font-bold block">
            {completedDays} of {totalDays} Days Done
          </span>
        </GlassSurface>

        <GlassSurface
          borderRadius={24}
          className="p-5 sm:p-6 shadow-xl space-y-2 border border-white/95 hover:border-amber-400 transition-all"
        >
          <span className="text-xs text-slate-800 font-black flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#064e3b]" /> PYQ Accuracy Target
          </span>
          <div className="text-3xl font-black text-[#064e3b]">75%</div>
          <span className="text-[11px] text-[#022c22] font-mono font-bold block">
            Target for Top 100 Rank
          </span>
        </GlassSurface>

        <GlassSurface
          borderRadius={24}
          className="p-5 sm:p-6 shadow-xl space-y-2 border border-white/95 hover:border-amber-400 transition-all"
        >
          <span className="text-xs text-slate-800 font-black flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-600" /> Current Streak
          </span>
          <div className="text-3xl font-black text-[#011c15]">0 Days</div>
          <span className="text-[11px] text-amber-900 font-mono font-bold block">
            Starts Oct 1 Kickoff
          </span>
        </GlassSurface>

        <GlassSurface
          borderRadius={24}
          className="p-5 sm:p-6 shadow-xl space-y-2 border border-white/95 hover:border-amber-400 transition-all"
        >
          <span className="text-xs text-slate-800 font-black flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Active Error Records
          </span>
          <div className="text-3xl font-black text-[#011c15]">{errorCount}</div>
          <span className="text-[11px] text-rose-950 font-mono font-bold block">
            Tracked in Error Book
          </span>
        </GlassSurface>
      </div>

      {/* Weak Area Detection Engine - Liquid Glass */}
      <GlassSurface
        borderRadius={28}
        className="p-6 sm:p-7 shadow-xl space-y-4 border border-white/95"
      >
        <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
          <h3 className="text-sm font-black text-[#011c15] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Rule-Based Weakness Detector
          </h3>
          <span className="text-xs text-slate-800 font-mono font-bold">Accuracy &lt; 60% or 2+ Repeated Mistakes</span>
        </div>

        <div className="space-y-3">
          {[
            {
              subject: "Computer Organization & Architecture",
              topic: "Set-Associative Tag Size & AMAT",
              reason: "2 repeated mistakes recorded in Error Book",
              action: "Re-solve Worked Examples & review AMAT formulas",
            },
            {
              subject: "C Programming",
              topic: "Pointer Operator Precedence (*p++)",
              reason: "Reading trap flagged in Practice Lab",
              action: "Review C Pointers Beginner Lesson",
            },
          ].map((weak, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/70 border border-rose-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#022c22] block font-mono">
                  {weak.subject}
                </span>
                <h4 className="text-xs font-black text-[#011c15] mt-0.5">{weak.topic}</h4>
                <p className="text-[11px] text-rose-950 mt-1 font-bold">{weak.reason}</p>
              </div>

              <Link
                href={`/resources?query=${encodeURIComponent(weak.subject)}`}
                className="px-4 py-2 rounded-xl metallic-dark-green-btn text-[#fef9c3] border-amber-400/80 text-xs font-black whitespace-nowrap self-start sm:self-auto transition-all shadow-md cursor-pointer hover:scale-102"
              >
                Find Resources ↗
              </Link>
            </div>
          ))}
        </div>
      </GlassSurface>
    </div>
  );
}
