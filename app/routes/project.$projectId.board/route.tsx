import type { LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { defer, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import ProjectBoardSprintSelector from "~/components/board/ProjectBoardSprintSelector";
import { getActiveSprints } from "~/api/methods/project";
import React from "react";
import CreateSprintTip from "~/components/board/CreateSprintTip";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const projectId = params.projectId!;
  const sprintsPromise = getActiveSprints({ projectId, token: token! });

  return defer({ sprintsPromise, projectId });
};

export default function BoardPage() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-ignore
  const { sprintsPromise, projectId } = loaderData;

  return (
    <div className="flex h-full w-full flex-col">
      <ProjectBoardSprintSelector
        route={`/project/${projectId}/board`}
        sprintsPromise={sprintsPromise}
        noSprintsComponent={CreateSprintTip({ projectId })}
      />
      <Outlet />
    </div>
  );
}
