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
import { LuLogOut } from "react-icons/lu/index.js";
import { Button } from "@nextui-org/react";

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
    <div className="flex h-full flex-col">
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
    <div className="flex h-full w-56 flex-col overflow-y-auto">
      <ProjectNavigationBarContext.Provider value={{ setProjectName: setName }}>
        <ProjectNavigationList
          projects={projects}
          selectedProjectId={projectId}
        />
        <ProjectNameDivider name={name} />
        <ProjectNavigationActionsList projectId={projectId} />{" "}
        <div className="mb-2 mt-auto flex flex-row px-3">
          <Button
            variant="ghost"
            color="primary"
            fullWidth
            endContent={<LuLogOut />}
            className="text-md font-bold"
            onPress={() => {}}
          >
            Log Out
          </Button>
        </div>
      </ProjectNavigationBarContext.Provider>
    </div>
  );
}

export default ProjectNavigationBar;
