import type { PagedResponse, Project } from "~/api/types/baseEntitiesTypes";
import ProjectNavigationList, {
  LoadingProjectNavigationList,
} from "~/components/projectNavigation/ProjectNavigationList";
import ProjectNavigationActionsList, {
  LoadingProjectNavigationActionsList,
} from "~/components/projectNavigation/ProjectNavigationActionsList";
import { Await, useParams } from "@remix-run/react";
import React, { Suspense, useState } from "react";
import ProjectNameDivider, {
  LoadingProjectNameDivider,
} from "~/components/projectNavigation/ProjectNameDivider";

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
  const projectId = useParams().projectId;

  return (
    <div className="flex flex-col">
      <Suspense fallback={<LoadingProjectNavigationBar />}>
        <Await
          resolve={projectsPromise}
          errorElement={<ErrorProjectNavigationBar />}
        >
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

function ErrorProjectNavigationBar() {
  return (
    <>
      <LoadingProjectNavigationList error />
      <LoadingProjectNameDivider />
      <LoadingProjectNavigationActionsList />
    </>
  );
}

function LoadingProjectNavigationBar() {
  return (
    <>
      <LoadingProjectNavigationList />
      <LoadingProjectNameDivider />
      <LoadingProjectNavigationActionsList />
    </>
  );
}

function AwaitedProjectNavigationBar({
  projectId,
  projects,
}: {
  projectId: string | undefined;
  projects: Project[];
}) {
  const project = projects.find((p) => p.id === projectId);
  const [name, setName] = useState<string | undefined>(project?.name);

  return (
    <div className="w-56 overflow-y-auto">
      <ProjectNavigationBarContext.Provider value={{ setProjectName: setName }}>
        <ProjectNavigationList
          projects={projects}
          selectedProjectId={projectId}
        />
        <ProjectNameDivider name={name} />
        <ProjectNavigationActionsList projectId={projectId} />{" "}
      </ProjectNavigationBarContext.Provider>
    </div>
  );
}

export default ProjectNavigationBar;
