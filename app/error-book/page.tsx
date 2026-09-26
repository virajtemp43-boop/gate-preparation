"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  AlertTriangle,
  Folder,
  Plus,
  Bot,
  CheckCircle2,
  Trash2,
  Filter,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { ErrorBookEntry, MistakeCategory } from "@/lib/types";
import { MathText } from "@/components/ui/math-text";

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
    if (!formTopic.trim()) return;

    const folderObj = defaultFolders.find((f) => f.id === formSubject) || defaultFolders[0];

    const newEntry: ErrorBookEntry = {
      id: `err-${Date.now()}`,
      questionId: `manual-${Date.now()}`,
      subjectId: folderObj.id,
      subjectName: folderObj.name,
      topic: formTopic,
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
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/60 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-600/30 text-rose-300 border border-rose-500/40">
              <AlertOctagon className="w-3.5 h-3.5" /> 13-Subject Error Architecture
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personal GATE Error Book
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every repeated mistake must be diagnosed and transformed into actionable revision rules. If you make the same type of mistake three times, stop doing questions and repair the concept immediately!
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Log New Mistake
          </button>
        </div>
      </div>

      {/* 13-Subject Folder Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedFolder("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border flex items-center gap-1.5 transition-all ${
            selectedFolder === "all"
              ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Folder className="w-3.5 h-3.5" /> All Mistakes ({entries.length})
        </button>

        {defaultFolders.map((f) => {
          const count = entries.filter((e) => e.subjectId === f.id).length;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border flex items-center gap-1.5 transition-all ${
                selectedFolder === f.id
                  ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{f.code}</span>
              {count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/30 text-rose-300 font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error Records Stream */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No mistakes recorded in this category yet!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Solve PYQs and fresh practice questions. Any mistake you log will appear here for systematic spaced repair.
            </p>
          </div>
        ) : (
          filteredEntries.map((err) => (
            <div
              key={err.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                    {err.subjectName}
                  </span>
                  <span className="text-sm font-bold text-white">{err.topic}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {err.mistakeType.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(err.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      err.status === "mastered"
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-800"
                        : err.status === "revising"
                        ? "bg-amber-950/40 text-amber-400 border-amber-800"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    Status: {err.status.toUpperCase()}
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(err.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Diagnosis Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-rose-400 block">My Submitted Answer:</span>
                  <p className="text-slate-200 font-mono">{err.userAnswer || "N/A"}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-emerald-400 block">Correct GATE Answer:</span>
                  <p className="text-slate-200 font-mono">{err.correctAnswer || "N/A"}</p>
                </div>
              </div>

              {/* Analysis Text */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-300">
                  <strong className="text-slate-200">Why I Was Wrong: </strong>
                  <MathText content={err.whyWrong} inline />
                </div>
                <div className="text-slate-300">
                  <strong className="text-slate-200">Concept Missed: </strong>
                  <MathText content={err.correctConcept || err.conceptMissed || ""} inline />
                </div>
                {err.shortRule && (
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-indigo-200">
                    <strong className="text-indigo-400 mr-1">Golden Shortcut / Rule:</strong>
                    <MathText content={err.shortRule} inline />
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Logged: {err.createdAt.slice(0, 10)}
                </span>
                <Link
                  href={`/ai?subject=${encodeURIComponent(err.subjectName || err.subject || "")}&topic=${encodeURIComponent(err.topic || err.questionTopic || "")}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all"
                >
                  <Bot className="w-3.5 h-3.5" /> Teach Me This Mistake Again
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Entry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-500" /> Log Mistake into Error Book
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Subject Folder:</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    {defaultFolders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Mistake Category:</label>
                  <select
                    value={formMistakeType}
                    onChange={(e) => setFormMistakeType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
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
                <label className="font-semibold text-slate-300 block mb-1">Topic Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Cache Mapping Tag calculation"
                  required
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">My Submitted Answer:</label>
                  <input
                    type="text"
                    placeholder="e.g. Option B or 14"
                    value={formUserAns}
                    onChange={(e) => setFormUserAns(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Correct Answer:</label>
                  <input
                    type="text"
                    placeholder="e.g. Option D or 18"
                    value={formCorrectAns}
                    onChange={(e) => setFormCorrectAns(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Why I Was Wrong:</label>
                <textarea
                  rows={2}
                  placeholder="What false assumption did you make?"
                  value={formWhyWrong}
                  onChange={(e) => setFormWhyWrong(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Concept I Missed:</label>
                <textarea
                  rows={2}
                  placeholder="The governing rule or definition you need to remember."
                  value={formConceptMissed}
                  onChange={(e) => setFormConceptMissed(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Shortcut / Observation:</label>
                <input
                  type="text"
                  placeholder="One memorable line to prevent repeating this."
                  value={formShortcut}
                  onChange={(e) => setFormShortcut(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold"
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
