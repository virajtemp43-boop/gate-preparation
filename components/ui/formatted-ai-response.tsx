"use client";

import React, { useMemo } from "react";
import katex from "katex";
import {
  Play,
  ExternalLink,
  FileQuestion,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Bookmark,
} from "lucide-react";

interface FormattedAiResponseProps {
  content: string;
  className?: string;
}

export const FormattedAiResponse: React.FC<FormattedAiResponseProps> = ({
  content,
  className = "",
}) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Split content into lines to handle block-level markdown
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];
    let listType: "ul" | "ol" | null = null;
    let blockquoteBuffer: string[] = [];

    const flushList = () => {
      if (listBuffer.length > 0) {
        if (listType === "ol") {
          elements.push(
            <ol key={`ol-${elements.length}`} className="my-2.5 space-y-1.5 pl-1">
              {listBuffer.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-900 font-medium">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-emerald-100 border border-emerald-300 text-[10px] font-mono font-black text-emerald-950 shrink-0 mt-0.5 shadow-2xs">
                    {idx + 1}
                  </span>
                  <span className="flex-1 leading-relaxed">{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`ul-${elements.length}`} className="my-2.5 space-y-1.5 pl-1">
              {listBuffer.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-900 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  <span className="flex-1 leading-relaxed">{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        listBuffer = [];
        listType = null;
      }
    };

    const flushBlockquote = () => {
      if (blockquoteBuffer.length > 0) {
        elements.push(
          <div
            key={`bq-${elements.length}`}
            className="my-3 p-3 rounded-xl bg-emerald-50/80 border-l-4 border-emerald-500 border-r border-t border-b border-emerald-200 text-xs text-slate-800 italic space-y-1 shadow-2xs"
          >
            {blockquoteBuffer.map((line, idx) => (
              <p key={idx}>{renderInline(line)}</p>
            ))}
          </div>
        );
        blockquoteBuffer = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Empty line -> flush buffers
      if (!trimmed) {
        flushList();
        flushBlockquote();
        continue;
      }

      // Blockquote
      if (trimmed.startsWith(">")) {
        flushList();
        blockquoteBuffer.push(trimmed.replace(/^>\s*/, ""));
        continue;
      } else {
        flushBlockquote();
      }

      // Horizontal separator
      if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
        flushList();
        elements.push(<hr key={`hr-${i}`} className="my-3 border-emerald-900/10" />);
        continue;
      }

      // Headers
      if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-sm font-black text-slate-950 mt-4 mb-2 flex items-center gap-2 border-b border-emerald-900/10 pb-1.5 tracking-tight"
          >
            {renderInline(trimmed.slice(4))}
          </h3>
        );
        continue;
      }

      if (trimmed.startsWith("#### ")) {
        flushList();
        elements.push(
          <h4
            key={`h4-${i}`}
            className="text-xs font-black text-emerald-800 mt-3 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider"
          >
            {renderInline(trimmed.slice(5))}
          </h4>
        );
        continue;
      }

      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-base font-black text-slate-950 mt-5 mb-2.5 flex items-center gap-2 border-b border-emerald-900/10 pb-2"
          >
            {renderInline(trimmed.slice(3))}
          </h2>
        );
        continue;
      }

      if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={`h1-${i}`} className="text-lg font-black text-slate-950 mt-5 mb-3">
            {renderInline(trimmed.slice(2))}
          </h1>
        );
        continue;
      }

      // Numbered List
      const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (olMatch) {
        if (listType !== "ol") {
          flushList();
          listType = "ol";
        }
        listBuffer.push(olMatch[2]);
        continue;
      }

      // Bullet List
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (listType !== "ul") {
          flushList();
          listType = "ul";
        }
        listBuffer.push(trimmed.slice(2));
        continue;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={`p-${i}`} className="my-1.5 text-xs text-slate-900 font-medium leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }

    flushList();
    flushBlockquote();

    return elements;
  }, [content]);

  return <div className={`space-y-1 ${className}`}>{renderedElements}</div>;
};

/**
 * Parses inline formatting:
 * - Math ($...$ and $$...$$)
 * - Interactive Buttons & Links ([text](url))
 * - Bold (**bold**)
 * - Italic (*italic*)
 * - Inline Code (`code`)
 * - Reason / Status Badges (`HIGH_PRIORITY`, etc.)
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  // Regex tokens: Display Math, Inline Math, Markdown Link, Bold, Inline Code
  const tokenRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$|\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Display Math: $$ ... $$
    // Display Math: $$ ... $$
    if (part.startsWith("$$") && part.endsWith("$$")) {
      const math = part.slice(2, -2).trim();
      try {
        const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
        return (
          <span
            key={index}
            className="block my-2 text-center overflow-x-auto py-1 text-emerald-900 font-bold"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <code key={index} className="text-amber-800 font-bold">{part}</code>;
      }
    }

    // Inline Math: $ ... $
    if (part.startsWith("$") && part.endsWith("$")) {
      const math = part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
        return (
          <span
            key={index}
            className="inline text-emerald-900 font-mono font-bold"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <code key={index} className="text-amber-800 font-bold">{part}</code>;
      }
    }

    // Markdown Link: [text](url) -> Styled Interactive Button or Link
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      const lowerText = linkText.toLowerCase();

      // Video / Lecture button
      if (
        lowerText.includes("watch") ||
        lowerText.includes("lecture") ||
        lowerText.includes("▶") ||
        lowerText.includes("video")
      ) {
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-sm shadow-emerald-600/25 my-0.5 mx-1 transition-all hover:scale-105"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{linkText}</span>
          </a>
        );
      }

      // PYQ button
      if (lowerText.includes("pyq") || lowerText.includes("gateoverflow")) {
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] shadow-sm shadow-amber-500/25 my-0.5 mx-1 transition-all hover:scale-105"
          >
            <FileQuestion className="w-3 h-3" />
            <span>{linkText}</span>
          </a>
        );
      }

      // Topic MCQ button
      if (lowerText.includes("mcq") || lowerText.includes("mcqs") || lowerText.includes("quiz")) {
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] shadow-sm shadow-teal-600/25 my-0.5 mx-1 transition-all hover:scale-105"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{linkText}</span>
          </a>
        );
      }

      // Roadmap button
      if (lowerText.includes("roadmap") || lowerText.includes("backup")) {
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 font-extrabold text-[11px] my-0.5 mx-1 transition-all"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }

      // Generic link
      return (
        <a
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-950 underline font-bold text-[11px] mx-1 transition-colors"
        >
          <span>{linkText}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldContent = part.slice(2, -2);

      // Check if it's a known reason code badge
      if (
        boldContent === "HIGH_PRIORITY" ||
        boldContent === "TIME_LIMIT" ||
        boldContent === "RECOVERY" ||
        boldContent === "AHEAD_OF_PLAN" ||
        boldContent === "WEAK_TOPIC"
      ) {
        return (
          <span
            key={index}
            className="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-700 text-white shadow-2xs mx-1"
          >
            {boldContent}
          </span>
        );
      }

      return (
        <strong key={index} className="font-black text-slate-950 tracking-wide">
          {renderInline(boldContent)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      const italicContent = part.slice(1, -1);
      return (
        <em key={index} className="italic text-slate-700 font-medium">
          {italicContent}
        </em>
      );
    }

    // Inline Code: `text`
    if (part.startsWith("`") && part.endsWith("`")) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 font-mono text-[11px] text-emerald-950 font-bold mx-0.5"
        >
          {codeContent}
        </code>
      );
    }

    // Plain text
    return <span key={index}>{part}</span>;
  });
}
