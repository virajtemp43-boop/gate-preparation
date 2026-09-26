"use client";

import React, { useMemo } from "react";
import katex from "katex";

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
  const renderedHtml = useMemo(() => {
    if (!content) return "";

    // Split text by display math ($$...$$) first, then inline math ($...$)
    const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);

    return parts
      .map((part) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2).trim();
          try {
            return katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
          } catch {
            return `<code>${part}</code>`;
          }
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1).trim();
          try {
            return katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
          } catch {
            return `<code>${part}</code>`;
          }
        }
        // Normal text - preserve line breaks safely
        return part.replace(/\n/g, "<br />");
      })
      .join("");
  }, [content]);

  if (inline) {
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
