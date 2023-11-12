import type { LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { defer, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import ProjectBoardSprintSelector from "~/components/board/ProjectBoardSprintSelector";
import { getActiveSprints } from "~/api/methods/project";
import NotFoundError from "~/components/errors/NotFoundError";
import CustomError from "~/components/errors/CustomError";
import React from "react";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (token === undefined) {
    redirect("/user/login");
  }

  const sprintsPromise = getActiveSprints({
    projectId: params.projectId!,
    token: token!,
  });

  return defer({ sprintsPromise });
};

export function ErrorBoundary() {
  const error = useRouteError();
  // @ts-ignore
  return <>{error.statusCode === 404 ? <NotFoundError /> : <CustomError />}</>;
}

export default function BoardPage() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-ignore
  const { sprintsPromise } = loaderData;

  return (
    <div className="flex h-full w-full flex-col">
      <ProjectBoardSprintSelector
        sprintsPromise={sprintsPromise}
        route={"board"}
      />
      <Outlet />
    </div>
  );
}
