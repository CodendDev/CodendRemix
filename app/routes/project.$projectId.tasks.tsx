import React, { useState } from "react";
import { loader as BoardLoader } from "~/routes/project.$projectId.board";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import {
  BoardQueryContext,
  queryFilterBoardTasks,
} from "~/components/board/ProjectBoardFilter";
import ProjectBoardHeader from "~/components/board/ProjectBoardHeader";

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
    <div className="flex h-full flex-col">
      <BoardQueryContext.Provider
        value={{ query, setQuery, filter: queryFilterBoardTasks }}
      >
        <ProjectBoardHeader
          route={`/project/${projectId}/tasks`}
          sprintsPromise={sprintsPromise}
          filterable
        />
        {location ? (
          <div className="flex h-full items-center justify-center">
            <>Select sprint to see tasks assigned to you.</>
          </div>
        ) : (
          <Outlet />
        )}
      </BoardQueryContext.Provider>
    </div>
  );
}
