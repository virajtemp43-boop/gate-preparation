"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Flame,
  Bot,
  Calendar,
  Sparkles,
  Menu,
  X,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { getCurrentPlanDay } from "@/lib/data";

export const Header: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeDuration, setActiveDuration] = useState(25);

  useEffect(() => {
    setCurrentPlan(getCurrentPlanDay());
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      alert("Great work! Study session completed. Update your today checklist!");
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const setTimerPreset = (minutes: number) => {
    setActiveDuration(minutes);
    setTimerSeconds(minutes * 60);
    setTimerRunning(false);
  };

  return (
    <>
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-xs">
        {/* Left: Mobile trigger & Active Plan Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            {currentPlan?.isPreLaunch ? (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Pre-Launch: {currentPlan.daysUntilLaunch} Days to Kickoff (01 Oct)
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Day {currentPlan?.dayNumber || 1} / 90 Active
              </span>
            )}
          </div>
        </div>

        {/* Right: Timer, Streak, and AI quick action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Focus Timer Button */}
          <button
            onClick={() => setTimerModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-mono">{formatTimer(timerSeconds)}</span>
          </button>

          {/* Streak indicator */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>0 Day Streak</span>
          </div>

          {/* Direct AI Coach CTA */}
          <Link
            href="/ai"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI Coach</span>
          </Link>
        </div>
      </header>

      {/* Focus Timer Modal */}
      {timerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setTimerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> Study Focus Timer
              </h3>
              <p className="text-xs text-slate-500">
                Track focused preparation blocks without distraction.
              </p>
            </div>

            {/* Big Countdown Display */}
            <div className="text-5xl font-mono font-extrabold text-center text-slate-900 mb-6 tracking-wider py-4 bg-slate-50 rounded-2xl border border-slate-200">
              {formatTimer(timerSeconds)}
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[25, 50, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimerPreset(mins)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    activeDuration === mins
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                  timerRunning
                    ? "bg-amber-600 hover:bg-amber-500 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause Session
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Start Focus Session
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(activeDuration * 60);
                }}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-64 h-full bg-white border-r border-slate-200 p-4 space-y-2 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold text-slate-900 text-sm mb-4 px-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Navigation Menu
            </div>
            {[
              { name: "Today Command Center", href: "/" },
              { name: "90-Day Master Calendar", href: "/plan" },
              { name: "Subjects & Syllabus", href: "/subjects" },
              { name: "Resource Navigator", href: "/resources" },
              { name: "Ask AI Coach", href: "/ai" },
              { name: "Error Book", href: "/error-book" },
              { name: "Preparation Analytics", href: "/analytics" },
              { name: "Settings", href: "/settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
