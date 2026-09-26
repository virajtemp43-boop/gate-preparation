"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  AlertOctagon,
  Repeat,
  Code,
  Flame,
  CheckCircle2,
  Settings,
  Key,
} from "lucide-react";
import { AiTutorMode } from "@/lib/types";
import { getCurrentPlanDay, getSubjects } from "@/lib/data";
import { MathText } from "@/components/ui/math-text";

interface Message {
  role: "user" | "assistant";
  content: string;
  mode?: AiTutorMode;
}

function AiTutorContent() {
  const searchParams = useSearchParams();
  const urlSubject = searchParams.get("subject");
  const urlTopic = searchParams.get("topic");

  const [activeMode, setActiveMode] = useState<AiTutorMode>("explain");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [customKey, setCustomKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const planInfo = getCurrentPlanDay();
  const activeSubject = urlSubject || planInfo.activeDay?.subject || planInfo.activeDay?.subjectName || "Programming & Data Structures";
  const activeTopic = urlTopic || planInfo.activeDay?.topic || planInfo.activeDay?.topicTitle || "Pointers & Arrays";

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load custom Groq key if stored
    const savedKey = localStorage.getItem("gate_groq_api_key");
    if (savedKey) setCustomKey(savedKey);

    // Initial greeting
    setMessages([
      {
        role: "assistant",
        content: `👋 **Welcome to your GATE CS/IT AI Command Center!**\n\nI am your personalized exam tutor powered by Groq. I am aware of your preparation schedule:\n* **Current Preparation Day:** Day ${planInfo.dayNumber} / 90\n* **Active Subject Focus:** ${activeSubject}\n* **Active Topic:** ${activeTopic}\n\nSelect any operational mode below or ask me any conceptual doubt from scratch. I teach using first principles, intuitive analogies, and KaTeX math formulas!`,
      },
    ]);
  }, [activeSubject, activeTopic, planInfo.dayNumber]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text, mode: activeMode };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode: activeMode,
          context: {
            currentDay: planInfo.dayNumber,
            subject: activeSubject,
            topic: activeTopic,
          },
          customApiKey: customKey || undefined,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply, mode: activeMode },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an issue processing that query. Please try again.",
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error communicating with AI server. Please check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem("gate_groq_api_key", customKey);
    setShowKeyInput(false);
    alert("Groq API Key saved successfully in local browser storage!");
  };

  const modesList: Array<{ id: AiTutorMode; label: string; icon: any; color: string }> = [
    { id: "explain", label: "Explain from Zero", icon: Lightbulb, color: "indigo" },
    { id: "simplify", label: "Simplify / Analogy", icon: Sparkles, color: "emerald" },
    { id: "deep_dive", label: "GATE Deep Dive", icon: Flame, color: "purple" },
    { id: "hint", label: "Give Next Hint", icon: HelpCircle, color: "amber" },
    { id: "solve", label: "Step-by-Step Solve", icon: Code, color: "blue" },
    { id: "quiz_me", label: "Quiz Me", icon: CheckCircle2, color: "cyan" },
    { id: "interview_me", label: "Interview Me (Socratic)", icon: Bot, color: "violet" },
    { id: "pyq_explain", label: "PYQ Explainer", icon: HelpCircle, color: "pink" },
    { id: "mistake_analysis", label: "Analyze My Mistake", icon: AlertOctagon, color: "rose" },
    { id: "revision_card", label: "Generate Flashcard", icon: Repeat, color: "teal" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Cockpit Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Groq AI Tutor Cockpit</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Llama 3.3 70B
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Context: <strong className="text-slate-200">{activeSubject}</strong> → {activeTopic}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span>{customKey ? "Groq Key Configured" : "Enter Groq Key"}</span>
        </button>
      </div>

      {/* Groq Key Drawer if open */}
      {showKeyInput && (
        <div className="p-4 rounded-xl bg-slate-900 border border-amber-800/50 shadow-xl space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span>Groq API Key (Stored locally in your browser):</span>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:underline"
            >
              Get free Groq Key ↗
            </a>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="gsk_..."
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* 10 Operational Mode Selectors */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
        {modesList.map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;

          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20"
                  : "bg-slate-900 border border-slate-800 text-slate-200 shadow-md"
              }`}
            >
              <MathText content={msg.content} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2 animate-pulse">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Groq AI is reasoning over syllabus rules...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-2 shadow-xl shrink-0">
        <input
          type="text"
          placeholder={`Ask about ${activeTopic} in mode "${activeMode}"...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || loading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AiTutorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px] text-slate-400 text-xs">
          Loading AI Tutor Cockpit...
        </div>
      }
    >
      <AiTutorContent />
    </Suspense>
  );
}

