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
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fade-in-up">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-teal-50/40 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Bookmark className="w-3.5 h-3.5" /> Central Resource Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified External Study Launchers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Strictly curated external resources. Remember the <strong className="text-amber-700 font-bold">Golden Rule</strong>: One Subject = One Consistent Learning Source. Do not switch between 4 teachers mid-preparation.
          </p>
        </div>
      </div>

      {/* Golden Rule Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <span className="font-bold text-amber-900 block">External Resource Launch Policy</span>
          <p className="text-slate-700 leading-relaxed">
            All theory and video lectures link directly to Gate Smashers or official IIT portals. All PYQ questions link to GATEOverflow discussion threads. Our platform coordinates your daily execution—it does not re-host pirated or duplicated course content.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, subject, or provider (e.g., Gate Smashers, Pointers, IITM)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Provider:</span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-medium"
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
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Found <strong className="text-slate-800 font-semibold">{filtered.length}</strong> verified learning resources</span>
        <span className="font-mono text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> 100% External Links Operational
        </span>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => (
          <div
            key={res.resource_id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-400 hover:shadow-md transition-all group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {res.provider}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                    {res.free_or_paid}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {res.title}
                </h3>
                <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                  Subject: <span className="text-slate-700">{res.subject}</span> • Topic: <span className="text-slate-700">{res.topic}</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {res.short_description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                Verified: {res.last_verified_at}
              </span>
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102"
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
