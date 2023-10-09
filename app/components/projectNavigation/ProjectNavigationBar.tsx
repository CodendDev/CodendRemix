import type { Project } from "~/api/types/baseEntitiesTypes";
import ProjectNavigationList from "~/components/projectNavigation/ProjectNavigationList";
import ProjectNavigationActionsList from "~/components/projectNavigation/ProjectNavigationActionsList";
import { useLocation } from "@remix-run/react";
import React from "react";
import { Divider } from "@nextui-org/react";

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

  const project = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="flex flex-col">
      <ProjectNavigationList {...{ projects, selectedProjectId }} />
      {project && <ProjectNameDivider {...project} />}
      {selectedProjectId && <ProjectNavigationActionsList action={action} />}
    </div>
  );
}

function ProjectNameDivider({ name }: { name: string }) {
  return (
    <div className="p-2">
      <Divider orientation="horizontal" />
      <div className="w-full text-center">{name}</div>
      <Divider orientation="horizontal" />
    </div>
  );
}

export default ProjectNavigationBar;
