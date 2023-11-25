import { useLoaderData, useParams } from "@remix-run/react";
import React from "react";
import TaskSidebar from "~/components/taskSidebar/TaskSidebar";
import {
  action as ProjectTaskAction,
  loader as ProjectTaskLoader,
} from "~/routes/api/projectTask/projectTaskGetDeletePutAction";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

export const action = async (args: ActionFunctionArgs) => {
  const response = await ProjectTaskAction(args);
  if (args.request.method === "DELETE") {
    return redirect(`/project/${args.params.projectId!}/backlog`);
  }
  return response;
};

export const loader = ProjectTaskLoader;

export default function BacklogTaskSidebar() {
  const loaderData = useLoaderData<typeof loader>();
  const params = useParams();

  // @ts-ignore
  const { projectTaskPromise } = loaderData;

  return (
    <TaskSidebar
      projectTaskPromise={projectTaskPromise}
      actionRouteRoot={`/project/${params.projectId!}/backlog`}
    />
  );
}
