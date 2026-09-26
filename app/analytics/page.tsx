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
import { getPlanDays, getSubjects, getRevisionCards } from "@/lib/data";
import { StudyDay, Subject } from "@/lib/types";

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
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
            <BarChart3 className="w-3.5 h-3.5" /> Quantitative Cockpit Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Preparation Health & Performance
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Never judge preparation by hours alone. Judge yourself using questions attempted, accuracy rate, repeated errors eliminated, and topics remaining.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-400" /> Syllabus Coverage
          </span>
          <div className="text-2xl font-extrabold text-white">{completionPercent}%</div>
          <span className="text-[11px] text-slate-400 font-mono">
            {completedDays} of {totalDays} Days Done
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> PYQ Accuracy Target
          </span>
          <div className="text-2xl font-extrabold text-white">75%</div>
          <span className="text-[11px] text-emerald-400 font-mono">Target for Top 100 Rank</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" /> Current Streak
          </span>
          <div className="text-2xl font-extrabold text-white">0 Days</div>
          <span className="text-[11px] text-amber-400 font-mono">Starts Oct 1 Kickoff</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Active Error Records
          </span>
          <div className="text-2xl font-extrabold text-white">{errorCount}</div>
          <span className="text-[11px] text-rose-400 font-mono">Tracked in Error Book</span>
        </div>
      </div>

      {/* Weak Area Detection Engine */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Rule-Based Weakness Detector
          </h3>
          <span className="text-xs text-slate-400 font-mono">Accuracy &lt; 60% or 2+ Repeated Mistakes</span>
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
              className="p-4 rounded-xl bg-slate-950/60 border border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-400 block">
                  {weak.subject}
                </span>
                <h4 className="text-xs font-bold text-white mt-0.5">{weak.topic}</h4>
                <p className="text-[11px] text-rose-300 mt-1">{weak.reason}</p>
              </div>

              <Link
                href="/learn"
                className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 text-xs font-semibold whitespace-nowrap self-start sm:self-auto transition-all"
              >
                Repair Concept →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
