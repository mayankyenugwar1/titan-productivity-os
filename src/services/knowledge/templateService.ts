export interface KnowledgeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultTitle: string;
  defaultContent: string;
}

export const KNOWLEDGE_TEMPLATES: KnowledgeTemplate[] = [
  {
    id: "tmpl-meeting",
    name: "Meeting Notes",
    description: "Structure key decisions, action items, and attendee notes.",
    category: "Operations",
    defaultTitle: "Meeting Notes — [Topic]",
    defaultContent: `# Meeting Notes — [Topic]\n\n**Date:** ${new Date().toLocaleDateString()}\n**Attendees:** Operator Prime\n\n## 1. Key Objectives\n- Objective 1\n- Objective 2\n\n## 2. Action Directives\n- [ ] Action item 1\n- [ ] Action item 2\n\n## 3. Notes & Decisions\nSummary of discussion items.`,
  },
  {
    id: "tmpl-research",
    name: "Research Vault Notes",
    description: "Document technical research findings, quotes, and sources.",
    category: "Knowledge",
    defaultTitle: "Research — [Subject]",
    defaultContent: `# Research — [Subject]\n\n**Category:** Technical Research\n**Source:** Documentation\n\n## Summary\nBrief overview of research findings.\n\n## Key Learnings\n- Finding 1\n- Finding 2\n\n## References & Links\n- [Reference Link](https://example.com)`,
  },
  {
    id: "tmpl-journal",
    name: "Daily Journal Entry",
    description: "Daily reflection, wins, lessons learned, and focus score notes.",
    category: "Personal",
    defaultTitle: "Daily Journal — " + new Date().toLocaleDateString(),
    defaultContent: `# Daily Journal — ${new Date().toLocaleDateString()}\n\n## Daily Reflection\nSummary of today's operational achievements.\n\n## Wins & Highlights\n- Win 1\n- Win 2\n\n## Lessons Learned\n- Key insight gained today.`,
  },
  {
    id: "tmpl-weekly",
    name: "Weekly Review & Retrospective",
    description: "Analyze weekly XP yield, completed directives, and next week priorities.",
    category: "Operations",
    defaultTitle: "Weekly Review — Sprint Retrospective",
    defaultContent: `# Weekly Review — Sprint Retrospective\n\n## 1. Accomplished Directives\n- Directive 1\n- Directive 2\n\n## 2. Focus & Productivity Metrics\n- Total XP Earned: +750 XP\n- Streak Maintained: Yes\n\n## 3. Next Week Objectives\n- Priority 1`,
  },
];
