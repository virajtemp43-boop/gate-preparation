"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  ExternalLink,
  Calendar,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Bookmark,
} from "lucide-react";
import { getSubjects, getPlanDays } from "@/lib/data";

export default function SubjectsPage() {
  const subjects = getSubjects();
  const planDays = getPlanDays();

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
            <Layers className="w-3.5 h-3.5" /> Official CS/IT Syllabus Tree
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            12 Official GATE CS/IT Subject Areas
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Follow the non-negotiable dependency order: Programming & DSA first, then core systems (Digital Logic, COA, DBMS, OS, CN), followed by theoretical consolidation (TOC, Compiler, Engineering Math).
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub, idx) => {
          const allocatedDays = planDays.filter(
            (d) =>
              d.subject.toLowerCase().includes(sub.name.toLowerCase()) ||
              sub.name.toLowerCase().includes(d.subject.toLowerCase())
          );
          const totalHours = allocatedDays.reduce((sum, d) => sum + (d.plannedHours || 0), 0);

          return (
            <div
              key={sub.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                    {idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {sub.weightageRange}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {sub.name}
                  </h3>
                  <span className="text-[11px] font-mono text-indigo-400 block mt-0.5">
                    Code: {sub.code}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {sub.description}
                </p>

                {/* Sub-metrics */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-500 block">Timetable</span>
                    <strong className="text-slate-200">
                      {allocatedDays.length > 0 ? `${allocatedDays.length} Days` : "Integrated"}
                    </strong>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-500 block">Allocated Hours</span>
                    <strong className="text-slate-200">
                      {totalHours > 0 ? `${totalHours} hrs` : "Review"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/plan?subject=${encodeURIComponent(sub.name)}`}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" /> 90-Day Plan
                  </Link>
                  <Link
                    href={`/pyqs`}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> PYQs
                  </Link>
                </div>

                {sub.gateSmashersUrl && (
                  <a
                    href={sub.gateSmashersUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Gate Smashers Verified Roadmap</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
