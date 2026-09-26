"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Calendar,
  Layers,
  Bookmark,
  Bot,
  AlertOctagon,
  BarChart3,
  Settings,
  Sparkles,
  Flame,
  Clock,
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CircleNavProps {
  onOpenThoughtModal?: () => void;
}

const navItems = [
  { name: "Today", href: "/", icon: CalendarCheck },
  { name: "90-Day Calendar", href: "/plan", icon: Calendar },
  { name: "Subjects", href: "/subjects", icon: Layers },
  { name: "Resources", href: "/resources", icon: Bookmark },
  { name: "Ask AI Coach", href: "/ai", icon: Bot, highlight: true },
  { name: "Error Book", href: "/error-book", icon: AlertOctagon },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const CircleNav: React.FC<CircleNavProps> = ({ onOpenThoughtModal }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeDuration, setActiveDuration] = useState(25);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse tracking near top of window to reveal with circle animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 32) {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        setIsOpen(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      alert("Focus session complete! Time to log progress.");
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 400);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const setTimerPreset = (mins: number) => {
    setActiveDuration(mins);
    setTimerSeconds(mins * 60);
    setTimerRunning(false);
  };

  const handleOpenThought = () => {
    if (onOpenThoughtModal) {
      onOpenThoughtModal();
    } else {
      window.dispatchEvent(new CustomEvent("open-gate-thought-modal"));
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Hover Detection Hotzone (Sensor Band) */}
      <div
        className="fixed top-0 inset-x-0 h-6 z-50 pointer-events-auto"
        onMouseEnter={handleMouseEnter}
      />

      {/* Minimalist Floating Trigger Indicator (Visible when hidden) */}
      <div
        className={cn(
          "fixed top-2 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-auto",
          isOpen ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
        )}
        onMouseEnter={handleMouseEnter}
        onClick={() => setIsOpen(true)}
      >
        <button
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-indigo-600 border border-slate-200/90 shadow-sm backdrop-blur-md text-xs font-semibold group cursor-pointer transition-all hover:scale-105 hover:border-indigo-300"
          title="Hover to open navigation menu"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="tracking-tight text-[11px]">Menu & Navigation</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>

      {/* Circle Animation Navigation Bar Overlay */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed top-0 inset-x-0 z-50 p-2 sm:p-4 flex justify-center",
          isOpen ? "circle-nav-visible" : "circle-nav-hidden"
        )}
      >
        <div className="w-full max-w-6xl bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-3 sm:p-4 shadow-2xl space-y-3 ring-1 ring-slate-900/5">
          {/* Top Bar: Brand, Quick Controls, Close */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-3">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-indigo-600/30">
                G27
              </div>
              <div>
                <span className="font-bold text-slate-900 tracking-tight text-xs block leading-tight">
                  GATE 2027 CS/IT
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold tracking-wide block">
                  AI STUDY COACH & MANAGER
                </span>
              </div>
            </div>

            {/* Quick Action Pills: Thought Popup, Focus Timer, Streak */}
            <div className="flex items-center gap-2">
              {/* Daily Thought Popup Trigger */}
              <button
                onClick={handleOpenThought}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-all hover:scale-102 shadow-2xs"
                title="View Today's Mindset Thought Popup"
              >
                <Lightbulb className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="hidden sm:inline">Today&apos;s Thought</span>
              </button>

              {/* Focus Timer Trigger */}
              <button
                onClick={() => setTimerModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-semibold transition-all shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-mono">{formatTimer(timerSeconds)}</span>
              </button>

              {/* Streak */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>0 Streak</span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors ml-1"
                title="Hide Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links Grid / Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-150",
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300",
                    item.highlight && !isActive && "text-indigo-600 hover:text-indigo-700 bg-indigo-50 border-indigo-200"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-slate-500")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Focus Timer Modal */}
      {timerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" /> Focus Session Timer
              </h3>
              <button
                onClick={() => setTimerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Countdown Display */}
            <div className="text-5xl font-mono font-extrabold text-center text-slate-900 py-4 bg-slate-50 rounded-2xl border border-slate-200">
              {formatTimer(timerSeconds)}
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimerPreset(mins)}
                  className={cn(
                    "py-2 text-xs font-semibold rounded-xl border transition-all",
                    activeDuration === mins
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all",
                  timerRunning
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Start Focus
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(activeDuration * 60);
                }}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
