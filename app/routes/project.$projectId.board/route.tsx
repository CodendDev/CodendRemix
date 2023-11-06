import type { LoaderFunctionArgs } from "@remix-run/node";
import ProjectBoard from "~/components/board/ProjectBoard";
import getToken from "~/actions/getToken";
import { getBoard } from "~/api/methods/project";
import { defer, redirect } from "@remix-run/node";
import { getProjectTaskStatuses } from "~/api/methods/projectTaskStauses";
import { useLoaderData, useRouteError } from "@remix-run/react";
import NotFoundError from "~/components/errors/NotFoundError";
import CustomError from "~/components/errors/CustomError";
import React from "react";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (token === undefined) {
    redirect("/user/login");
  }
  const boardPromise = getBoard({
    projectId: params.projectId!,
    token: token!,
  });

  const statusesPromise = getProjectTaskStatuses({
    projectId: params.projectId!,
    token: token!,
  });

  return defer({ boardPromise, statusesPromise });
};

export function ErrorBoundary() {
  const error = useRouteError();
  // @ts-ignore
  return <>{error.statusCode === 404 ? <NotFoundError /> : <CustomError />}</>;
}

export default function BoardPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { boardPromise, statusesPromise } = loaderData;

  return (
    <ProjectBoard
      boardPromise={boardPromise}
      statusesPromise={statusesPromise}
    />
  );
}
