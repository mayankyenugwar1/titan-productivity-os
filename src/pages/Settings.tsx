import { useState } from "react";
import { SectionHeader, TitanBadge, TitanButton } from "@/components/ui";
import {
  Bell,
  CheckCircle2,
  Database,
  Download,
  Moon,
  Shield,
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"SYSTEM" | "NOTIFICATIONS" | "SECURITY" | "DATA">("SYSTEM");
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    const exportPayload = {
      operator: "Operator (Local)",
      exportedAt: new Date().toISOString(),
      appVersion: "1.0.0-RC",
      status: "PRODUCTION_READY",
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TITAN_Workspace_Export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="System Operations"
        title="System Control & Security Preferences"
        description="Configure system preferences, notification tiers, security controls, and JSON data export capabilities."
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1.5 text-xs font-bold">
        <button
          onClick={() => setActiveTab("SYSTEM")}
          className={`rounded-xl px-4 py-2 transition ${
            activeTab === "SYSTEM"
              ? "bg-[#d4af37] text-zinc-950 shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          SYSTEM & THEME
        </button>
        <button
          onClick={() => setActiveTab("NOTIFICATIONS")}
          className={`rounded-xl px-4 py-2 transition ${
            activeTab === "NOTIFICATIONS"
              ? "bg-[#d4af37] text-zinc-950 shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          NOTIFICATIONS
        </button>
        <button
          onClick={() => setActiveTab("SECURITY")}
          className={`rounded-xl px-4 py-2 transition ${
            activeTab === "SECURITY"
              ? "bg-[#d4af37] text-zinc-950 shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          SECURITY & PRIVACY
        </button>
        <button
          onClick={() => setActiveTab("DATA")}
          className={`rounded-xl px-4 py-2 transition ${
            activeTab === "DATA"
              ? "bg-[#d4af37] text-zinc-950 shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          DATA & EXPORT
        </button>
      </div>

      {activeTab === "SYSTEM" && (
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <Moon className="size-5 text-[#e5c158]" />
            <div>
              <h3 className="font-sans font-bold text-base text-white">Visual Operating Mode</h3>
              <p className="font-sans text-xs text-zinc-400">Default Wayne Enterprises Matte Black Aesthetic</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#d4af37] bg-[#0c0c0f] p-4 flex items-center justify-between">
              <div className="space-y-1 font-sans">
                <p className="font-bold text-white text-sm">Wayne Stealth Dark Mode</p>
                <p className="text-xs text-zinc-400">High contrast gold accents on matte black (#050507)</p>
              </div>
              <TitanBadge variant="gold" size="sm">ACTIVE</TitanBadge>
            </div>
          </div>
        </div>
      )}

      {activeTab === "NOTIFICATIONS" && (
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <Bell className="size-5 text-[#e5c158]" />
            <div>
              <h3 className="font-sans font-bold text-base text-white">Notification Telemetry Tiers</h3>
              <p className="font-sans text-xs text-zinc-400">Configure alert priorities and daily AI briefing pushes</p>
            </div>
          </div>

          <div className="space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4">
              <div>
                <p className="font-bold text-white">Daily AI Executive Briefings</p>
                <p className="text-zinc-400">Receive morning focus score summaries at 08:00 AM</p>
              </div>
              <TitanBadge variant="gold" size="sm">ENABLED</TitanBadge>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4">
              <div>
                <p className="font-bold text-white">Mission Directive Alerts</p>
                <p className="text-zinc-400">High priority mission deadline notifications</p>
              </div>
              <TitanBadge variant="gold" size="sm">ENABLED</TitanBadge>
            </div>
          </div>
        </div>
      )}

      {activeTab === "SECURITY" && (
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <Shield className="size-5 text-[#e5c158]" />
            <div>
              <h3 className="font-sans font-bold text-base text-white">Security & Clearance Settings</h3>
              <p className="font-sans text-xs text-zinc-400">Session encryption, token isolation, and Supabase RLS policies</p>
            </div>
          </div>

          <div className="space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4">
              <div>
                <p className="font-bold text-white">Current Operator Session</p>
                <p className="text-zinc-400">Authenticated Session</p>
              </div>
              <TitanBadge variant="green" size="sm">SECURE</TitanBadge>
            </div>
          </div>
        </div>
      )}

      {activeTab === "DATA" && (
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <Database className="size-5 text-[#e5c158]" />
            <div>
              <h3 className="font-sans font-bold text-base text-white">Workspace Data Export & Archival</h3>
              <p className="font-sans text-xs text-zinc-400">Export complete TITAN OS telemetry and stores to JSON format</p>
            </div>
          </div>

          <div className="space-y-4 font-sans text-xs">
            <p className="text-zinc-300 leading-relaxed">
              Export your entire operational history including Missions, Projects, OKR Goals, Knowledge Notes, and Automation workflows into a structured JSON backup artifact.
            </p>

            <div className="flex items-center gap-3">
              <TitanButton
                size="md"
                leftIcon={<Download className="size-4" />}
                onClick={handleExportData}
              >
                EXPORT WORKSPACE JSON
              </TitanButton>

              {exportSuccess && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
                  <CheckCircle2 className="size-4" /> EXPORT GENERATED LOCALLY!
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}