"use client";

import React from "react";
import katex from "katex";
import { FormattedAiResponse } from "./formatted-ai-response";

interface MathTextProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export const MathText: React.FC<MathTextProps> = ({
  content,
  className = "",
  inline = false,
}) => {
  if (!inline) {
    return <FormattedAiResponse content={content} className={className} />;
  }

  // Pure inline rendering
  const parts = content.split(/(\$[^\$\n]+?\$)/g);
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline text-indigo-300 font-mono"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={index}>{part}</code>;
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
