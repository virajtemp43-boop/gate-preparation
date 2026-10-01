"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Clock3,
  Layers,
  Bookmark,
  Bot,
  AlertOctagon,
  BarChart3,
  Settings,
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
import GlassSurface from "@/components/ui/GlassSurface";

interface CircleNavProps {
  onOpenThoughtModal?: () => void;
}

const navItems = [
  { name: "Today", href: "/", icon: CalendarCheck },
  { name: "90-Day Timeline", href: "/plan", icon: Clock3 },
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
      {/* Top Hover Detection Hotzone */}
      <div
        className="fixed top-0 inset-x-0 h-4 z-50 pointer-events-auto"
        onMouseEnter={handleMouseEnter}
      />

      {/* Floating Trigger Indicator (Top-Right Luxury Liquid Glass Capsule) */}
      <div
        className={cn(
          "fixed top-3 right-5 sm:right-8 z-40 transition-all duration-300 pointer-events-auto",
          isOpen ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
        )}
        onMouseEnter={handleMouseEnter}
        onClick={() => setIsOpen(true)}
      >
        <button
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#022018] hover:text-[#064e3b] font-black text-xs group cursor-pointer transition-all hover:scale-105 border border-slate-200 shadow-md"
          title="Open Quick Navigation Menu"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="tracking-tight">Menu & Navigation</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-700 group-hover:text-[#064e3b] transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>

      {/* Navigation Bar Overlay */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed top-0 inset-x-0 z-50 p-2 sm:p-4 flex justify-center pointer-events-none transition-all duration-200",
          isOpen ? "circle-nav-visible pointer-events-auto" : "circle-nav-hidden"
        )}
      >
        {isOpen && (
          <div className="w-full max-w-6xl p-3 sm:p-4 bg-white rounded-2xl shadow-xl space-y-3 border border-slate-200">
            {/* Top Bar: Brand, Quick Controls, Close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-3">
              {/* Brand */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#064e3b] text-[#fef9c3] flex items-center justify-center font-black text-xs shadow-sm">
                  G27
                </div>
                <div>
                  <span className="font-black text-[#022018] tracking-tight text-xs block leading-tight">
                    GATE 2027 CS/IT
                  </span>
                  <span className="text-[10px] text-[#064e3b] font-black tracking-wide block font-mono">
                    AI STUDY COACH & TIMELINE
                  </span>
                </div>
              </div>

              {/* Quick Action Pills: Thought Popup, Focus Timer, Streak */}
              <div className="flex items-center gap-2">
                {/* Daily Thought Popup Trigger */}
                <button
                  onClick={handleOpenThought}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl metallic-shining-gold-btn text-[#022018] text-xs font-black transition-all hover:scale-102 cursor-pointer shadow-xs"
                  title="View Today's Mindset Thought Popup"
                >
                  <Lightbulb className="w-3.5 h-3.5 fill-current text-[#022018]" />
                  <span className="hidden sm:inline">Today&apos;s Mindset</span>
                </button>

                {/* Focus Timer Trigger */}
                <button
                  onClick={() => setTimerModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#022c22] border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-[#064e3b]" />
                  <span className="font-mono">{formatTimer(timerSeconds)}</span>
                </button>

                {/* Streak */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-[#451a03] border border-amber-200 text-xs font-black">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>0 Streak</span>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#022018] transition-colors ml-1 cursor-pointer font-bold"
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
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150",
                      isActive
                        ? "bg-[#064e3b] text-[#fef9c3] font-black shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-[#022018] hover:text-[#064e3b] border border-slate-200",
                      item.highlight && !isActive && "text-amber-900 bg-amber-50 border-amber-200 font-black"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#fef08a]" : "text-[#064e3b]")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Focus Timer Modal - Light Liquid Glass */}
      {timerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="luxury-glass rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-fade-in-up border border-white/95">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Focus Session Timer
              </h3>
              <button
                onClick={() => setTimerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Countdown Display */}
            <div className="text-5xl font-mono font-extrabold text-center text-slate-900 py-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 shadow-inner">
              {formatTimer(timerSeconds)}
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimerPreset(mins)}
                  className={cn(
                    "py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer",
                    activeDuration === mins
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold"
                      : "bg-white/80 text-slate-700 border-slate-200/80 hover:bg-emerald-50"
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
                  "flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer",
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
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
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
