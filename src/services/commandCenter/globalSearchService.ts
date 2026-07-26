import type { Habit } from "@/features/missions/types";
import type { KnowledgeItem } from "@/services/knowledge/knowledgeService";
import type { Project, Goal } from "@/services/projects/projectService";
import type { Workflow } from "@/services/automation/workflowService";

export interface SearchResultItem {
  id: string;
  domain: "Mission" | "Knowledge" | "Project" | "Goal" | "Automation";
  title: string;
  subtitle: string;
  href: string;
}

export function searchAllModules(
  query: string,
  habits: Habit[],
  notes: KnowledgeItem[],
  projects: Project[],
  goals: Goal[],
  workflows: Workflow[]
): SearchResultItem[] {
  if (!query || !query.trim()) return [];

  const q = query.toLowerCase().trim();
  const results: SearchResultItem[] = [];

  // 1. Missions
  habits.forEach((h) => {
    if (h.title.toLowerCase().includes(q) || (h.description && h.description.toLowerCase().includes(q))) {
      results.push({
        id: `m-${h.id}`,
        domain: "Mission",
        title: h.title,
        subtitle: `Mission Control · ${h.category} · Priority: ${h.priority}`,
        href: "/habits",
      });
    }
  });

  // 2. Knowledge Vault
  notes.forEach((n) => {
    if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
      results.push({
        id: `k-${n.id}`,
        domain: "Knowledge",
        title: n.title,
        subtitle: `Knowledge Vault · ${n.type} · ${n.wordCount} words`,
        href: "/knowledge",
      });
    }
  });

  // 3. Projects
  projects.forEach((p) => {
    if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
      results.push({
        id: `p-${p.id}`,
        domain: "Project",
        title: p.name,
        subtitle: `Projects OS · Status: ${p.status} · ${p.category}`,
        href: "/projects",
      });
    }
  });

  // 4. Goals
  goals.forEach((g) => {
    if (g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)) {
      results.push({
        id: `g-${g.id}`,
        domain: "Goal",
        title: g.title,
        subtitle: `Strategic Goals & OKRs · Target: ${g.targetDate}`,
        href: "/projects",
      });
    }
  });

  // 5. Workflows
  workflows.forEach((w) => {
    if (w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)) {
      results.push({
        id: `w-${w.id}`,
        domain: "Automation",
        title: w.name,
        subtitle: `Automation OS · ${w.enabled ? "Active" : "Paused"}`,
        href: "/automation",
      });
    }
  });

  return results.slice(0, 10);
}
