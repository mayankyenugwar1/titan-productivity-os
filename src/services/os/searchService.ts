import { useHabitStore } from "@/store/missionStore";
import { useProjectStore } from "@/store/projectStore";
import { useKnowledgeStore } from "@/store/knowledgeStore";
import { useAutomationStore } from "@/store/automationStore";

export interface UniversalSearchResult {
  id: string;
  category: "Navigation" | "Mission" | "Project" | "Knowledge" | "Automation" | "AI Command";
  title: string;
  description: string;
  href?: string;
  action?: () => void;
  iconName: string;
}

export function searchUniversalOS(query: string): UniversalSearchResult[] {
  const q = query.toLowerCase().trim();
  const results: UniversalSearchResult[] = [];

  // 1. Navigation items
  const navItems: UniversalSearchResult[] = [
    { id: "nav-dash", category: "Navigation", title: "TITAN Overview", description: "System dashboard & core metrics", href: "/dashboard", iconName: "LayoutDashboard" },
    { id: "nav-cmd", category: "Navigation", title: "Command Center", description: "Executive morning briefing & daily focus score", href: "/command-center", iconName: "Compass" },
    { id: "nav-hab", category: "Navigation", title: "Mission Control", description: "Tactical operations queue & clearance levels", href: "/habits", iconName: "Target" },
    { id: "nav-[#cal]", category: "Navigation", title: "Time OS", description: "Multi-view Chrono Matrix calendar scheduling", href: "/calendar", iconName: "Calendar" },
    { id: "nav-[#ai]", category: "Navigation", title: "AI OS Core", description: "AI Agent Commander Headquarters & reasoning", href: "/ai-core", iconName: "Bot" },
    { id: "nav-[#kno]", category: "Navigation", title: "Knowledge OS", description: "Dual visual/markdown editor & Second Brain graph", href: "/knowledge", iconName: "BookOpen" },
    { id: "nav-[#prj]", category: "Navigation", title: "Projects & Goals", description: "Mission Board, timeline, roadmap & OKR goals", href: "/projects", iconName: "FolderKanban" },
    { id: "nav-[#aut]", category: "Navigation", title: "Automation OS", description: "Universal no-code event bus & visual canvas", href: "/automation", iconName: "Zap" },
    { id: "nav-[#int]", category: "Navigation", title: "Integrations Hub", description: "Third-party integrations & sync control engine", href: "/integrations", iconName: "Network" },
    { id: "nav-[#ach]", category: "Navigation", title: "Achievements", description: "Rank progression tiers & unlocked badges", href: "/achievements", iconName: "Trophy" },
    { id: "nav-[#ana]", category: "Navigation", title: "Analytics", description: "Telemetry intelligence analytics & focus score", href: "/analytics", iconName: "Activity" },
  ];

  for (const nav of navItems) {
    if (!q || nav.title.toLowerCase().includes(q) || nav.description.toLowerCase().includes(q)) {
      results.push(nav);
    }
  }

  if (!q) return results.slice(0, 8);

  // 2. Mission OS Search
  const habits = useHabitStore.getState().habits;
  for (const h of habits) {
    if (h.title.toLowerCase().includes(q) || (h.description && h.description.toLowerCase().includes(q))) {
      results.push({
        id: `h-${h.id}`,
        category: "Mission",
        title: h.title,
        description: `Priority: ${h.priority} • Category: ${h.category}`,
        href: "/habits",
        iconName: "Target",
      });
    }
  }

  // 3. Projects OS Search
  const projects = useProjectStore.getState().projects;
  for (const p of projects) {
    if (p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))) {
      results.push({
        id: `p-${p.id}`,
        category: "Project",
        title: p.name,
        description: `Status: ${p.status} • Category: ${p.category}`,
        href: "/projects",
        iconName: "FolderKanban",
      });
    }
  }

  // 4. Knowledge OS Search
  const notes = useKnowledgeStore.getState().items;
  for (const n of notes) {
    if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
      results.push({
        id: `n-${n.id}`,
        category: "Knowledge",
        title: n.title,
        description: `Vault Note • Category: ${n.category}`,
        href: "/knowledge",
        iconName: "BookOpen",
      });
    }
  }

  // 5. Automation OS Search
  const workflows = useAutomationStore.getState().workflows;
  for (const w of workflows) {
    if (w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)) {
      results.push({
        id: `w-${w.id}`,
        category: "Automation",
        title: w.name,
        description: `Trigger: ${w.trigger.label}`,
        href: "/automation",
        iconName: "Zap",
      });
    }
  }

  return results.slice(0, 15);
}
