"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Bot,
  RefreshCw,
  Clock,
  Layers,
} from "lucide-react";
import { getPracticeQuestions, getSubjects } from "@/lib/data";
import { Question } from "@/lib/types";
import { MathText } from "@/components/ui/math-text";

export default function PracticeLabPage() {
  const allQuestions = getPracticeQuestions();
  const subjects = getSubjects();

  const [questions, setQuestions] = useState<Question[]>(allQuestions);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState(false);
  const [aiGeneratedText, setAiGeneratedText] = useState<string | null>(null);

  const filteredQuestions = questions.filter((q) => {
    if (selectedSubject !== "all") {
      const matchId = q.subjectId === selectedSubject;
      const matchName = q.subject === selectedSubject || subjects.find((s) => s.id === selectedSubject)?.name === q.subject;
      if (!matchId && !matchName) return false;
    }
    return true;
  });

  const handleSelectOption = (questionId: string, optionIndex: number, type: string) => {
    if (revealed[questionId]) return;

    if (type === "MSQ") {
      const current = (userAnswers[questionId] as number[]) || [];
      const updated = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex].sort();
      setUserAnswers({ ...userAnswers, [questionId]: updated });
    } else {
      const optLetter = String.fromCharCode(65 + optionIndex);
      setUserAnswers({ ...userAnswers, [questionId]: optLetter });
    }
  };

  const handleNatInput = (questionId: string, val: string) => {
    if (revealed[questionId]) return;
    setUserAnswers({ ...userAnswers, [questionId]: val });
  };

  const checkAnswer = (q: Question) => {
    const ans = userAnswers[q.id];
    if (ans === undefined || ans === "") return false;

    if (q.type === "NAT") {
      const num = parseFloat(ans);
      if (isNaN(num)) return false;
      if (q.tolerance) {
        return num >= q.tolerance.min && num <= q.tolerance.max;
      }
      return num === Number(q.correctAnswer);
    } else if (q.type === "MSQ") {
      const userArr = (ans as number[]) || [];
      const correctArr = (q.correctAnswer as number[]) || [];
      if (userArr.length !== correctArr.length) return false;
      return userArr.every((val, index) => val === correctArr[index]);
    } else {
      return ans === q.correctAnswer;
    }
  };

  const handleGenerateFreshQuestion = async () => {
    setGenerating(true);
    setAiGeneratedText(null);

    const activeSub = subjects.find((s) => s.id === selectedSubject) || subjects[0];

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Generate 1 fresh, highly creative GATE CS question (with traps and numerical steps) on subject: ${activeSub.name}`,
          mode: "quiz_me",
          context: {
            subject: activeSub.name,
            topic: "Advanced Practice",
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setAiGeneratedText(data.reply);
      }
    } catch (e) {
      console.warn("Generation failed", e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/30 text-purple-300 border border-purple-500/40">
              <Code className="w-3.5 h-3.5" /> Fresh GATE-Style Question Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Practice Lab: Unseen GATE Challenges
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Don&apos;t memorize PYQ solutions. Train your problem-solving reflex on fresh, newly authored questions designed to test the exact edge cases GATE examiners exploit.
            </p>
          </div>

          <button
            onClick={handleGenerateFreshQuestion}
            disabled={generating}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-[1.02]"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Generating AI Question...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate Fresh Question
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Generated Question Banner if active */}
      {aiGeneratedText && (
        <div className="p-6 rounded-2xl bg-slate-900 border-2 border-indigo-500 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
              <Bot className="w-4 h-4" /> Live AI-Generated Question Challenge
            </span>
            <button
              onClick={() => setAiGeneratedText(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
            <MathText content={aiGeneratedText} />
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-400" /> Subject:
          </span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {filteredQuestions.length} Questions Ready
        </span>
      </div>

      {/* Questions Stream */}
      <div className="space-y-6">
        {filteredQuestions.map((q) => {
          const isRevealed = !!revealed[q.id];
          const isCorrect = isRevealed ? checkAnswer(q) : false;
          const userAns = userAnswers[q.id];

          return (
            <div
              key={q.id}
              className={`bg-slate-900/90 border rounded-2xl p-6 shadow-xl space-y-4 transition-all ${
                isRevealed
                  ? isCorrect
                    ? "border-emerald-600/50 bg-emerald-950/10"
                    : "border-rose-600/50 bg-rose-950/10"
                  : "border-slate-800"
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-600/30 text-purple-300 border border-purple-500/30">
                    AI-Generated Practice — Not an official GATE question
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300">
                    {q.type}
                  </span>
                  {q.marks && (
                    <span className="text-xs font-semibold text-slate-400">
                      {q.marks} Mark{q.marks > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-400">{q.subjectName || q.subject}</span>
              </div>

              {/* Question Text with KaTeX */}
              <div className="text-sm font-medium text-slate-100 leading-relaxed">
                <MathText content={q.questionText} />
              </div>

              {/* Options or Input */}
              {q.type === "NAT" ? (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Enter Numerical Value:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 3.0"
                      disabled={isRevealed}
                      value={userAns || ""}
                      onChange={(e) => handleNatInput(q.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-500 w-48 disabled:opacity-75"
                    />
                    {!isRevealed && (
                      <button
                        onClick={() => setRevealed({ ...revealed, [q.id]: true })}
                        disabled={userAns === undefined || userAns === ""}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {q.options?.map((opt, optIdx) => {
                    const optLetter = String.fromCharCode(65 + optIdx);
                    const isSelected =
                      q.type === "MSQ"
                        ? ((userAns as number[]) || []).includes(optIdx)
                        : userAns === optLetter;

                    let optStyle = "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40";
                    if (isSelected) {
                      optStyle = "bg-purple-950/50 border-purple-500 text-purple-200 font-semibold";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx, q.type)}
                        disabled={isRevealed}
                        className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {optLetter}
                          </span>
                          <MathText content={opt} inline />
                        </div>
                        {isSelected && <span className="text-[10px] font-bold text-purple-400">Selected</span>}
                      </button>
                    );
                  })}

                  {!isRevealed && (
                    <button
                      onClick={() => setRevealed({ ...revealed, [q.id]: true })}
                      disabled={userAns === undefined}
                      className="mt-3 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      Check {q.type} Answer
                    </button>
                  )}
                </div>
              )}

              {/* Solution & Common Trap Alert */}
              {isRevealed && (
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div
                    className={`p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold ${
                      isCorrect
                        ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                        : "bg-rose-950/40 border border-rose-800 text-rose-300"
                    }`}
                  >
                    <span>{isCorrect ? "Correct Solution!" : "Incorrect Solution"}</span>
                    <span className="font-mono text-[11px]">Correct: {String(q.correctAnswer)}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 text-xs text-slate-300">
                    <span className="font-bold text-purple-400 block">Detailed Solution:</span>
                    <div className="leading-relaxed">
                      <MathText content={q.explanation} />
                    </div>
                  </div>

                  {q.commonTrap && (
                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-400 block">Classic GATE Misconception / Trap:</strong>
                        <MathText content={q.commonTrap} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
