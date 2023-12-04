import {
  action as ProjectTaskAction,
  loader as ProjectTaskLoader,
} from "~/routes/api/projectTask/projectTaskGetDeletePutAction";
import React from "react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import BoardTaskSidebar from "~/routes/project.$projectId.board.$sprintId.$projectTaskId.$taskType/route";

export const action = async (args: ActionFunctionArgs) => {
  const response = await ProjectTaskAction(args);
  if (args.request.method === "DELETE") {
    return redirect(
      `/project/${args.params.projectId!}/tasks/${args.params.sprintId!}`
    );
  }
  return response;
};

export const loader = ProjectTaskLoader;

export default function TasksTaskSidebar() {
  return <BoardTaskSidebar route="tasks" />;
}
