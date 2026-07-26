export interface MemoryItem {
  id: string;
  type: "INTENT_DETECTED" | "PROPOSAL_CREATED" | "ACTION_EXECUTED" | "INSIGHT_STORED";
  title: string;
  description: string;
  timestamp: string;
}

export const INITIAL_SESSION_MEMORY: MemoryItem[] = [
  {
    id: "mem-1",
    type: "ACTION_EXECUTED",
    title: "Executed Mission Proposal",
    description: "Created tactical directive: Codebase Security Audit (+150 XP)",
    timestamp: "10 mins ago",
  },
  {
    id: "mem-2",
    type: "INSIGHT_STORED",
    title: "Analyzed Morning Velocity",
    description: "Calculated peak focus window between 09:00 AM - 11:30 AM",
    timestamp: "30 mins ago",
  },
];
