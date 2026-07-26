export type KnowledgeType =
  | "Note"
  | "Research"
  | "Document"
  | "Journal"
  | "Reference"
  | "CodeSnippet"
  | "Bookmark"
  | "Template";

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: KnowledgeType;
  category: string;
  folderId?: string;
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  wordCount: number;
  readingTimeMins: number;
  updatedAt: string;
  createdAt: string;
  url?: string;
}

export function calculateWordCount(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function getInitialKnowledgeItems(): KnowledgeItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: "note-1",
      title: "Wayne OS Architecture Specifications",
      content: "# Wayne OS Architecture Specifications\n\nCentralized personal operating system architecture built with Vite, React, TypeScript, TailwindCSS, and Supabase.",
      type: "Document",
      category: "Operations",
      tags: ["architecture", "react", "typescript"],
      pinned: true,
      favorite: true,
      wordCount: 18,
      readingTimeMins: 1,
      updatedAt: now,
      createdAt: now,
    },
    {
      id: "note-2",
      title: "Daily Journal — Operator Briefing",
      content: "# Daily Journal\n\nAccomplished high-priority refactoring directives. Combat streak maintained.",
      type: "Journal",
      category: "Personal",
      tags: ["journal", "reflection"],
      pinned: false,
      favorite: false,
      wordCount: 10,
      readingTimeMins: 1,
      updatedAt: now,
      createdAt: now,
    },
    {
      id: "note-3",
      title: "Recharts Custom Tooltip Reference",
      content: "```tsx\n<Tooltip contentStyle={{ backgroundColor: '#0c0c0f', borderColor: '#d4af37' }} />\n```",
      type: "CodeSnippet",
      category: "Knowledge",
      tags: ["recharts", "code", "frontend"],
      pinned: false,
      favorite: true,
      wordCount: 8,
      readingTimeMins: 1,
      updatedAt: now,
      createdAt: now,
    },
  ];
}
