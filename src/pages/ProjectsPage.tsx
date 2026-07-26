import { useState } from "react";
import { useProjects } from "@/hooks/projects/useProjects";
import { SectionHeader } from "@/components/ui";
import ProjectsToolbar from "@/components/projects/ProjectsToolbar";
import KanbanBoard from "@/components/projects/KanbanBoard";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import RoadmapView from "@/components/projects/RoadmapView";
import GoalsView from "@/components/projects/GoalsView";
import NewProjectModal from "@/components/projects/NewProjectModal";

export default function ProjectsPage() {
  const {
    goals,
    projects,
    activeView,
    searchQuery,
    categoryFilter,
    setActiveView,
    setSearchQuery,
    setCategoryFilter,
    createProject,
    updateProjectStatus,
  } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="Wayne Strategic Execution Engine"
        title="TITAN Projects & Goals Operating System"
        description="Centralized execution layer integrating Kanban columns, milestone timelines, strategic roadmaps, and OKRs."
      />

      {/* Main Toolbar */}
      <ProjectsToolbar
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onNewProject={() => setIsModalOpen(true)}
      />

      {/* Active View Display */}
      <main className="min-w-0">
        {activeView === "kanban" && (
          <KanbanBoard projects={projects} onStatusChange={updateProjectStatus} />
        )}
        {activeView === "timeline" && <ProjectTimeline projects={projects} />}
        {activeView === "roadmap" && <RoadmapView goals={goals} projects={projects} />}
        {activeView === "goals" && <GoalsView goals={goals} />}
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={createProject}
      />
    </div>
  );
}
