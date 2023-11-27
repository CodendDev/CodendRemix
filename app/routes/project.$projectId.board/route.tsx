import React, { useState } from "react";

import getToken from "~/actions/getToken";
import { getActiveSprints } from "~/api/methods/project";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { defer, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";

import ProjectBoardHeader from "~/components/board/ProjectBoardHeader";
import CreateSprintTip from "~/components/board/CreateSprintTip";
import {
  BoardQueryContext,
  queryFilterBoardTasks,
} from "~/components/board/ProjectBoardFilter";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const projectId = params.projectId!;
  const sprintsPromise = getActiveSprints({ projectId, token });

  return defer({ sprintsPromise, projectId });
};

export default function BoardPage() {
  const loaderData = useLoaderData<typeof loader>();
  const [query, setQuery] = useState("");

  // @ts-ignore
  const { sprintsPromise, projectId } = loaderData;

  // 💀
  const regExp = new RegExp(/.board$/g);
  const location = regExp.test(useLocation().pathname);

  return (
    <div className="flex h-full flex-col">
      <BoardQueryContext.Provider
        value={{ query, setQuery, filter: queryFilterBoardTasks }}
      >
        <ProjectBoardHeader
          route={`/project/${projectId}/board`}
          sprintsPromise={sprintsPromise}
          filterable
        />
        {location ? (
          <div className="flex h-full items-center justify-center">
            {CreateSprintTip({ projectId })}
          </div>
        ) : (
          <Outlet />
        )}
      </BoardQueryContext.Provider>
    </div>
  );
}
