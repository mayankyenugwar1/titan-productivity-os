import type { HabitInput } from "@/features/missions/types";

export interface ExternalCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export interface ExternalGitHubIssue {
  id: number;
  title: string;
  body?: string;
  state: "open" | "closed";
  htmlUrl: string;
}

export function mapCalendarEventToMission(event: ExternalCalendarEvent): HabitInput {
  return {
    title: event.summary || "Scheduled Google Calendar Event",
    description: event.description || `Synced from Google Calendar (${event.startTime})`,
    category: "Operations",
    priority: "Medium",
    xp: 100,
    frequency: "daily",
    weeklyDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  };
}

export function mapGitHubIssueToProjectTask(issue: ExternalGitHubIssue) {
  return {
    title: issue.title,
    description: `Imported from GitHub Issue #${issue.id}: ${issue.htmlUrl}`,
    status: issue.state === "open" ? "Active" : "Completed",
    priority: "High",
  };
}
