import type { PagedResponse, Project } from "~/api/types/baseEntitiesTypes";
import ProjectNavigationList from "~/components/projectNavigation/ProjectNavigationList";
import ProjectNavigationActionsList from "~/components/projectNavigation/ProjectNavigationActionsList";
import { Await, useLocation } from "@remix-run/react";
import React, { Suspense, useState } from "react";
import ProjectNameDivider from "~/components/projectNavigation/ProjectNameDivider";

type ProjectNavigationBarProps = {
  projectsPromise: Promise<PagedResponse<Project>>;
};

export const ProjectNavigationBarContext = React.createContext<{
  setProjectName: (name: string) => void;
}>({
  setProjectName: () => {},
});

export function ProjectNavigationBar({
  projectsPromise,
}: ProjectNavigationBarProps) {
  const projectId = useLocation()
    .pathname.toLowerCase()
    .replace("/project/", "")
    .slice(0, 36);

  return (
    <div className="flex flex-col">
      <Suspense fallback={<>Loading</>}>
        <Await resolve={projectsPromise} errorElement={<>Error</>}>
          {(projects) => (
            <AwaitedProjectNavigationBar
              projects={projects.data!.items}
              projectId={projectId}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function AwaitedProjectNavigationBar({
  projectId,
  projects,
}: {
  projectId: string;
  projects: Project[];
}) {
  const project = projects.find((p) => p.id === projectId);
  const [name, setName] = useState<string | undefined>(project?.name);

  return (
    <ProjectNavigationBarContext.Provider value={{ setProjectName: setName }}>
      <ProjectNavigationList
        projects={projects}
        selectedProjectId={projectId}
      />
      {name && (
        <>
          <ProjectNameDivider name={name} />
          <ProjectNavigationActionsList projectId={projectId} />{" "}
        </>
      )}
    </ProjectNavigationBarContext.Provider>
  );
}

export default ProjectNavigationBar;
