import { Outlet, useLoaderData } from "@remix-run/react";
import ProjectBoardSprintSelector from "~/components/board/ProjectBoardSprintSelector";
import React from "react";
import { loader as BoardLoader } from "~/routes/project.$projectId.board/route";

export const loader = BoardLoader;

export default function TasksPage() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-ignore
  const { sprintsPromise, projectId } = loaderData;

  return (
    <div className="flex h-full w-full flex-col">
      <ProjectBoardSprintSelector
        sprintsPromise={sprintsPromise}
        route={`/project/${projectId}/tasks`}
        noSprintsComponent={<>Select sprint to see tasks assigned to you.</>}
      />
      <Outlet />
    </div>
  );
}
