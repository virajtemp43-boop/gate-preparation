"use client";

import React, { useState } from "react";
import {
  Bookmark,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Search,
} from "lucide-react";
import { getResources } from "@/lib/data";
import GlassSurface from "@/components/ui/GlassSurface";

export default function ResourcesPage() {
  const allResources = getResources();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");

  const providers = Array.from(new Set(allResources.map((r) => r.provider)));

  const filtered = allResources.filter((r) => {
    if (selectedType !== "all" && r.resource_type !== selectedType) return false;
    if (selectedProvider !== "all" && r.provider !== selectedProvider) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.title.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.short_description.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

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
            <Bookmark className="w-3.5 h-3.5 text-[#064e3b]" /> Central Resource Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#011c15] tracking-tight">
            Verified External Study Launchers
          </h1>
          <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
            Strictly curated external resources. Remember the <strong className="text-amber-800 font-black">Golden Rule</strong>: One Subject = One Consistent Learning Source. Do not switch between 4 teachers mid-preparation.
          </p>
        </div>
      </GlassSurface>

      {/* Golden Rule Notice - Liquid Glass Gold */}
      <GlassSurface
        borderRadius={20}
        className="luxury-glass-gold border border-amber-400/80 p-4 flex items-start gap-3 shadow-md"
      >
        <div className="p-2 rounded-xl bg-amber-200 text-[#451a03] shrink-0 border border-amber-300">
          <ShieldCheck className="w-4 h-4 text-[#451a03]" />
        </div>
        <div className="text-xs space-y-1">
          <span className="font-black text-[#3b1702] block text-sm">External Resource Launch Policy</span>
          <p className="text-[#3b1702] font-bold leading-relaxed">
            All theory and video lectures link directly to Gate Smashers or official IIT portals. All PYQ questions link to GATEOverflow discussion threads. Our platform coordinates your daily execution—it does not re-host pirated or duplicated course content.
          </p>
        </div>
      </GlassSurface>

      {/* Filter and Search Bar - Liquid GlassSurface */}
      <GlassSurface
        borderRadius={24}
        className="p-4 space-y-3 shadow-lg border border-white/95"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, subject, or provider (e.g., Gate Smashers, Pointers, IITM)..."
              className="w-full bg-white/90 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-[#011c15] placeholder:text-slate-500 font-bold focus:outline-none focus:border-amber-400 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#011c15] font-black">Provider:</span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-white/90 border border-slate-300 text-[#011c15] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 font-black cursor-pointer shadow-2xs"
            >
              <option value="all">All Providers</option>
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resource Type Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All Types" },
            { id: "learning", label: "Learning Roadmaps (Gate Smashers)" },
            { id: "pyq", label: "PYQs (GATEOverflow)" },
            { id: "official", label: "Official IIT Madras Portal" },
            { id: "mock_test", label: "Official CBT Mock Links" },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedType(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border transition-all cursor-pointer font-black ${
                selectedType === c.id
                  ? "metallic-dark-green-btn text-[#fef9c3] border-amber-400/80 shadow-md scale-102"
                  : "bg-white/70 hover:bg-white text-[#011c15] border-white/90 shadow-2xs"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </GlassSurface>

      {/* Resource Count Banner in High-Contrast Liquid Capsule */}
      <GlassSurface
        borderRadius={18}
        className="px-4 py-2.5 border border-white/95 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-md"
      >
        <span className="text-[#011c15] font-bold">
          Found <strong className="text-[#011c15] font-black text-sm">{filtered.length}</strong> verified learning resources
        </span>
        <span className="font-mono text-[#022c22] font-black flex items-center gap-1.5 bg-[#fef9c3] px-3 py-1 rounded-full border border-[#d4af37]/80 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#064e3b]" /> 100% External Links Operational
        </span>
      </GlassSurface>

      {/* Resource Cards Grid - Unified Liquid GlassSurface Container */}
      <GlassSurface
        borderRadius={28}
        className="p-5 sm:p-6 shadow-xl border border-white/95"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((res) => (
            <div
              key={res.resource_id}
              className="p-5 luxury-glass-card rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-400/90 hover:bg-white/70 transition-all border border-white/90 group shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-100 text-[#022c22] border border-emerald-300 shadow-2xs font-mono">
                    {res.provider}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300 uppercase shadow-2xs font-mono">
                      {res.free_or_paid}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-[#022c22] font-black bg-white/70 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-[#064e3b]" /> Verified
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#011c15] group-hover:text-[#064e3b] transition-colors">
                    {res.title}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-800 block mt-0.5">
                    Subject: <span className="text-[#022c22] font-black">{res.subject}</span> • Topic: <span className="text-[#022c22] font-black">{res.topic}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-800 font-bold leading-relaxed">
                  {res.short_description}
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-900/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-700 font-bold">
                  Verified: {res.last_verified_at}
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl metallic-dark-green-btn text-[#fef9c3] text-xs font-black shadow-md border-amber-400/80 transition-all hover:scale-102 cursor-pointer"
                >
                  <span>Open {res.provider}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </GlassSurface>
    </div>
  );
}
