import { useNavigate } from "react-router-dom";
import { BookOpen, Bot, Calendar, FolderKanban, PlusCircle, Sparkles, Zap } from "lucide-react";
import { TitanButton } from "@/components/ui";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            GLOBAL QUICK ACTIONS
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <TitanButton
          size="sm"
          leftIcon={<PlusCircle className="size-3.5" />}
          onClick={() => navigate("/habits")}
        >
          NEW MISSION
        </TitanButton>

        <TitanButton
          size="sm"
          variant="outline"
          leftIcon={<Calendar className="size-3.5" />}
          onClick={() => navigate("/calendar")}
        >
          TIME OS
        </TitanButton>

        <TitanButton
          size="sm"
          variant="outline"
          leftIcon={<Bot className="size-3.5" />}
          onClick={() => navigate("/ai-core")}
        >
          AI OS CORE
        </TitanButton>

        <TitanButton
          size="sm"
          variant="outline"
          leftIcon={<BookOpen className="size-3.5" />}
          onClick={() => navigate("/knowledge")}
        >
          KNOWLEDGE VAULT
        </TitanButton>

        <TitanButton
          size="sm"
          variant="outline"
          leftIcon={<FolderKanban className="size-3.5" />}
          onClick={() => navigate("/projects")}
        >
          PROJECTS & GOALS
        </TitanButton>

        <TitanButton
          size="sm"
          variant="secondary"
          leftIcon={<Zap className="size-3.5" />}
          onClick={() => navigate("/automation")}
        >
          AUTOMATION OS
        </TitanButton>
      </div>
    </div>
  );
}
