import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CircleNav } from "@/components/navigation/circle-nav";

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
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased min-h-screen selection:bg-indigo-500 selection:text-white`}>
        <div className="min-h-screen flex flex-col relative">
          {/* Dynamic Top Navigation with Circle Animation on Cursor Hover */}
          <CircleNav />

          {/* Main Full-Width Cockpit Workspace */}
          <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
