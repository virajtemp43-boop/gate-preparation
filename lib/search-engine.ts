import planDaysData from "@/data/gate/plan-90-days.json";
import subjectsData from "@/data/gate/subjects.json";
import { StudyDay } from "./types";

export interface SearchResult {
  type: "day_topic" | "subject" | "resource";
  title: string;
  topic: string;
  dayNumber?: number;
  date?: string;
  monthName?: string;
  subject: string;
  subtopics: string[];
  plannedHours?: number;
  videoTitle?: string;
  videoUrl?: string;
  isDirectVideo?: boolean;
  roadmapUrl?: string;
  searchFallbackUrl?: string;
  pyqTitle?: string;
  pyqUrl?: string;
  pyqTarget?: number;
  officialUrl?: string;
  score: number;
}

const STOP_WORDS = new Set([
  "find",
  "search",
  "where",
  "is",
  "what",
  "which",
  "day",
  "about",
  "the",
  "for",
  "on",
  "in",
  "a",
  "an",
  "show",
  "me",
  "give",
  "tell",
  "topic",
  "lecture",
  "video",
  "pyq",
  "pyqs",
  "questions",
  "question",
  "notes",
  "how",
  "to",
  "can",
  "you",
  "i",
  "want",
  "need",
]);

export function cleanSearchQuery(rawQuery: string): string {
  return rawQuery
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => !STOP_WORDS.has(w) && w.length > 1)
    .join(" ")
    .trim();
}

export function isSearchIntent(text: string): boolean {
  const lower = text.toLowerCase().trim();
  if (
    lower.startsWith("find") ||
    lower.startsWith("search") ||
    lower.startsWith("where is") ||
    lower.startsWith("which day") ||
    lower.startsWith("show me") ||
    lower.startsWith("lookup") ||
    lower.startsWith("look up") ||
    lower.includes("find lecture") ||
    lower.includes("find pyq") ||
    lower.includes("find topic") ||
    lower.includes("where can i find") ||
    lower.includes("syllabus for") ||
    lower.includes("when do i study") ||
    lower.includes("resource for")
  ) {
    return true;
  }

  // Check if query is simply a topic or day request like "day 25" or "binary search tree"
  const dayMatch = lower.match(/^day\s*(\d{1,2})$/i);
  if (dayMatch) return true;

  return false;
}

export function searchKnowledgeBase(rawQuery: string, limit = 4): SearchResult[] {
  const lowerRaw = rawQuery.toLowerCase().trim();
  const cleaned = cleanSearchQuery(rawQuery);
  const days = planDaysData as unknown as StudyDay[];

  // 1. Direct Day Number match: e.g. "day 14" or "day 45"
  const dayNumMatch = lowerRaw.match(/day\s*(\d{1,2})\b/);
  if (dayNumMatch) {
    const targetDay = parseInt(dayNumMatch[1], 10);
    const matchedDay = days.find((d) => d.dayNumber === targetDay);
    if (matchedDay) {
      const v = matchedDay.exactResources?.videos?.[0];
      const p = matchedDay.exactResources?.pyqs?.[0];
      return [
        {
          type: "day_topic",
          title: `Day ${matchedDay.dayNumber}: ${matchedDay.topic}`,
          topic: matchedDay.topic,
          dayNumber: matchedDay.dayNumber,
          date: matchedDay.date,
          monthName: matchedDay.monthName,
          subject: matchedDay.subject,
          subtopics: matchedDay.subtopics || [],
          plannedHours: matchedDay.plannedHours,
          videoTitle: v?.title || `${matchedDay.topic} Lecture`,
          videoUrl: v?.directUrl || v?.roadmapUrl,
          isDirectVideo: Boolean(v?.directUrl),
          roadmapUrl: v?.roadmapUrl,
          searchFallbackUrl: v?.searchFallbackUrl,
          pyqTitle: p?.title || `${matchedDay.topic} PYQs`,
          pyqUrl: p?.url,
          pyqTarget: matchedDay.pyqResource?.target || 15,
          officialUrl: matchedDay.exactResources?.pyqs?.[1]?.url || "https://gate2027.iitm.ac.in/",
          score: 1000,
        },
      ];
    }
  }

  const queryTerms = (cleaned || lowerRaw).split(/\s+/).filter((t) => t.length > 1);
  if (queryTerms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const day of days) {
    let score = 0;
    const topicLower = day.topic.toLowerCase();
    const subjectLower = day.subject.toLowerCase();
    const subtopicsText = (day.subtopics || []).join(" ").toLowerCase();

    // Exact phrase match in topic
    if (topicLower.includes(cleaned)) {
      score += 100;
    }

    // Match individual terms
    for (const term of queryTerms) {
      if (topicLower.includes(term)) {
        score += 30;
      }
      if (subtopicsText.includes(term)) {
        score += 15;
      }
      if (subjectLower.includes(term)) {
        score += 10;
      }
    }

    if (score > 0) {
      const v = day.exactResources?.videos?.[0];
      const p = day.exactResources?.pyqs?.[0];

      results.push({
        type: "day_topic",
        title: `Day ${day.dayNumber}: ${day.topic}`,
        topic: day.topic,
        dayNumber: day.dayNumber,
        date: day.date,
        monthName: day.monthName,
        subject: day.subject,
        subtopics: day.subtopics || [],
        plannedHours: day.plannedHours,
        videoTitle: v?.title || `${day.topic} Lecture`,
        videoUrl: v?.directUrl || v?.roadmapUrl,
        isDirectVideo: Boolean(v?.directUrl),
        roadmapUrl: v?.roadmapUrl,
        searchFallbackUrl: v?.searchFallbackUrl,
        pyqTitle: p?.title || `${day.topic} PYQs`,
        pyqUrl: p?.url,
        pyqTarget: day.pyqResource?.target || 15,
        officialUrl: day.exactResources?.pyqs?.[1]?.url || "https://gate2027.iitm.ac.in/",
        score,
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

export function formatSearchResultsToMarkdown(results: SearchResult[], rawQuery: string): string {
  if (results.length === 0) {
    return `### 🔍 No Exact Syllabus Match Found for "${rawQuery}"

I searched the **90-Day Master Schedule (Oct 1 – Dec 29, 2026)** and resource locators, but couldn't find an exact topic matching that term.

**Suggestions:**
1. Try searching with a broader keyword (e.g. *"Pointers"*, *"Cache"*, *"Paging"*, *"Sorting"*, *"Deadlock"*, *"TOC"*).
2. Or ask for a specific day: *"Where is Day 25?"* or *"What is on Day 45?"*.
3. Or check the **Subjects & Syllabus** tab in the sidebar.`;
  }

  let md = `### 🔍 Found ${results.length} Syllabus & Resource Match${results.length > 1 ? "es" : ""} for "${rawQuery}":\n\n`;

  results.forEach((res, idx) => {
    md += `#### 📌 ${res.title}\n`;
    md += `* **Subject:** ${res.subject} (${res.monthName || "90-Day Master Plan"})\n`;
    md += `* **Date Scheduled:** ${res.date} • **Study Time:** ${res.plannedHours || 6} Hours\n`;
    if (res.subtopics && res.subtopics.length > 0) {
      md += `* **Syllabus Scope:** ${res.subtopics.slice(0, 4).join(", ")}\n`;
    }
    md += `* **Direct Action Resources:**\n`;
    if (res.isDirectVideo && res.videoUrl) {
      md += `  * [Watch exact lecture ▶](${res.videoUrl})\n`;
    } else if (res.videoUrl) {
      md += `  * [Open topic roadmap ↗](${res.videoUrl})\n`;
    }
    if (res.pyqUrl) {
      md += `  * [Open exact topic PYQs ↗](${res.pyqUrl}) (${res.pyqTarget || 15} Target Questions)\n`;
    }
    if (res.searchFallbackUrl) {
      md += `  * [Backup / topic roadmap ↗](${res.searchFallbackUrl})\n`;
    }
    if (idx < results.length - 1) {
      md += `\n---\n\n`;
    }
  });

  return md;
}
