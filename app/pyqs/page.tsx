"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertOctagon,
  Clock,
  TrendingUp,
  Filter,
  Trash2,
  Sparkles,
  BookOpen,
  Bookmark,
} from "lucide-react";
import { getSubjects } from "@/lib/data";
import { PyqAttemptLog, ConfidenceLevel, ErrorBookEntry } from "@/lib/types";

// High-yield GATEOverflow topic links per subject
const gateOverflowTopics = [
  {
    subject: "Programming & Data Structures",
    topics: [
      { name: "C Pointers, Recursion & Scope", url: "https://gateoverflow.in/questions?sort=gate&tag=c-programming" },
      { name: "Trees, BST & AVL Balance", url: "https://gateoverflow.in/questions?sort=gate&tag=binary-search-tree" },
      { name: "Stacks, Queues & Arrays", url: "https://gateoverflow.in/questions?sort=gate&tag=data-structures" },
    ],
  },
  {
    subject: "Algorithms",
    topics: [
      { name: "Asymptotics & Recurrences", url: "https://gateoverflow.in/questions?sort=gate&tag=recurrence-relations" },
      { name: "Dynamic Programming & Greedy", url: "https://gateoverflow.in/questions?sort=gate&tag=dynamic-programming" },
      { name: "Graph Algorithms (BFS/DFS/Dijkstra)", url: "https://gateoverflow.in/questions?sort=gate&tag=graph-algorithms" },
    ],
  },
  {
    subject: "Operating Systems",
    topics: [
      { name: "CPU Scheduling & Semaphores", url: "https://gateoverflow.in/questions?sort=gate&tag=process-synchronization" },
      { name: "Virtual Memory & Paging", url: "https://gateoverflow.in/questions?sort=gate&tag=virtual-memory" },
      { name: "Deadlock Detection & Banker's", url: "https://gateoverflow.in/questions?sort=gate&tag=deadlock" },
    ],
  },
  {
    subject: "Databases (DBMS)",
    topics: [
      { name: "Normalization (3NF / BCNF / FDs)", url: "https://gateoverflow.in/questions?sort=gate&tag=normalization" },
      { name: "Transactions & Concurrency (2PL)", url: "https://gateoverflow.in/questions?sort=gate&tag=concurrency-control" },
      { name: "Relational Algebra & SQL", url: "https://gateoverflow.in/questions?sort=gate&tag=relational-algebra" },
    ],
  },
  {
    subject: "Computer Networks",
    topics: [
      { name: "TCP Sliding Window & Flow Control", url: "https://gateoverflow.in/questions?sort=gate&tag=sliding-window-protocol" },
      { name: "IPv4 Subnetting & CIDR", url: "https://gateoverflow.in/questions?sort=gate&tag=ip-addressing" },
      { name: "Routing Protocols & Congestion", url: "https://gateoverflow.in/questions?sort=gate&tag=routing-algorithms" },
    ],
  },
  {
    subject: "Theory of Computation",
    topics: [
      { name: "Regular Languages & DFA Minimization", url: "https://gateoverflow.in/questions?sort=gate&tag=regular-languages" },
      { name: "Context-Free Grammars & PDA", url: "https://gateoverflow.in/questions?sort=gate&tag=context-free-languages" },
      { name: "Decidability & Halting Problem", url: "https://gateoverflow.in/questions?sort=gate&tag=decidability" },
    ],
  },
  {
    subject: "Computer Organization (COA)",
    topics: [
      { name: "Cache Memory & Mapping", url: "https://gateoverflow.in/questions?sort=gate&tag=cache-memory" },
      { name: "Pipelining & Hazards", url: "https://gateoverflow.in/questions?sort=gate&tag=pipeline" },
      { name: "Instruction Formats & Addressing", url: "https://gateoverflow.in/questions?sort=gate&tag=instruction-set-architecture" },
    ],
  },
  {
    subject: "Discrete Mathematics",
    topics: [
      { name: "Propositional & First-Order Logic", url: "https://gateoverflow.in/questions?sort=gate&tag=propositional-logic" },
      { name: "Graph Theory (Euler, Hamiltonian)", url: "https://gateoverflow.in/questions?sort=gate&tag=graph-theory" },
      { name: "Combinatorics & Generating Functions", url: "https://gateoverflow.in/questions?sort=gate&tag=combinatorics" },
    ],
  },
];

export default function PyqsPage() {
  const subjects = getSubjects();
  const [logs, setLogs] = useState<PyqAttemptLog[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State
  const [subject, setSubject] = useState(subjects[0]?.name || "Programming & Data Structures");
  const [topic, setTopic] = useState("");
  const [attempted, setAttempted] = useState<number>(10);
  const [correct, setCorrect] = useState<number>(8);
  const [minutes, setMinutes] = useState<number>(30);
  const [sourceUrl, setSourceUrl] = useState("https://gateoverflow.in/questions?sort=gate");
  const [confidence, setConfidence] = useState<ConfidenceLevel>("B");
  const [notes, setNotes] = useState("");
  const [promptErrorBook, setPromptErrorBook] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gate_pyq_logs");
      if (saved) {
        setLogs(JSON.parse(saved));
      } else {
        // Seed initial sample session
        const initial: PyqAttemptLog[] = [
          {
            id: "pyq-seed-1",
            subject: "Programming & Data Structures",
            topic: "Pointer Arithmetic & Array Addressing",
            sourceUrl: "https://gateoverflow.in/questions?sort=gate&tag=c-programming",
            attempted: 15,
            correct: 12,
            confidence: "B",
            notes: "Need to review 2D pointer decay and double dereference.",
            date: "2026-09-25",
          },
          {
            id: "pyq-seed-2",
            subject: "Computer Organization (COA)",
            topic: "Direct vs Set-Associative Cache Misses",
            sourceUrl: "https://gateoverflow.in/questions?sort=gate&tag=cache-memory",
            attempted: 12,
            correct: 8,
            confidence: "C",
            notes: "Tag bit formula confusion on 4-way set associative questions.",
            date: "2026-09-24",
          },
        ];
        setLogs(initial);
        localStorage.setItem("gate_pyq_logs", JSON.stringify(initial));
      }
    } catch {
      // ignore
    }
  }, []);

  const totalAttempted = logs.reduce((sum, l) => sum + (l.attempted || 0), 0);
  const totalCorrect = logs.reduce((sum, l) => sum + (l.correct || 0), 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const handleConfidenceChange = (val: ConfidenceLevel) => {
    setConfidence(val);
    if (val === "C" || val === "D") {
      setPromptErrorBook(true);
    } else {
      setPromptErrorBook(false);
    }
  };

  const handleSaveLog = () => {
    const newLog: PyqAttemptLog = {
      id: `pyq-${Date.now()}`,
      subject,
      topic: topic.trim() || "General Topic Practice",
      attempted: Number(attempted) || 0,
      correct: Number(correct) || 0,
      confidence,
      sourceUrl: sourceUrl.trim() || "https://gateoverflow.in/questions?sort=gate",
      notes: notes.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem("gate_pyq_logs", JSON.stringify(updated));

    // If rated C or D and user requested, log to Error Book
    if (promptErrorBook) {
      try {
        const errorSaved = localStorage.getItem("gate_error_book");
        const errorList: ErrorBookEntry[] = errorSaved ? JSON.parse(errorSaved) : [];
        const newError: ErrorBookEntry = {
          id: `err-${Date.now()}`,
          subject,
          topic: topic.trim() || "PYQ Practice Mistake",
          mistakeType: confidence === "D" ? "concept_gap" : "calculation_error",
          userAnswer: "Logged from PYQ Session",
          correctAnswer: "Refer to GATEOverflow solution thread",
          whyWrong: notes.trim() || "Struggled with concept during timed practice.",
          conceptMissed: "Review foundational theory & boundary test cases.",
          shortRule: "Re-solve original GATEOverflow question before exam week.",
          reviewDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          timesRepeated: 1,
          status: "unresolved",
          createdAt: new Date().toISOString(),
        };
        errorList.push(newError);
        localStorage.setItem("gate_error_book", JSON.stringify(errorList));
      } catch (e) {
        console.warn(e);
      }
    }

    setIsLogModalOpen(false);
    setTopic("");
    setNotes("");
    setPromptErrorBook(false);
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    localStorage.setItem("gate_pyq_logs", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
              <HelpCircle className="w-3.5 h-3.5" /> GATEOverflow Direct Companion
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Previous Year Questions (PYQ) Tracker
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never re-host or memorize stale static questions. Solve real discussions on <strong>GATEOverflow</strong>, then log your session metrics, confidence rating (A/B/C/D), and auto-push tricky questions into your <strong>Error Book</strong>.
            </p>
          </div>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log PYQ Session</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 block font-medium">Total Attempted</span>
          <span className="text-2xl font-extrabold text-white font-mono mt-1 block">
            {totalAttempted}
          </span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Questions logged</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 block font-medium">Total Correct</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 block">
            {totalCorrect}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">High accuracy target: &gt;75%</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 block font-medium">Overall Accuracy</span>
          <span className="text-2xl font-extrabold text-indigo-400 font-mono mt-1 block">
            {overallAccuracy}%
          </span>
          <span className="text-[10px] text-indigo-300 mt-1 block">Calculated across sessions</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 block font-medium">Sessions Recorded</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono mt-1 block">
            {logs.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Consistency build-up</span>
        </div>
      </div>

      {/* GATEOverflow 1-Click Launchers Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-emerald-400" />
              Direct GATEOverflow Topic Launchers
            </h2>
            <p className="text-xs text-slate-400">
              Launch directly to official GATE questions and community explanations on GATEOverflow.
            </p>
          </div>
          <a
            href="https://gateoverflow.in/questions?sort=gate"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <span>Open Full GATEOverflow Bank</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gateOverflowTopics.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-200 block truncate">
                  {item.subject}
                </span>
                <div className="space-y-1.5 mt-2">
                  {item.topics.map((t, tIdx) => (
                    <a
                      key={tIdx}
                      href={t.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between text-[11px] text-slate-400 hover:text-emerald-400 transition-colors py-0.5"
                    >
                      <span className="truncate pr-2">{t.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log History */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Recent PYQ Practice Logs
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {logs.length} logged sessions
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-xs text-slate-400">No PYQ practice sessions logged yet.</p>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Log First PYQ Session
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Subject & Topic</th>
                  <th className="py-3 px-4 text-center">Attempted / Correct</th>
                  <th className="py-3 px-4 text-center">Accuracy</th>
                  <th className="py-3 px-4 text-center">Confidence</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => {
                  const accuracy =
                    log.attempted > 0 ? Math.round((log.correct / log.attempted) * 100) : 0;

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {log.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{log.subject}</span>
                        <span className="text-slate-400 text-[11px] block">{log.topic}</span>
                        {log.notes && (
                          <span className="text-slate-400 italic text-[10px] block mt-0.5">
                            Note: {log.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium">
                        {log.correct} / {log.attempted}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                            accuracy >= 75
                              ? "bg-emerald-500/20 text-emerald-400"
                              : accuracy >= 50
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {accuracy}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            log.confidence === "A"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : log.confidence === "B"
                              ? "bg-blue-500/20 text-blue-400"
                              : log.confidence === "C"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                          title={
                            log.confidence === "A"
                              ? "A: Fully Confident"
                              : log.confidence === "B"
                              ? "B: Minor Doubt / Slow"
                              : log.confidence === "C"
                              ? "C: Guessed / Uncertain"
                              : "D: Completely Wrong"
                          }
                        >
                          Rating {log.confidence}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {log.sourceUrl && (
                            <a
                              href={log.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                              title="Open Discussion Thread"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                            title="Delete Log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Session Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Log PYQ Practice Session</h3>
                <p className="text-xs text-slate-400">Record questions attempted on GATEOverflow.</p>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Cache Mapping & Miss Rate Calculation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Attempted</label>
                  <input
                    type="number"
                    min="1"
                    value={attempted}
                    onChange={(e) => setAttempted(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Correct</label>
                  <input
                    type="number"
                    min="0"
                    max={attempted}
                    value={correct}
                    onChange={(e) => setCorrect(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Minutes Spent</label>
                  <input
                    type="number"
                    min="1"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {attempted > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between font-mono">
                  <span className="text-slate-400">Live Accuracy:</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round((correct / attempted) * 100)}%
                  </span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Confidence Rating
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "A" as ConfidenceLevel, label: "A (Confident)", color: "border-emerald-500/50 text-emerald-400" },
                    { id: "B" as ConfidenceLevel, label: "B (Minor doubt)", color: "border-blue-500/50 text-blue-400" },
                    { id: "C" as ConfidenceLevel, label: "C (Guessed)", color: "border-amber-500/50 text-amber-400" },
                    { id: "D" as ConfidenceLevel, label: "D (Failed)", color: "border-rose-500/50 text-rose-400" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => handleConfidenceChange(lvl.id)}
                      className={`p-2 rounded-xl text-center border font-bold text-xs transition-all ${
                        confidence === lvl.id
                          ? "bg-slate-800 ring-2 ring-indigo-500 text-white"
                          : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {promptErrorBook && (
                <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-1 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Auto-Save to Error Book</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Confidence was rated {confidence}. We will automatically log this question to your digital Error Book with review intervals (+1d, +7d).
                  </p>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  GATEOverflow URL / Reference (Optional)
                </label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://gateoverflow.in/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Reflection / Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Made mistake on boundary case 0. Need to remember zero-indexed arrays."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLog}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
              >
                Save Session Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
