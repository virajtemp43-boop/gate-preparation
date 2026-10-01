import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CircleNav } from "@/components/navigation/circle-nav";
import { RealtimeGuidanceCopilot } from "@/components/ai/realtime-guidance-copilot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GATE 2027 CS/IT — 90-Day AI Study Manager",
  description:
    "Daily Study Coordination Cockpit, Resource Resolution Layer, and AI Personal Coach for GATE CS/IT 2027 aspirants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-slate-900 antialiased min-h-screen selection:bg-emerald-800 selection:text-amber-100 bg-[#f4f6f5]`}>
        <div className="min-h-screen flex flex-col relative">
          {/* Top Navigation */}
          <CircleNav />

          {/* Main Cockpit Workspace */}
          <main className="flex-1 px-3 sm:px-6 lg:px-8 py-3 sm:py-5 max-w-[1680px] mx-auto w-full relative z-10">
            {children}
          </main>

          {/* Always-On Continuous AI Guidance & Dynamic Rescheduling Copilot */}
          <RealtimeGuidanceCopilot />
        </div>
      </body>
    </html>
  );
}
