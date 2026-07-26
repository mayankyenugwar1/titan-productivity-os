import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";

export function exportAnalyticsCSV(habits: Habit[], totalXP: number, streak: number): void {
  const headers = ["Mission ID", "Title", "Category", "Priority", "Status", "XP Yield", "Coin Yield", "Created Date"];

  const rows = habits.map((h) => {
    const xp = calculateDynamicXP(h);
    const coins = Math.round(xp / 10);
    const status = h.completed ? "Completed" : "Active";
    return [
      `"${h.id}"`,
      `"${h.title.replace(/"/g, '""')}"`,
      `"${h.category}"`,
      `"${h.priority}"`,
      `"${status}"`,
      xp,
      coins,
      `"${new Date().toISOString().split("T")[0]}"`,
    ].join(",");
  });

  const csvContent = [
    `# TITAN TELEMETRY EXPORT - OPERATOR DOSSIER`,
    `# Total XP: ${totalXP} | Combat Streak: ${streak} Days | Total Missions: ${habits.length}`,
    headers.join(","),
    ...rows,
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `TITAN_Telemetry_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAnalyticsPDF(habits: Habit[], totalXP: number, streak: number): void {
  const reportText = `
===================================================================
                  TITAN OPERATOR TELEMETRY REPORT
===================================================================
Generated: ${new Date().toLocaleString()}
Classification: CLASSIFIED // LEVEL CLEARANCE REPORT

1. SYSTEM SUMMARY
-------------------------------------------------------------------
Total Operations: ${habits.length}
Completed Operations: ${habits.filter((h) => h.completed).length}
Total XP Payload: ${totalXP} XP
Total Coin Yield: ${Math.round(totalXP / 10)} Coins
Active Combat Streak: ${streak} Days

2. MISSION LIST TELEMETRY
-------------------------------------------------------------------
${habits
  .map(
    (h, idx) =>
      `[${idx + 1}] ${h.title} | Category: ${h.category} | Priority: ${h.priority} | XP: ${calculateDynamicXP(h)} | Status: ${h.completed ? "COMPLETED" : "ACTIVE"}`
  )
  .join("\n")}

===================================================================
               WAYNE OS OPERATIONAL INTELLIGENCE REPORT
===================================================================
`;

  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `TITAN_Operational_Report_${new Date().toISOString().slice(0, 10)}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
