import type { LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { defer, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import NotFoundError from "~/components/errors/NotFoundError";
import CustomError from "~/components/errors/CustomError";
import React from "react";
import { getProjectTask } from "~/api/methods/projectTask";
import TaskSidebar from "~/components/taskSidebar/TaskSidebar";
import { getProjectTaskStatuses } from "~/api/methods/projectTaskStauses";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    redirect("/user/login");
  }
  const projectId = params.projectId!;
  const projectTaskId = params.projectTaskId!;
  const taskType = params.taskType!;

  const projectTaskStatusesResponse = await getProjectTaskStatuses({
    projectId: projectId,
    token: token!,
  });

  switch (taskType.toLowerCase()) {
    case "bugfix":
    case "base": {
      const projectTaskPromise = getProjectTask({
        projectId: projectId,
        token: token!,
        projectTaskId: projectTaskId,
      });

      return defer({ projectTaskPromise, projectTaskStatusesResponse });
    }
  }
  return undefined;
};

export function ErrorBoundary() {
  const error = useRouteError();
  // @ts-ignore
  return <>{error.statusCode === 404 ? <NotFoundError /> : <CustomError />}</>;
}

export default function BoardPage() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-ignore
  const { projectTaskPromise, projectTaskStatusesResponse } = loaderData;

  return (
    <>
      <TaskSidebar
        projectTaskPromise={projectTaskPromise}
        projectTaskStatusesResponse={projectTaskStatusesResponse}
      />
      <Outlet />
    </>
  );
}
