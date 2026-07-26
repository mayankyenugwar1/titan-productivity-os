import { useMemo, useState } from "react";
import { useAI } from "@/hooks/ai/useAI";
import { SectionHeader } from "@/components/ui";
import ConversationPanel from "@/components/ai/ConversationPanel";
import CommandInput from "@/components/ai/CommandInput";
import QuickCommandGrid from "@/components/ai/QuickCommandGrid";
import SuggestionPanel from "@/components/ai/SuggestionPanel";
import BriefingWidget from "@/components/ai/BriefingWidget";
import WeeklyReviewWidget from "@/components/ai/WeeklyReviewWidget";
import PlannerScheduleWidget from "@/components/ai/PlannerScheduleWidget";
import MemoryTimeline from "@/components/ai/MemoryTimeline";

import { generateDailyBriefing } from "@/services/ai/briefingService";
import { generateWeeklyReview } from "@/services/ai/weeklyReviewService";
import { generateSmartSchedule } from "@/services/ai/plannerService";
import { INITIAL_SESSION_MEMORY } from "@/services/ai/memoryService";

export default function AICorePage() {
  const {
    messages,
    suggestions,
    proposals,
    isThinking,
    isStreaming,
    sendMessage,
    confirmProposal,
    rejectProposal,
    clearHistory,
    habits,
    projects,
    streak,
    totalXP,
  } = useAI();

  const [activeTab, setActiveTab] = useState<"COMMANDER" | "BRIEFING" | "REVIEW" | "PLANNER">("COMMANDER");

  const dailyBriefing = useMemo(
    () => generateDailyBriefing(habits, projects, streak),
    [habits, projects, streak]
  );

  const weeklyReview = useMemo(
    () => generateWeeklyReview(habits, projects, totalXP),
    [habits, projects, totalXP]
  );

  const smartSchedule = useMemo(
    () => generateSmartSchedule(habits),
    [habits]
  );

  return (
    <div className="space-y-8 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="Autonomous Executive Intelligence Layer"
        title="AI Agent & Commander Headquarters"
        description="Central intelligence layer capable of reasoning over workspace state, generating executive briefings, optimizing daily schedules, and executing store directives."
      />

      {/* Control Bar: Workspace Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab("COMMANDER")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "COMMANDER"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            COMMAND CONSOLE
          </button>
          <button
            onClick={() => setActiveTab("BRIEFING")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "BRIEFING"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            DAILY BRIEFING
          </button>
          <button
            onClick={() => setActiveTab("REVIEW")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "REVIEW"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            WEEKLY REVIEW
          </button>
          <button
            onClick={() => setActiveTab("PLANNER")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "PLANNER"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            SMART PLANNER
          </button>
        </div>
      </div>

      {activeTab === "BRIEFING" && (
        <BriefingWidget briefing={dailyBriefing} onActionClick={(prompt) => sendMessage(prompt)} />
      )}

      {activeTab === "REVIEW" && (
        <WeeklyReviewWidget review={weeklyReview} />
      )}

      {activeTab === "PLANNER" && (
        <PlannerScheduleWidget schedule={smartSchedule} />
      )}

      {activeTab === "COMMANDER" && (
        <>
          {/* Executive Daily Briefing Header */}
          <BriefingWidget briefing={dailyBriefing} onActionClick={(prompt) => sendMessage(prompt)} />

          {/* Reasoning Suggestions Panel */}
          <SuggestionPanel suggestions={suggestions} onSelectSuggestion={(prompt) => sendMessage(prompt)} />

          {/* Main Grid: Conversation Stream vs Side Telemetry */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Conversation Stream & Command Input */}
            <div className="lg:col-span-2 space-y-6">
              <ConversationPanel
                messages={messages}
                proposals={proposals}
                isThinking={isThinking}
                isStreaming={isStreaming}
                onConfirmProposal={confirmProposal}
                onRejectProposal={rejectProposal}
              />

              <CommandInput
                isThinking={isThinking}
                onSend={sendMessage}
                onClear={clearHistory}
              />
            </div>

            {/* Side Panel: Quick Commands & Session Memory */}
            <div className="space-y-6">
              <QuickCommandGrid onSelectPrompt={(prompt) => sendMessage(prompt)} />
              <MemoryTimeline memory={INITIAL_SESSION_MEMORY} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
