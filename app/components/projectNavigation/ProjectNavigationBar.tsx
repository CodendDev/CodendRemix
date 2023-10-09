import type { Project } from "~/api/types/baseEntitiesTypes";
import ProjectNavigationList from "~/components/projectNavigation/ProjectNavigationList";
import ProjectNavigationActionsList from "~/components/projectNavigation/ProjectNavigationActionsList";

type ProjectNavigationBarProps = {
  projects: Project[];
  selectedProjectId?: string;
};

export function ProjectNavigationBar({
  projects,
  selectedProjectId,
}: ProjectNavigationBarProps) {
  return (
    <div className="flex flex-col">
      <ProjectNavigationList {...{ projects, selectedProjectId }} />
      {selectedProjectId && <ProjectNavigationActionsList />}
    </div>
  );
}

export default ProjectNavigationBar;
