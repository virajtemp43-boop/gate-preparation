"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  Folder,
  Plus,
  Bot,
  CheckCircle2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { ErrorBookEntry, MistakeCategory } from "@/lib/types";
import { MathText } from "@/components/ui/math-text";
import GlassSurface from "@/components/ui/GlassSurface";

const defaultFolders = [
  { id: "c-prog", code: "01_C_PROGRAMMING", name: "C Programming" },
  { id: "data-structures", code: "02_DATA_STRUCTURES", name: "Data Structures" },
  { id: "algorithms", code: "03_ALGORITHMS", name: "Algorithms" },
  { id: "discrete-math", code: "04_DISCRETE_MATH", name: "Discrete Math" },
  { id: "engg-math", code: "05_ENGINEERING_MATH", name: "Engineering Math" },
  { id: "digital-logic", code: "06_DIGITAL_LOGIC", name: "Digital Logic" },
  { id: "coa", code: "07_COA", name: "Computer Organization" },
  { id: "dbms", code: "08_DBMS", name: "Databases (DBMS)" },
  { id: "os", code: "09_OS", name: "Operating Systems" },
  { id: "cn", code: "10_CN", name: "Computer Networks" },
  { id: "toc", code: "11_TOC", name: "Theory of Computation" },
  { id: "compiler", code: "12_COMPILER", name: "Compiler Design" },
  { id: "aptitude", code: "13_GENERAL_APTITUDE", name: "General Aptitude" },
];

export default function ErrorBookPage() {
  const [entries, setEntries] = useState<ErrorBookEntry[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [formSubject, setFormSubject] = useState("c-prog");
  const [formTopic, setFormTopic] = useState("");
  const [formMistakeType, setFormMistakeType] = useState<MistakeCategory>("concept_gap");
  const [formUserAns, setFormUserAns] = useState("");
  const [formCorrectAns, setFormCorrectAns] = useState("");
  const [formWhyWrong, setFormWhyWrong] = useState("");
  const [formConceptMissed, setFormConceptMissed] = useState("");
  const [formShortcut, setFormShortcut] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gate_error_book");
      if (saved) {
        setEntries(JSON.parse(saved));
      } else {
        // Seed initial high-yield error record
        const sample: ErrorBookEntry[] = [
          {
            id: "err-seed-1",
            questionId: "sample-ptr-1",
            subjectId: "c-prog",
            subjectName: "C Programming",
            topic: "Pointer Operator Precedence",
            mistakeType: "reading_error",
            userAnswer: "11",
            correctAnswer: "10",
            whyWrong: "Confused `*p++` with `(*p)++`. I incremented the value stored at `p` instead of evaluating `*p` first.",
            correctConcept: "`*p++` has postfix `++` binding to pointer `p`, but expression yields old `*p`.",
            shortRule: "Always write `(*p)++` when you want value increment in C code questions.",
            timesRepeated: 1,
            nextRevisionDate: "2026-10-02",
            status: "unresolved",
            createdAt: new Date().toISOString(),
          },
          {
            id: "err-seed-2",
            questionId: "sample-cache-1",
            subjectId: "coa",
            subjectName: "Computer Organization",
            topic: "Set-Associative Tag Size",
            mistakeType: "formula_error",
            userAnswer: "14 bits",
            correctAnswer: "18 bits",
            whyWrong: "Calculated set bits using total cache size instead of dividing by K (4-way).",
            correctConcept: "Number of Sets = Total Lines / K, where Total Lines = Cache / Block.",
            shortRule: "Tag = Address - (log2(Sets) + log2(BlockSize)).",
            timesRepeated: 2,
            nextRevisionDate: "2026-10-04",
            status: "revising",
            createdAt: new Date().toISOString(),
          },
        ];
        setEntries(sample);
        localStorage.setItem("gate_error_book", JSON.stringify(sample));
      }
    } catch (e) {
      console.warn("Could not read error book", e);
    }
  }, []);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const folderObj = defaultFolders.find((f) => f.id === formSubject);

    const newEntry: ErrorBookEntry = {
      id: `err-${Date.now()}`,
      questionId: `q-${Date.now()}`,
      subjectId: formSubject,
      subjectName: folderObj?.name || "General",
      topic: formTopic || "Untitled Error",
      mistakeType: formMistakeType,
      userAnswer: formUserAns,
      correctAnswer: formCorrectAns,
      whyWrong: formWhyWrong,
      correctConcept: formConceptMissed,
      shortRule: formShortcut,
      timesRepeated: 1,
      nextRevisionDate: "2026-10-03",
      status: "unresolved",
      createdAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem("gate_error_book", JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }

    setModalOpen(false);
    setFormTopic("");
    setFormUserAns("");
    setFormCorrectAns("");
    setFormWhyWrong("");
    setFormConceptMissed("");
    setFormShortcut("");
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("gate_error_book", JSON.stringify(updated));
  };

  const handleToggleStatus = (id: string) => {
    const updated = entries.map((e) => {
      if (e.id !== id) return e;
      const nextStatus =
        e.status === "unresolved" ? "revising" : e.status === "revising" ? "mastered" : "unresolved";
      return { ...e, status: nextStatus as any };
    });
    setEntries(updated);
    localStorage.setItem("gate_error_book", JSON.stringify(updated));
  };

  const filteredEntries =
    selectedFolder === "all"
      ? entries
      : entries.filter((e) => e.subjectId === selectedFolder);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fade-in-up">
      {/* Header Banner - Liquid Glass */}
      <GlassSurface
        borderRadius={28}
        className="p-6 sm:p-8 shadow-xl space-y-3 relative overflow-hidden border border-white/95"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-amber-400/25 via-[#022c22]/20 to-transparent rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-950 border border-rose-300 shadow-2xs">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> 13-Subject Error Architecture
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#011c15] tracking-tight">
              Personal GATE Error Book
            </h1>
            <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
              Every repeated mistake must be diagnosed and transformed into actionable revision rules. If you make the same type of mistake three times, stop doing questions and repair the concept immediately!
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-2xl metallic-dark-green-btn text-[#fef9c3] border-amber-400/80 text-xs font-black shadow-md flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Log New Mistake
          </button>
        </div>
      </GlassSurface>

      {/* 13-Subject Folder Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedFolder("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap border flex items-center gap-2 transition-all cursor-pointer ${
            selectedFolder === "all"
              ? "metallic-emerald-btn text-white shadow-sm"
              : "luxury-glass-card text-slate-800 border-white/80 hover:text-emerald-950 hover:bg-white/80 shadow-2xs"
          }`}
        >
          <Folder className="w-3.5 h-3.5" /> All Mistakes ({entries.length})
        </button>

        {defaultFolders.map((f) => {
          const count = entries.filter((e) => e.subjectId === f.id).length;
          const isSelected = selectedFolder === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap border flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? "metallic-emerald-btn text-white shadow-sm"
                  : "luxury-glass-card text-slate-800 border-white/80 hover:text-emerald-950 hover:bg-white/80 shadow-2xs"
              }`}
            >
              <span>{f.code}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected
                      ? "bg-white/30 text-white border border-white/40"
                      : "bg-rose-100 text-rose-950 border border-rose-300"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error Records Stream - Optical Liquid Glass Lens Cards */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="luxury-glass border border-white/90 rounded-3xl p-12 text-center space-y-3 shadow-md">
            <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-black text-slate-950">No mistakes recorded in this category yet!</h3>
            <p className="text-xs text-slate-700 max-w-sm mx-auto font-medium">
              Solve PYQs and fresh practice questions. Any mistake you log will appear here for systematic spaced repair.
            </p>
          </div>
        ) : (
          filteredEntries.map((err) => (
            <GlassSurface
              key={err.id}
              borderRadius={24}
              className="p-5 sm:p-6 shadow-xl space-y-4 hover:border-amber-400/90 transition-all border border-white/95"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/10 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-emerald-100 text-[#022c22] border border-emerald-300 shadow-2xs font-mono">
                    {err.subjectName}
                  </span>
                  <span className="text-sm font-black text-[#011c15]">{err.topic}</span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-rose-100 text-rose-950 border border-rose-300 shadow-2xs">
                    {err.mistakeType.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(err.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer shadow-2xs ${
                      err.status === "mastered"
                        ? "metallic-dark-green-btn text-[#fef9c3] border-amber-400/80"
                        : err.status === "revising"
                        ? "metallic-shining-gold-btn text-[#011c15]"
                        : "bg-rose-100 text-rose-950 border-rose-300"
                    }`}
                  >
                    Status: {err.status.toUpperCase()}
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(err.id)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-700 hover:bg-rose-50/60 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Diagnosis Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/70 border border-rose-300/80 space-y-1 shadow-2xs">
                  <span className="font-black text-rose-950 block">My Submitted Answer:</span>
                  <p className="text-[#011c15] font-mono font-black">{err.userAnswer || "N/A"}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/70 border border-emerald-300/80 space-y-1 shadow-2xs">
                  <span className="font-black text-[#022c22] block">Correct GATE Answer:</span>
                  <p className="text-[#011c15] font-mono font-black">{err.correctAnswer || "N/A"}</p>
                </div>
              </div>

              {/* Analysis Text */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-800 leading-relaxed font-bold">
                  <strong className="text-[#011c15] font-black">Why I Was Wrong: </strong>
                  <MathText content={err.whyWrong} inline />
                </div>
                <div className="text-slate-800 leading-relaxed font-bold">
                  <strong className="text-[#011c15] font-black">Concept Missed: </strong>
                  <MathText content={err.correctConcept || err.conceptMissed || ""} inline />
                </div>
                {err.shortRule && (
                  <div className="p-3.5 rounded-2xl luxury-glass-gold border border-amber-400/80 text-[#3b1702] shadow-2xs leading-relaxed font-bold">
                    <strong className="text-[#3b1702] font-black mr-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 inline" /> Golden Shortcut / Rule:
                    </strong>
                    <MathText content={err.shortRule} inline />
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex items-center justify-between border-t border-emerald-900/10">
                <span className="text-[10px] font-mono text-slate-700 font-bold">
                  Logged: {err.createdAt.slice(0, 10)}
                </span>
                <Link
                  href={`/ai?subject=${encodeURIComponent(err.subjectName || err.subject || "")}&topic=${encodeURIComponent(err.topic || err.questionTopic || "")}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl metallic-dark-green-btn text-[#fef9c3] border-amber-400/80 text-xs font-black transition-all shadow-md cursor-pointer hover:scale-102"
                >
                  <Bot className="w-3.5 h-3.5" /> Ask AI Coach About This
                </Link>
              </div>
            </GlassSurface>
          ))
        )}
      </div>

      {/* Manual Entry Modal - Full Liquid Glass Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="luxury-glass border border-white/95 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-emerald-200/50 pb-3">
              <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" /> Log Mistake into Error Book
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/80 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Subject Folder:</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full bg-white/90 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:border-emerald-500 font-bold shadow-2xs"
                  >
                    {defaultFolders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Mistake Category:</label>
                  <select
                    value={formMistakeType}
                    onChange={(e) => setFormMistakeType(e.target.value as any)}
                    className="w-full bg-white/90 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:border-emerald-500 font-bold shadow-2xs"
                  >
                    <option value="concept_gap">Concept Gap</option>
                    <option value="formula_error">Formula Error</option>
                    <option value="calculation_error">Calculation Error</option>
                    <option value="reading_error">Reading / Trick Error</option>
                    <option value="guessing_error">Guessing Error</option>
                    <option value="time_pressure_error">Time Pressure Error</option>
                    <option value="careless_error">Careless Error</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Topic Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Cache Mapping Tag calculation"
                  required
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  className="w-full bg-white/90 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:border-emerald-500 font-bold shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">My Submitted Answer:</label>
                  <input
                    type="text"
                    placeholder="e.g. Option B or 14"
                    value={formUserAns}
                    onChange={(e) => setFormUserAns(e.target.value)}
                    className="w-full bg-white/90 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:border-emerald-500 font-bold shadow-2xs"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Correct Answer:</label>
                  <input
                    type="text"
                    placeholder="e.g. Option D or 18"
                    value={formCorrectAns}
                    onChange={(e) => setFormCorrectAns(e.target.value)}
                    className="w-full bg-white/90 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:border-emerald-500 font-bold shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Why I Was Wrong:</label>
                <textarea
                  rows={2}
                  placeholder="What false assumption did you make?"
                  value={formWhyWrong}
                  onChange={(e) => setFormWhyWrong(e.target.value)}
                  className="w-full bg-white/90 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:border-emerald-500 font-bold shadow-2xs"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Concept I Missed:</label>
                <textarea
                  rows={2}
                  placeholder="The governing rule or definition you need to remember."
                  value={formConceptMissed}
                  onChange={(e) => setFormConceptMissed(e.target.value)}
                  className="w-full bg-white/90 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:border-emerald-500 font-bold shadow-2xs"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Shortcut / Observation:</label>
                <input
                  type="text"
                  placeholder="One memorable line to prevent repeating this."
                  value={formShortcut}
                  onChange={(e) => setFormShortcut(e.target.value)}
                  className="w-full bg-white/90 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:border-emerald-500 font-bold shadow-2xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/70 text-slate-700 hover:bg-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl metallic-emerald-btn text-white font-black shadow-md cursor-pointer"
                >
                  Save to Error Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
