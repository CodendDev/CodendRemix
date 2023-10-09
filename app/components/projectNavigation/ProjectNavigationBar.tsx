import type { Project } from "~/api/types/baseEntitiesTypes";
import ProjectNavigationList from "~/components/projectNavigation/ProjectNavigationList";
import ProjectNavigationActionsList from "~/components/projectNavigation/ProjectNavigationActionsList";
import { useLocation } from "@remix-run/react";

type ProjectNavigationBarProps = {
  projects: Project[];
  selectedProjectId?: string;
};

export function ProjectNavigationBar({
  projects,
  selectedProjectId,
}: ProjectNavigationBarProps) {
  const action = useLocation().pathname.replace(
    `/project/${selectedProjectId}/`,
    ""
  );

  return (
    <div className="flex flex-col">
      <ProjectNavigationList {...{ projects, selectedProjectId }} />
      {selectedProjectId && <ProjectNavigationActionsList action={action} />}
    </div>
  );
}

export default ProjectNavigationBar;
