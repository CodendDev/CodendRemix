import { Outlet, useLoaderData } from "@remix-run/react";
import {
  action as ProjectTaskAction,
  loader as ProjectTaskLoader,
} from "~/routes/api/projectTask/projectTaskGetDeletePutAction";
import TaskSidebar from "~/components/taskSidebar/TaskSidebar";
import React from "react";

export const action = ProjectTaskAction;

export const loader = ProjectTaskLoader;

export default function BoardTaskSidebar() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-ignore
  const { projectTaskPromise } = loaderData;

  return (
    <>
      <TaskSidebar projectTaskPromise={projectTaskPromise} isFixed={true} />
      <Outlet />
    </>
  );
}
