"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calculator,
  Maximize2,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getAllQuestions } from "@/lib/data";
import { Question } from "@/lib/types";
import { MathText } from "@/components/ui/math-text";
import { VirtualCalculator } from "@/components/mocks/virtual-calculator";

export default function MockTestsPage() {
  const allAvailableQuestions = getAllQuestions();

  const [inExam, setInExam] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [examTimeSecs, setExamTimeSecs] = useState(180 * 60); // 3 hours
  const [calcOpen, setCalcOpen] = useState(false);

  // Exam answers & status
  // status: "not_visited" | "not_answered" | "answered" | "marked_review"
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [paletteStatus, setPaletteStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    let interval: any = null;
    if (inExam && !examSubmitted && examTimeSecs > 0) {
      interval = setInterval(() => {
        setExamTimeSecs((prev) => prev - 1);
      }, 1000);
    } else if (examTimeSecs === 0 && inExam && !examSubmitted) {
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [inExam, examSubmitted, examTimeSecs]);

  const questions: Question[] = allAvailableQuestions.slice(0, 10); // Standard demo paper subset

  const handleStartExam = () => {
    setInExam(true);
    setExamSubmitted(false);
    setCurrentIdx(0);
    setExamTimeSecs(180 * 60);
    setUserAnswers({});
    setPaletteStatus({ [questions[0]?.id]: "not_answered" });
  };

  const handleSelectOption = (qId: string, optLetter: string) => {
    setUserAnswers({ ...userAnswers, [qId]: optLetter });
    setPaletteStatus({ ...paletteStatus, [qId]: "answered" });
  };

  const handleNatInput = (qId: string, val: string) => {
    setUserAnswers({ ...userAnswers, [qId]: val });
    if (val.trim() !== "") {
      setPaletteStatus({ ...paletteStatus, [qId]: "answered" });
    }
  };

  const handleMarkForReview = () => {
    const q = questions[currentIdx];
    setPaletteStatus({ ...paletteStatus, [q.id]: "marked_review" });
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSaveAndNext = () => {
    if (currentIdx < questions.length - 1) {
      const nextQ = questions[currentIdx + 1];
      if (!paletteStatus[nextQ.id]) {
        setPaletteStatus({ ...paletteStatus, [nextQ.id]: "not_answered" });
      }
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
  };

  // Evaluation calculations
  const calculateResults = () => {
    let score = 0;
    let attempted = 0;
    let correct = 0;
    let wrong = 0;

    questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (userAns !== undefined && userAns !== "") {
        attempted++;
        let isCorrect = false;

        if (q.type === "NAT") {
          const num = parseFloat(userAns);
          if (q.tolerance) {
            isCorrect = num >= q.tolerance.min && num <= q.tolerance.max;
          } else {
            isCorrect = num === Number(q.correctAnswer);
          }
        } else {
          isCorrect = userAns === q.correctAnswer;
        }

        const qMarks = q.marks || 1;
        if (isCorrect) {
          correct++;
          score += qMarks;
        } else {
          wrong++;
          // Negative marking only on MCQ
          if (q.type === "MCQ") {
            score -= qMarks === 1 ? 1 / 3 : 2 / 3;
          }
        }
      }
    });

    const unattempted = questions.length - attempted;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    return {
      score: Math.max(score, 0).toFixed(2),
      attempted,
      correct,
      wrong,
      unattempted,
      accuracy,
    };
  };

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const activeQ = questions[currentIdx];
  const results = examSubmitted ? calculateResults() : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* If Not in Active Exam Mode: Show Catalog */}
      {!inExam ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                <Award className="w-3.5 h-3.5" /> Official Exam Simulation
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                GATE CBT Mock Test Simulator
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Experience the authentic 3-hour GATE interface: virtual scientific calculator, question palette, negative marking rules, and detailed post-exam 14-metric diagnostic tables.
              </p>
            </div>
          </div>

          {/* Test Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Full Mock 1 — Complete Simulation",
                desc: "Full 65 questions (GA + CS/Math) with strict 3-hour time pressure.",
                duration: "180 Mins",
                marks: "100 Marks",
                status: "Ready",
              },
              {
                title: "Full Mock 2 — All Subjects",
                desc: "Designed for Month 3 Day 87. Emphasizes problem-heavy numericals.",
                duration: "180 Mins",
                marks: "100 Marks",
                status: "Day 87 Scheduled",
              },
              {
                title: "Full Mock 3 — Final Readiness",
                desc: "Final exam dress rehearsal prior to Day 90 review.",
                duration: "180 Mins",
                marks: "100 Marks",
                status: "Day 89 Scheduled",
              },
            ].map((mock, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      MOCK #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{mock.duration}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{mock.title}</h3>
                  <p className="text-xs text-slate-400">{mock.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{mock.marks}</span>
                  <button
                    onClick={handleStartExam}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Simulation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !examSubmitted ? (
        /* Active CBT Interface */
        <div className="space-y-4">
          {/* CBT Top Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-xs font-bold text-indigo-400 block">
                GATE 2027 COMPUTER-BASED TEST (CBT)
              </span>
              <span className="text-sm font-extrabold text-white">
                Full-Length Simulation Paper
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCalcOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium border border-slate-700"
              >
                <Calculator className="w-3.5 h-3.5 text-indigo-400" /> Virtual Calculator
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500/40 font-mono text-sm font-bold text-emerald-400">
                <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{formatTimer(examTimeSecs)}</span>
              </div>

              <button
                onClick={handleSubmitExam}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                Submit Paper
              </button>
            </div>
          </div>

          {/* Main CBT Split: Question Window & Question Palette */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left 3 Cols: Question Details */}
            <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between min-h-[500px]">
              <div className="space-y-4">
                {/* Meta */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">
                      Question No. {currentIdx + 1} of {questions.length}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300">
                      {activeQ.type}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Marks: <strong className="text-emerald-400">+{activeQ.marks || 1}</strong> | Negative:{" "}
                    <strong className="text-rose-400">
                      {activeQ.type === "MCQ" ? `-${((activeQ.marks || 1) / 3).toFixed(2)}` : "0"}
                    </strong>
                  </span>
                </div>

                {/* Question Text */}
                <div className="text-sm text-slate-100 leading-relaxed font-medium">
                  <MathText content={activeQ.questionText} />
                </div>

                {/* Input or Options */}
                {activeQ.type === "NAT" ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">
                      Enter Numeric Value:
                    </span>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 8"
                      value={userAnswers[activeQ.id] || ""}
                      onChange={(e) => handleNatInput(activeQ.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 w-48"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    {activeQ.options?.map((opt: string, optIdx: number) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isSelected = userAnswers[activeQ.id] === letter;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(activeQ.id, letter)}
                          className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-3 ${
                            isSelected
                              ? "bg-indigo-950/50 border-indigo-500 text-indigo-200 font-semibold"
                              : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {letter}
                          </span>
                          <MathText content={opt} inline />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleMarkForReview}
                  className="px-4 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60 text-xs font-semibold"
                >
                  Mark for Review & Next
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updated = { ...userAnswers };
                      delete updated[activeQ.id];
                      setUserAnswers(updated);
                      setPaletteStatus({ ...paletteStatus, [activeQ.id]: "not_answered" });
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Clear Response
                  </button>
                  <button
                    onClick={handleSaveAndNext}
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                  >
                    Save & Next
                  </button>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Question Palette */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <span className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-2">
                Question Palette
              </span>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500" /> Answered
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-500" /> Not Answered
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-500" /> Review
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-700" /> Not Visited
                </div>
              </div>

              {/* Grid of question buttons */}
              <div className="grid grid-cols-5 gap-1.5 pt-2">
                {questions.map((q: Question, idx: number) => {
                  const status = paletteStatus[q.id] || "not_visited";
                  const isCurrent = idx === currentIdx;

                  let color = "bg-slate-800 text-slate-400";
                  if (status === "answered") color = "bg-emerald-600 text-white";
                  else if (status === "not_answered") color = "bg-rose-600 text-white";
                  else if (status === "marked_review") color = "bg-purple-600 text-white";

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-9 rounded-lg font-mono text-xs font-bold transition-all ${color} ${
                        isCurrent ? "ring-2 ring-white scale-105" : ""
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Virtual Calculator Modal */}
          {calcOpen && <VirtualCalculator onClose={() => setCalcOpen(false)} />}
        </div>
      ) : (
        /* Results & Mock Analysis Table */
        results && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Scorecard Hero */}
            <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 inline-block">
                CBT MOCK TEST COMPLETE
              </span>
              <h2 className="text-3xl font-extrabold text-white">Your Final Score</h2>
              <div className="text-5xl font-mono font-black text-indigo-400">
                {results.score}
              </div>
              <p className="text-xs text-slate-300">
                Accuracy: <strong className="text-white">{results.accuracy}%</strong> | Attempted:{" "}
                <strong className="text-white">{results.attempted}</strong> of {questions.length}
              </p>
              <button
                onClick={() => setInExam(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Return to Mock Catalog
              </button>
            </div>

            {/* Official 14-Metric Mock Diagnostic Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Section 18 Mock Analysis Table
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Metric</th>
                      <th className="p-3">Result</th>
                      <th className="p-3">Analysis Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-3 font-semibold text-white">Total Marks</td>
                      <td className="p-3 font-mono font-bold text-indigo-400">{results.score}</td>
                      <td className="p-3 text-slate-400">Calculated with negative marking</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Questions Attempted</td>
                      <td className="p-3 font-mono">{results.attempted}</td>
                      <td className="p-3 text-slate-400">Target: 80%+ coverage</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Correct Answers</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{results.correct}</td>
                      <td className="p-3 text-slate-400">High-confidence hits</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Wrong Answers</td>
                      <td className="p-3 font-mono text-rose-400 font-bold">{results.wrong}</td>
                      <td className="p-3 text-slate-400">Must log in Error Book</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Accuracy Rate</td>
                      <td className="p-3 font-mono font-bold text-amber-400">{results.accuracy}%</td>
                      <td className="p-3 text-slate-400">Target for GATE top rank: &gt; 75%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
