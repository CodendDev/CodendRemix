import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import ProjectBoardHeader from "~/components/board/ProjectBoardHeader";
import React, { useState } from "react";
import { loader as BoardLoader } from "~/routes/project.$projectId.board/route";
import {
  BoardQueryContext,
  queryFilterBoardTasks,
} from "~/components/board/ProjectBoardFilter";

export const loader = BoardLoader;

export default function TasksPage() {
  const loaderData = useLoaderData<typeof loader>();

  const [query, setQuery] = useState("");

  // @ts-ignore
  const { sprintsPromise, projectId } = loaderData;

  // 💀
  const regExp = new RegExp(/.tasks$/g);
  const location = regExp.test(useLocation().pathname);

  return (
    <div className="flex w-full grow flex-col overflow-x-clip">
      <BoardQueryContext.Provider
        value={{ query, setQuery, filter: queryFilterBoardTasks }}
      >
        <ProjectBoardHeader
          route={`/project/${projectId}/tasks`}
          sprintsPromise={sprintsPromise}
          filterable
        />
        {location && (
          <div className="flex h-full items-center justify-center">
            <>Select sprint to see tasks assigned to you.</>
          </div>
        )}
        <Outlet />
      </BoardQueryContext.Provider>
    </div>
  );
}
