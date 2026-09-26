"use client";

import React, { useState } from "react";
import {
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Search,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  Globe,
} from "lucide-react";
import { getResources } from "@/lib/data";
import { ResourceRegistryItem } from "@/lib/types";

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
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
            <Bookmark className="w-3.5 h-3.5" /> Central Resource Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Verified External Study Launchers
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Strictly curated external resources. Remember the <strong className="text-amber-400">Golden Rule</strong>: One Subject = One Consistent Learning Source. Do not switch between 4 teachers mid-preparation.
          </p>
        </div>
      </div>

      {/* Golden Rule Notice */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <span className="font-bold text-amber-300 block">External Resource Launch Policy</span>
          <p className="text-slate-300 leading-relaxed">
            All theory and video lectures link directly to Gate Smashers or official IIT portals. All PYQ questions link to GATEOverflow discussion threads. Our platform coordinates your daily execution—it does not re-host pirated or duplicated course content.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, subject, or provider (e.g., Gate Smashers, Pointers, IITM)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Provider:</span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                selectedType === c.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Found {filtered.length} verified learning resources</span>
        <span className="font-mono text-emerald-400">100% External Links Operational</span>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => (
          <div
            key={res.resource_id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                  {res.provider}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    {res.free_or_paid}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {res.title}
                </h3>
                <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                  Subject: {res.subject} • Topic: {res.topic}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {res.short_description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                Verified: {res.last_verified_at}
              </span>
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
              >
                <span>Open {res.provider}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
