import type { Project } from "~/api/types/baseEntitiesTypes";

type ProjectNavigationListProps = {
  projects: Project[];
  selectedProjectId?: string;
};

export function ProjectNavigationList({
  projects,
  selectedProjectId,
}: ProjectNavigationListProps) {
  return <>{JSON.stringify(projects)}</>;
}

export default ProjectNavigationList;
