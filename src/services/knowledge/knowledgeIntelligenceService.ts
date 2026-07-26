import type { KnowledgeItem } from "./knowledgeService";

export interface AISummaryResult {
  shortSummary: string;
  keyPoints: string[];
  actionItems: string[];
  suggestedTags: string[];
  generatedFlashcards: Array<{ question: string; answer: string }>;
}

export function generateAINoteSummary(note: KnowledgeItem): AISummaryResult {
  const content = note.content || "";
  const lines = content.split("\n").filter((l) => l.trim().length > 0);

  const shortSummary = `Executive summary of "${note.title}": Covers key operational insights and strategic directives logged in ${note.category}.`;
  const keyPoints = lines.slice(0, 3).map((line) => line.replace(/^[#*\-\d.]+\s*/, ""));
  if (keyPoints.length === 0) keyPoints.push("Contains strategic operational research payload.");

  return {
    shortSummary,
    keyPoints,
    actionItems: [
      `Review "${note.title}" during weekly planning block.`,
      `Link note to active Project Initiatives in Projects OS.`,
    ],
    suggestedTags: [note.category.toLowerCase(), "second-brain", "titan-ai"],
    generatedFlashcards: [
      {
        question: `What is the core directive of ${note.title}?`,
        answer: shortSummary,
      },
    ],
  };
}

export function performSemanticSearch(
  notes: KnowledgeItem[],
  query: string
): KnowledgeItem[] {
  if (!query || !query.trim()) return notes;
  const q = query.toLowerCase().trim();

  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
  );
}
