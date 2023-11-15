import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { defer, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import {
  deleteProjectTask,
  getProjectTask,
  updateProjectTask,
} from "~/api/methods/projectTask";
import TaskSidebar from "~/components/taskSidebar/TaskSidebar";
import { getProjectTaskStatuses } from "~/api/methods/projectTaskStauses";
import { getMembers } from "~/api/methods/project";
import { ProjectTask } from "~/api/types/baseEntitiesTypes";
import { deleteEpic, getEpic, updateEpic } from "~/api/methods/epic";
import { deleteStory, getStory, updateStory } from "~/api/methods/story";
import { formatStringToEstimatedTime } from "~/components/utils/EstimatedTimeUtils";

export const action = async (args: ActionFunctionArgs) => {
  switch (args.request.method) {
    case "DELETE":
      return await actionDelete(args);
    case "PUT":
      return await actionPut(args);
  }
};

const actionDelete = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    redirect("/user/login");
  }
  const projectId = params.projectId!;
  const projectTaskId = params.projectTaskId!;
  const taskType = params.taskType!;

  let response: any;

  switch (taskType.toLowerCase()) {
    case "bugfix":
    case "base":
      response = await deleteProjectTask({
        token: token!,
        projectId,
        projectTaskId,
      });
      break;
    case "story":
      response = await deleteStory({
        token: token!,
        projectId,
        id: projectTaskId,
      });
      break;
    case "epic":
      response = await deleteEpic({
        token: token!,
        projectId,
        id: projectTaskId,
      });
      break;
    default:
      throw new Error("Unsupported TaskType");
  }
  if (response) {
    return redirect(`/project/${projectId}/backlog`);
  }
  return undefined;
};

const actionPut = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }
  const projectId = params.projectId!;
  const projectTaskId = params.projectTaskId!;
  const taskType = params.taskType!;

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const task = {
    name: data.name.toString().trim(),
    priority: data.priority?.toString(),
    statusId: data.statusId.toString(),
    description: data.description?.toString().trim(),
    dueDate: data.dueDate?.toString(),
    estimatedTime: formatStringToEstimatedTime(
      data.estimatedTimeString?.toString()
    )!,
    storyPoints: +data.storyPoints?.toString(),
    assigneeId: data.assigneeId?.toString(),
    storyId: data.storyId?.toString(),
    epicId: data.epicId?.toString(),
  };

  switch (taskType.toLowerCase()) {
    case "bugfix":
    case "base":
      return await updateProjectTask({
        token: token!,
        projectId,
        projectTaskId,
        taskType,
        ...task,
      });
    case "story":
      return await updateStory({
        token: token!,
        projectId,
        id: projectTaskId,
        ...task,
      });
    case "epic":
      return await updateEpic({
        token: token!,
        projectId,
        id: projectTaskId,
        ...task,
      });
    default:
      throw new Error("Unsupported TaskType");
  }
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }
  const projectId = params.projectId!;
  const projectTaskId = params.projectTaskId!;
  const taskType = params.taskType!;

  const projectTaskStatusesPromise = getProjectTaskStatuses({
    projectId: projectId,
    token: token!,
  });
  const projectMembersPromise = getMembers({
    projectId: projectId,
    token: token!,
  });
  const [projectTaskStatusesResponse, projectMembers] = await Promise.all([
    projectTaskStatusesPromise,
    projectMembersPromise,
  ]);

  const projectTaskPromise = getProjectTaskByType({
    token: token!,
    projectId,
    projectTaskId,
    taskType,
  });

  return defer({
    projectTaskPromise,
    projectTaskStatusesResponse,
    projectMembers,
  });
};

export const getProjectTaskByType = ({
  token,
  projectId,
  projectTaskId,
  taskType,
}: {
  token: string;
  projectId: string;
  projectTaskId: string;
  taskType: string;
}): Promise<ProjectTask | undefined> => {
  switch (taskType.toLowerCase()) {
    case "bugfix":
    case "base": {
      return getProjectTask({
        projectId: projectId,
        token: token!,
        projectTaskId: projectTaskId,
      });
    }
    case "story": {
      return getStory({
        projectId: projectId,
        token: token!,
        id: projectTaskId,
      });
    }
    case "epic": {
      return getEpic({
        projectId: projectId,
        token: token!,
        id: projectTaskId,
      });
    }
    default:
      throw new Error("Unknown TaskType.");
  }
};

export default function BoardPage() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-ignore
  const { projectTaskPromise, projectTaskStatusesResponse, projectMembers } =
    loaderData;

  return (
    <>
      <TaskSidebar
        projectTaskPromise={projectTaskPromise}
        projectTaskStatusesResponse={projectTaskStatusesResponse!}
        projectMembers={projectMembers!}
      />
      <Outlet />
    </>
  );
}
