import type { Project } from "~/api/types/baseEntitiesTypes";

type ProjectNavigationListProps = {
  projects: Project[];
  selected?: Project;
};

export function ProjectNavigationList({
  selected,
  projects,
}: ProjectNavigationListProps) {
  return <>{JSON.stringify(projects)}</>;
}

export default ProjectNavigationList;
