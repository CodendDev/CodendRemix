import type { Project } from "~/api/types/baseEntitiesTypes";
import ProjectNavigationList from "~/components/projectNavigation/ProjectNavigationList";
import ProjectNavigationActionsList from "~/components/projectNavigation/ProjectNavigationActionsList";

type ProjectNavigationBarProps = {
  projects: Project[];
  selected?: Project;
};

export function ProjectNavigationBar({
  projects,
  selected,
}: ProjectNavigationBarProps) {
  return (
    <>
      <ProjectNavigationList {...{ projects, selected }} />
      {selected && <ProjectNavigationActionsList />}
    </>
  );
}

export default ProjectNavigationBar;
