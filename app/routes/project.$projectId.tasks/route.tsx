import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import ProjectBoardHeader from "~/components/board/ProjectBoardHeader";
import React from "react";
import { loader as BoardLoader } from "~/routes/project.$projectId.board/route";

export const loader = BoardLoader;

export default function TasksPage() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-ignore
  const { sprintsPromise, projectId } = loaderData;

  // 💀
  const regExp = new RegExp(/.tasks$/g);
  const location = regExp.test(useLocation().pathname);

  return (
    <div className="flex h-full w-full flex-col">
      <ProjectBoardHeader
        sprintsPromise={sprintsPromise}
        route={`/project/${projectId}/tasks`}
        filterable
      />
      {location && (
        <div className="flex h-full items-center justify-center">
          <>Select sprint to see tasks assigned to you.</>
        </div>
      )}
      <Outlet />
    </div>
  );
}
