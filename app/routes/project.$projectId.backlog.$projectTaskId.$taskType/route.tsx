import { Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import TaskSidebar from "~/components/taskSidebar/TaskSidebar";
import {
  action as ProjectTaskAction,
  loader as ProjectTaskLoader,
} from "~/routes/api/projectTask/projectTaskGetDeletePutAction";

export const action = ProjectTaskAction;

export const loader = ProjectTaskLoader;

export default function BacklogTaskSidebar() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-ignore
  const { projectTaskPromise } = loaderData;

  return (
    <>
      <TaskSidebar projectTaskPromise={projectTaskPromise} />
      <Outlet />
    </>
  );
}
