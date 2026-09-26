"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Repeat,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { getRevisionCards } from "@/lib/data";
import { RevisionCard } from "@/lib/types";
import { MathText } from "@/components/ui/math-text";

export default function RevisionCenterPage() {
  const [cards, setCards] = useState<RevisionCard[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "due" | "completed">("due");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gate_revision_cards");
      if (saved) {
        setCards(JSON.parse(saved));
      } else {
        const initial = getRevisionCards();
        setCards(initial);
        localStorage.setItem("gate_revision_cards", JSON.stringify(initial));
      }
    } catch (e) {
      setCards(getRevisionCards());
    }
  }, []);

  const handleToggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCompleteRevision = (id: string) => {
    const updated = cards.map((c) => {
      if (c.id !== id) return c;
      const nextStage = Math.min(c.intervalStage + 1, 5);
      return {
        ...c,
        intervalStage: nextStage,
        status: "completed" as const,
        lastReviewed: new Date().toISOString(),
      };
    });
    setCards(updated);
    localStorage.setItem("gate_revision_cards", JSON.stringify(updated));
  };

  const filteredCards = cards.filter((c) => {
    if (activeFilter === "due") return c.status === "due";
    if (activeFilter === "completed") return c.status === "completed";
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-600/30 text-teal-300 border border-teal-500/40">
            <Repeat className="w-3.5 h-3.5" /> Spaced Repetition Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            GATE Revision Center
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            A topic is not finished when the lecture ends; it is finished when you can solve questions without assistance. Flashcards cycle through Days 0, 1, 3, 7, 14, and 30 to lock formulas into long-term memory.
          </p>
        </div>
      </div>

      {/* Revision Intervals Protocol Tracker */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" /> Scientific Revision Cycle Protocol
          </span>
          <span className="text-xs text-slate-400 font-mono">Day 0 → Day 1 → Day 3 → Day 7 → Day 14 → Day 30</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          {[
            { stage: "Stage 0", name: "Day 0", desc: "First Learn" },
            { stage: "Stage 1", name: "+1 Day", desc: "10m Quick Flash" },
            { stage: "Stage 2", name: "+3 Days", desc: "Re-solve Traps" },
            { stage: "Stage 3", name: "+7 Days", desc: "Formula Review" },
            { stage: "Stage 4", name: "+14 Days", desc: "Timed Mini-Test" },
            { stage: "Stage 5", name: "+30 Days", desc: "Long-term Check" },
          ].map((s, idx) => (
            <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
              <span className="text-[10px] font-bold text-teal-400 block">{s.stage}</span>
              <span className="text-xs font-semibold text-slate-200 block">{s.name}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: "due" as const, label: `Due for Review (${cards.filter((c) => c.status === "due").length})` },
          { id: "all" as const, label: `All Cards (${cards.length})` },
          { id: "completed" as const, label: `Mastered / Done (${cards.filter((c) => c.status === "completed").length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              activeFilter === tab.id
                ? "bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/30"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Revision Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCards.length === 0 ? (
          <div className="col-span-full bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">All caught up on spaced revisions!</h3>
            <p className="text-xs text-slate-400">Great discipline. Check back tomorrow for the next cycle.</p>
          </div>
        ) : (
          filteredCards.map((card) => {
            const isFlipped = !!flippedCards[card.id];

            return (
              <div
                key={card.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-teal-300 border border-slate-700">
                      {card.subjectName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/40 text-teal-300 border border-teal-800/40">
                      Stage {card.intervalStage} / 5
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{card.topic}</h3>
                    <p className="text-xs font-medium text-slate-300 mt-1">{card.concept}</p>
                  </div>

                  {/* Formula Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center font-mono text-xs">
                    <MathText content={`$$${card.keyFormula}$$`} />
                  </div>

                  {/* Trap Warning */}
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-2 text-xs text-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-amber-400">Trap:</strong> {card.trapToAvoid}</span>
                  </div>

                  {/* Mini-Question Flip Section */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">Quick Retention Check:</span>
                      <button
                        onClick={() => handleToggleFlip(card.id)}
                        className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                      >
                        <RotateCw className="w-3 h-3" />
                        {isFlipped ? "Hide Answer" : "Show Answer"}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                      <MathText content={card.miniQuestion?.prompt || card.front || "Review core concept."} />

                      {isFlipped && (
                        <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-emerald-400 font-medium">
                          <strong>Answer: </strong>
                          <MathText content={card.miniQuestion?.answer || card.back || "See lecture summary."} inline />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Due: {card.dueDate}
                  </span>
                  <button
                    onClick={() => handleCompleteRevision(card.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/30 text-xs font-semibold transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Reviewed (+1 Stage)
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
