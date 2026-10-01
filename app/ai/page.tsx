"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bot,
  Send,
  Sparkles,
  Search,
  Clock,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  FileQuestion,
  Play,
  Key,
  Trash2,
  Bookmark,
} from "lucide-react";
import { getCurrentPlanDay } from "@/lib/data";
import { FormattedAiResponse } from "@/components/ui/formatted-ai-response";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type CoachMode =
  | "plan"
  | "search"
  | "2h"
  | "3h"
  | "recovery"
  | "weakness"
  | "traps"
  | "custom";

function AiCoachContent() {
  const searchParams = useSearchParams();
  const urlSubject = searchParams.get("subject");
  const urlTopic = searchParams.get("topic");
  const urlDay = searchParams.get("day");

  const [activeMode, setActiveMode] = useState<CoachMode>("plan");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [customKey, setCustomKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const planInfo = getCurrentPlanDay();
  const dayNumber = urlDay ? parseInt(urlDay, 10) : planInfo.dayNumber;
  const activeSubject = urlSubject || planInfo.activeDay?.subject || "Programming & Data Structures";
  const activeTopic = urlTopic || planInfo.activeDay?.topic || "C Variables, Data Types & Operators";

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load custom Groq key if stored
    const savedKey = localStorage.getItem("gate_groq_api_key");
    if (savedKey) setCustomKey(savedKey);

    // Initial greeting
    setMessages([
      {
        role: "assistant",
        content: `### 👋 Welcome to Your GATE 2027 AI Study Coach & Resource Navigator

I am your personal preparation manager, scheduler, and syllabus resource finder.

**Today's Active Focus (Day ${dayNumber} of 90):**
* **Subject:** ${activeSubject}
* **Topic:** **${activeTopic}**
* **Planned Schedule:** 6 Hours (Theory + Notes + PYQs)

**What would you like me to do right now?**
1. 🎯 **Today's Action Plan:** Click below to view your prioritized execution sequence with direct verified video & PYQ links.
2. 🔍 **Find Any Topic or PYQ:** Ask me to find *any* topic across all 90 days (e.g. \`find cache memory\`, \`find dijkstra\`, \`where is day 45?\`).
3. ⏱️ **Time Compressor:** Let me know if you only have 2, 3, or 4 hours today.
4. 🔄 **Missed-Day Catchup:** Tell me if you missed yesterday to slot an automatic recovery block without disturbing the master plan.`,
      },
    ]);
  }, [activeSubject, activeTopic, dayNumber]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: {
            currentDay: dayNumber,
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
          { role: "assistant", content: data.reply },
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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error communicating with AI study coach. Please check your connection.",
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

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `### 🔄 Chat Reset
Ready for your next question or directive. What would you like to plan or search?`,
      },
    ]);
  };

  const coachDirectives: Array<{
    id: CoachMode;
    label: string;
    icon: any;
    query: string;
    description: string;
  }> = [
    {
      id: "plan",
      label: "Today's Action Plan",
      icon: Sparkles,
      query: "What should I do right now for today's plan?",
      description: "Get ordered priority sequence with direct video & PYQ links",
    },
    {
      id: "search",
      label: "Find Topic / PYQ",
      icon: Search,
      query: `find ${activeTopic}`,
      description: "Search any topic, lecture, or PYQ bank across 90 days",
    },
    {
      id: "2h",
      label: "I Have 2 Hours",
      icon: Clock,
      query: "I only have 2 hours today.",
      description: "Compress schedule & protect core concepts",
    },
    {
      id: "3h",
      label: "I Have 3 Hours",
      icon: Clock,
      query: "I have 3 hours available today.",
      description: "Protect high-yield theory and top PYQs",
    },
    {
      id: "recovery",
      label: "Missed Yesterday",
      icon: RotateCcw,
      query: "I missed yesterday. Give me a recovery plan.",
      description: "Slot catch-up block without disturbing master plan",
    },
    {
      id: "weakness",
      label: "Weakness Diagnostic",
      icon: AlertTriangle,
      query: "What is my biggest weakness and revision debt?",
      description: "Identify high-risk topics losing marks",
    },
    {
      id: "traps",
      label: "Common Exam Traps",
      icon: Lightbulb,
      query: `What are the most common GATE traps and mistake patterns in ${activeTopic}?`,
      description: "Avoid sneaky examiner tricks on this topic",
    },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col pt-3">
      {/* Top AI Coach Header */}
      <div
        className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white border border-slate-200 shadow-sm shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#064e3b] flex items-center justify-center text-[#fef9c3] shadow-sm border border-amber-400/80 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-[#011c15]">
                GATE AI Coach & Resource Navigator
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-100 text-[#022c22] border border-emerald-300">
                Groq Active
              </span>
            </div>
            <p className="text-[11px] text-slate-800 font-bold mt-0.5">
              Active Focus: <strong className="text-[#064e3b]">Day {dayNumber} of 90</strong> • {activeSubject} →{" "}
              <span className="text-[#011c15] font-black">{activeTopic}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#011c15] border border-slate-300 transition-colors shadow-2xs cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-[#011c15] border border-slate-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>{customKey ? "Groq Key Configured" : "Enter Groq Key"}</span>
          </button>
        </div>
      </div>

      {/* Groq Key Drawer */}
      {showKeyInput && (
        <div
          className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300 shadow-sm space-y-2 shrink-0 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between text-xs text-[#451a03] font-bold">
            <span>Groq API Key (Stored locally in your browser):</span>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="text-[#064e3b] underline font-black hover:text-[#022c22]"
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
              className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-950 font-mono font-bold focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#04382c] text-[#fef9c3] border border-amber-400/80 text-xs font-black shadow-xs cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* 1-Click Fast Directive Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
        {coachDirectives.map((d) => {
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => {
                setActiveMode(d.id);
                handleSendMessage(d.query);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap border border-slate-200 bg-white hover:bg-slate-50 text-[#011c15] hover:text-[#064e3b] hover:border-amber-400 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title={d.description}
            >
              <Icon className="w-3.5 h-3.5 text-[#064e3b]" />
              <span>{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Stream with FormattedAiResponse */}
      <div
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 rounded-3xl bg-white border border-slate-200 shadow-sm"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-3xl rounded-3xl p-4 sm:p-5 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#064e3b] text-[#fef9c3] border border-amber-400/80 font-bold shadow-sm"
                  : "bg-slate-50 border border-slate-200 text-[#011c15] font-medium shadow-2xs"
              }`}
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <FormattedAiResponse content={msg.content} />
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[#022c22] font-black text-xs flex items-center gap-2.5 animate-pulse shadow-2xs">
              <Bot className="w-4 h-4 text-[#064e3b]" />
              <span>AI Coach is computing the optimal study decision & verifying syllabus resources...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Search Queries Quick-Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-800 font-bold shrink-0">
        <span className="font-black text-[#011c15] whitespace-nowrap">Try asking:</span>
        {[
          "find cache memory",
          "find binary search trees",
          "find paging",
          "where is day 45?",
          "what are common traps?",
          "I only have 3 hours",
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 hover:text-[#064e3b] text-[#011c15] border border-slate-200 whitespace-nowrap transition-colors font-bold shadow-2xs cursor-pointer"
          >
            &quot;{chip}&quot;
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div
        className="p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 shrink-0 focus-within:border-[#064e3b] focus-within:ring-2 focus-within:ring-[#064e3b]/20"
      >
        <input
          type="text"
          placeholder="Ask AI Coach what to do, rebalance time, or type 'find [topic/concept/day]'..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#011c15] font-semibold placeholder:text-slate-400 focus:outline-none px-3 py-1.5"
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || loading}
          className="w-10 h-10 rounded-xl bg-[#064e3b] hover:bg-[#04382c] text-[#fef9c3] border border-amber-400/80 disabled:opacity-40 shadow-sm flex items-center justify-center shrink-0 transition-all hover:scale-105 cursor-pointer"
          title="Send message"
        >
          <Send className="w-4 h-4 shrink-0" />
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
          Loading GATE AI Coach & Knowledge Navigator...
        </div>
      }
    >
      <AiCoachContent />
    </Suspense>
  );
}
