import masterPyqArchive from "@/data/gate/pyqs-10-years/master-archive.json";

export interface GatePyqQuestion {
  id: string;
  year: number;
  paper: string;
  subject: string;
  topic: string;
  type: "MCQ" | "NAT" | "MSQ";
  marks: number;
  question: string;
  options?: string[];
  correctAnswer: string;
  solution: string;
  trapWarning?: string;
  gateoverflowUrl?: string;
}

export function getAllArchivedPyqs(): GatePyqQuestion[] {
  return masterPyqArchive as unknown as GatePyqQuestion[];
}

export function searchPyqArchive(query: string, limit = 2): GatePyqQuestion[] {
  const lower = query.toLowerCase().trim();
  const all = getAllArchivedPyqs();

  // Search by topic, subject, year, or question keywords
  const matches = all.filter((q) => {
    return (
      q.topic.toLowerCase().includes(lower) ||
      q.subject.toLowerCase().includes(lower) ||
      String(q.year).includes(lower) ||
      q.question.toLowerCase().includes(lower) ||
      q.id.toLowerCase().includes(lower)
    );
  });

  if (matches.length > 0) {
    return matches.slice(0, limit);
  }

  // Token-level matching
  const tokens = lower.split(/\s+/).filter((t) => t.length > 2);
  const scored = all.map((q) => {
    let score = 0;
    const text = `${q.topic} ${q.subject} ${q.question}`.toLowerCase();
    tokens.forEach((t) => {
      if (text.includes(t)) score += 1;
    });
    return { q, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).map((s) => s.q).slice(0, limit);
}

export function formatPyqToMarkdown(q: GatePyqQuestion): string {
  let md = `### 📜 Official GATE Question (${q.paper} • ${q.marks} Marks)\n\n`;
  md += `**Subject:** ${q.subject} • **Topic:** ${q.topic} • **Type:** ${q.type}\n\n`;
  md += `${q.question}\n\n`;

  if (q.options && q.options.length > 0) {
    q.options.forEach((opt) => {
      md += `* ${opt}\n`;
    });
    md += `\n`;
  }

  md += `**Correct Answer:** \`${q.correctAnswer}\`\n\n`;
  md += `#### 💡 Complete Step-by-Step Solution:\n${q.solution}\n\n`;

  if (q.trapWarning) {
    md += `> ⚠️ **Examiner Trap Warning:** ${q.trapWarning}\n\n`;
  }

  if (q.gateoverflowUrl) {
    md += `[Open GATEOverflow Discussion ↗](${q.gateoverflowUrl})\n`;
  }

  return md;
}
