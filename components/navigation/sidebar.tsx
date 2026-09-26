"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Calendar,
  Layers,
  Bookmark,
  HelpCircle,
  Code,
  Repeat,
  AlertOctagon,
  Award,
  BarChart3,
  Bot,
  Settings,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Today Command Center", href: "/", icon: CalendarCheck, badge: "Daily" },
  { name: "90-Day Master Calendar", href: "/plan", icon: Calendar },
  { name: "Subjects & Syllabus", href: "/subjects", icon: Layers },
  { name: "Resource Navigator", href: "/resources", icon: Bookmark },
  { name: "Ask AI Coach", href: "/ai", icon: Bot, highlight: true },
  { name: "Error Book", href: "/error-book", icon: AlertOctagon },
  { name: "Preparation Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900/95 border-r border-slate-800 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
          G27
        </div>
        <div>
          <span className="font-semibold text-white tracking-tight text-sm block">
            GATE 2027 CS/IT
          </span>
          <span className="text-[11px] text-indigo-400 font-medium tracking-wide">
            AI STUDY MANAGER
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                  : "hover:bg-slate-800/80 hover:text-white text-slate-300",
                item.highlight && !isActive && "text-indigo-400 hover:text-indigo-300"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : item.highlight ? "text-indigo-400" : "text-slate-400"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Fixed Window
          </span>
          <span className="text-emerald-400 font-mono font-semibold">01 Oct - 29 Dec</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Source of Truth: GATE 2027 Master Plan
        </div>
      </div>
    </aside>
  );
};
