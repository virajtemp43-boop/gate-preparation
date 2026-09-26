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
    <aside className="hidden lg:flex flex-col w-64 bg-white/95 border-r border-slate-200 text-slate-700 select-none shadow-xs">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
          G27
        </div>
        <div>
          <span className="font-bold text-slate-900 tracking-tight text-sm block">
            GATE 2027 CS/IT
          </span>
          <span className="text-[11px] text-indigo-600 font-semibold tracking-wide">
            AI STUDY MANAGER
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                  : "hover:bg-slate-100/80 hover:text-slate-900 text-slate-600",
                item.highlight && !isActive && "text-indigo-600 hover:text-indigo-700 font-semibold bg-indigo-50/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : item.highlight ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider",
                    isActive ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50/50">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Fixed Window
          </span>
          <span className="text-emerald-700 font-mono font-semibold">01 Oct - 29 Dec</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Source of Truth: GATE 2027 Master Plan
        </div>
      </div>
    </aside>
  );
};
