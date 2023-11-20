import { Outlet, useLoaderData, useParams } from "@remix-run/react";
import {
  action as ProjectTaskAction,
  loader as ProjectTaskLoader,
} from "~/routes/api/projectTask/projectTaskGetDeletePutAction";
import TaskSidebar from "~/components/taskSidebar/TaskSidebar";
import React from "react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

export const action = async (args: ActionFunctionArgs) => {
  const response = await ProjectTaskAction(args);
  if (args.request.method === "DELETE") {
    return redirect(
      `/project/${args.params.projectId!}/board/${args.params.sprintId!}`
    );
  }
  return response;
};

export const loader = ProjectTaskLoader;

export default function BoardTaskSidebar() {
  const loaderData = useLoaderData<typeof loader>();
  const params = useParams();

  // @ts-ignore
  const { projectTaskPromise } = loaderData;

  return (
    <>
      <TaskSidebar
        projectTaskPromise={projectTaskPromise}
        actionRouteRoot={`/project/${params.projectId!}/board/${params.sprintId!}`}
      />
      <Outlet />
    </>
  );
}
