import type { PagedResponse, Project } from "~/api/types/baseEntitiesTypes";
import ProjectNavigationList from "~/components/projectNavigation/ProjectNavigationList";
import ProjectNavigationActionsList from "~/components/projectNavigation/ProjectNavigationActionsList";
import { Await, useLocation } from "@remix-run/react";
import React, { Suspense } from "react";

type ProjectNavigationBarProps = {
  projectsPromise: Promise<PagedResponse<Project>>;
};

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
            <>
              <ProjectNavigationList
                projects={projects.data!.items}
                selectedProjectId={projectId}
              />
              <ProjectNavigationActionsList projectId={projectId} />
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export default ProjectNavigationBar;
