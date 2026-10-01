"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  ExternalLink,
  Calendar,
  Bookmark,
} from "lucide-react";
import { getSubjects, getPlanDays } from "@/lib/data";
import GlassSurface from "@/components/ui/GlassSurface";

export default function SubjectsPage() {
  const subjects = getSubjects();
  const planDays = getPlanDays();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pt-4 pb-20 animate-fade-in-up text-slate-900">
      {/* Header Banner - Liquid GlassSurface */}
      <GlassSurface
        borderRadius={28}
        className="p-6 sm:p-8 shadow-xl space-y-3 relative overflow-hidden border border-white/95"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-amber-400/25 via-[#022c22]/20 to-transparent rounded-full pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-[#022c22] border border-emerald-300 font-mono">
            <Layers className="w-3.5 h-3.5 text-[#064e3b]" /> Official CS/IT Syllabus Tree
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#011c15] tracking-tight">
            12 Official GATE CS/IT Subject Areas
          </h1>
          <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
            Follow the non-negotiable dependency order: Programming & DSA first, then core systems (Digital Logic, COA, DBMS, OS, CN), followed by theoretical consolidation (TOC, Compiler, Engineering Math).
          </p>
        </div>
      </GlassSurface>

      {/* Subjects Grid - Unified Liquid GlassSurface Container */}
      <GlassSurface
        borderRadius={28}
        className="p-5 sm:p-7 shadow-xl border border-white/95"
      >
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
                className="p-6 luxury-glass-card rounded-2xl shadow-md flex flex-col justify-between space-y-5 hover:border-amber-400/90 hover:bg-white/70 transition-all border border-white/90 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl metallic-dark-green-btn text-[#fef9c3] font-black text-xs flex items-center justify-center border-amber-400/80 shadow-md">
                      {idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-[#fef9c3] text-[#451a03] border border-[#d4af37]/80 shadow-2xs">
                      {sub.weightageRange}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#011c15] group-hover:text-[#064e3b] transition-colors tracking-tight">
                      {sub.name}
                    </h3>
                    <span className="text-[11px] font-mono text-[#022c22] font-black block mt-0.5">
                      Code: <span className="text-[#064e3b] font-mono font-black">{sub.code}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-bold leading-relaxed">
                    {sub.description}
                  </p>

                  {/* Sub-metrics */}
                  <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/70 border border-white/90 rounded-xl p-2.5 shadow-2xs">
                      <span className="text-[10px] text-slate-700 font-bold block">Timetable</span>
                      <strong className="text-[#011c15] font-black">
                        {allocatedDays.length > 0 ? `${allocatedDays.length} Days` : "Integrated"}
                      </strong>
                    </div>
                    <div className="bg-white/70 border border-white/90 rounded-xl p-2.5 shadow-2xs">
                      <span className="text-[10px] text-slate-700 font-bold block">Allocated Hours</span>
                      <strong className="text-[#011c15] font-black">
                        {totalHours > 0 ? `${totalHours} hrs` : "Review"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-emerald-900/10">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/plan?subject=${encodeURIComponent(sub.name)}`}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl metallic-dark-green-btn text-[#fef9c3] border-amber-400/80 text-xs font-black shadow-md transition-all cursor-pointer hover:scale-102"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#fef9c3]" /> 90-Day Plan
                    </Link>
                    <Link
                      href={`/resources?query=${encodeURIComponent(sub.name)}`}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl metallic-shining-gold-btn text-[#011c15] text-xs font-black shadow-md transition-all cursor-pointer hover:scale-102"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#011c15]" /> Resources
                    </Link>
                  </div>

                  {sub.gateSmashersUrl && (
                    <a
                      href={sub.gateSmashersUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white text-[#011c15] hover:text-[#064e3b] transition-colors font-black text-[11px] border border-white/80 shadow-2xs"
                    >
                      <span>Gate Smashers Verified Roadmap</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#064e3b]" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassSurface>
    </div>
  );
}
