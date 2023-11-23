import { Outlet, useParams } from "@remix-run/react";
import React from "react";
import { action as ProjectTaskAction } from "~/routes/api/projectTask/projectTaskCreateAction";
import CreateTaskSidebar from "~/components/taskSidebar/CreateTaskSidebar";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { emptyTask } from "~/api/types/projectTaskTypes";

export const action = async (args: ActionFunctionArgs) => {
  await ProjectTaskAction(args);
  return redirect(
    `/project/${args.params.projectId!}/board/${args.params.sprintId!}`
  );
};

export default function BoardTaskSidebarCreate() {
  const params = useParams();

  return (
    <>
      <CreateTaskSidebar
        emptyTask={emptyTask(params.statusId!)}
        actionRouteRoot={`/project/${params.projectId!}/board/${params.sprintId!}/${params.statusId!}`}
        cancelRoute={`/project/${params.projectId!}/board/${params.sprintId!}`}
      />
      <Outlet />
    </>
  );
}
