import { useMemo, useState } from "react";
import { useAutomationStore } from "@/store/automationStore";
import { SectionHeader, TitanButton } from "@/components/ui";
import AIWorkflowGeneratorBar from "@/components/automation/AIWorkflowGeneratorBar";
import AutomationAnalyticsWidget from "@/components/automation/AutomationAnalyticsWidget";
import TemplateMarketplaceGrid from "@/components/automation/TemplateMarketplaceGrid";
import ExecutionLogTable from "@/components/automation/ExecutionLogTable";
import WorkflowCanvas from "@/components/automation/WorkflowCanvas";
import NewWorkflowModal from "@/components/automation/NewWorkflowModal";
import { Play, Plus, Zap } from "lucide-react";

export default function AutomationPage() {
  const {
    workflows,
    executionHistory,
    activeWorkflowId,
    setActiveWorkflowId,
    toggleWorkflow,
    runWorkflowManually,
    createWorkflow,
    deleteWorkflow,
    generateAIWorkflow,
  } = useAutomationStore();

  const [activeTab, setActiveTab] = useState<"CANVAS" | "TEMPLATES" | "HISTORY">("CANVAS");
  const [newModalOpen, setNewModalOpen] = useState(false);

  const activeWorkflow = useMemo(() => {
    return workflows.find((w) => w.id === activeWorkflowId) || workflows[0];
  }, [workflows, activeWorkflowId]);

  const activeCount = workflows.filter((w) => w.enabled).length;

  return (
    <div className="space-y-8 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="Universal No-Code Event Bus"
        title="Automation OS & Workflow Builder"
        description="Event-driven automation engine connecting Mission Control, Time OS, Knowledge OS, Projects & Goals, and external webhooks."
      />

      {/* Natural Language AI Workflow Generator */}
      <AIWorkflowGeneratorBar onGenerate={(prompt) => generateAIWorkflow(prompt)} />

      {/* Telemetry Analytics Header */}
      <AutomationAnalyticsWidget activeCount={activeCount} totalExecutions={executionHistory.length} />

      {/* Control Bar: Workspace Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab("CANVAS")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "CANVAS"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            VISUAL WORKFLOW CANVAS
          </button>
          <button
            onClick={() => setActiveTab("TEMPLATES")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "TEMPLATES"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            TEMPLATE MARKETPLACE
          </button>
          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "HISTORY"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            EXECUTION AUDIT LOGS
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeWorkflow && (
            <TitanButton
              size="sm"
              variant="secondary"
              leftIcon={<Play className="size-3.5 text-emerald-400" />}
              onClick={() => runWorkflowManually(activeWorkflow.id)}
            >
              RUN CURRENT WORKFLOW
            </TitanButton>
          )}

          <TitanButton
            size="sm"
            leftIcon={<Plus className="size-4" />}
            onClick={() => setNewModalOpen(true)}
          >
            NEW WORKFLOW
          </TitanButton>
        </div>
      </div>

      {activeTab === "TEMPLATES" && (
        <TemplateMarketplaceGrid
          onUseTemplate={(tmpl) => {
            createWorkflow({
              name: tmpl.name,
              description: tmpl.description,
              trigger: {
                eventType: "MISSION_COMPLETED",
                label: tmpl.trigger,
              },
              conditions: [
                { field: "priority", operator: "equals", value: "High" },
              ],
              enabled: true,
              actions: [
                { actionType: "CREATE_MISSION", label: "Execute Directive", params: { desc: tmpl.description } },
              ],
            });
            setActiveTab("CANVAS");
          }}
        />
      )}

      {activeTab === "HISTORY" && <ExecutionLogTable history={executionHistory} />}

      {activeTab === "CANVAS" && (
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Workflows List Sidebar */}
          <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black font-mono space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-xs font-bold text-[#e5c158] uppercase">WORKFLOWS ({workflows.length})</span>
            </div>

            <div className="space-y-2 text-xs">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  onClick={() => setActiveWorkflowId(wf.id)}
                  className={`cursor-pointer rounded-2xl border p-3.5 space-y-2 transition ${
                    activeWorkflow?.id === wf.id
                      ? "border-[#d4af37]/60 bg-[#d4af37]/10"
                      : "border-zinc-800/80 bg-[#0c0c0f] hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-sans">{wf.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWorkflow(wf.id);
                      }}
                      className={`size-3 rounded-full border ${
                        wf.enabled ? "bg-emerald-400 border-emerald-300" : "bg-zinc-700 border-zinc-600"
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-1">{wf.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Canvas Node Editor */}
          <div className="lg:col-span-3">
            {activeWorkflow ? (
              <WorkflowCanvas
                workflow={activeWorkflow}
                onToggleEnabled={() => toggleWorkflow(activeWorkflow.id)}
                onRunManually={() => runWorkflowManually(activeWorkflow.id)}
                onDelete={() => deleteWorkflow(activeWorkflow.id)}
              />
            ) : (
              <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-12 text-center text-zinc-500 font-sans space-y-2">
                <Zap className="mx-auto size-10 text-zinc-700" />
                <p className="text-sm font-bold text-zinc-400">No workflow selected.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Workflow Modal */}
      <NewWorkflowModal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        onCreate={(data: any) => createWorkflow(data)}
      />
    </div>
  );
}
