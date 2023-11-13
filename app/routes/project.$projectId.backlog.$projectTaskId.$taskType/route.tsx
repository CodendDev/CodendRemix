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
import { getMembers } from "~/api/methods/project";
import { ProjectTask } from "~/api/types/baseEntitiesTypes";
import { getEpic } from "~/api/methods/epic";
import { getStory } from "~/api/methods/story";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    redirect("/user/login");
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
        storyId: projectTaskId,
      });
    }
    case "epic": {
      return getEpic({
        projectId: projectId,
        token: token!,
        epicId: projectTaskId,
      });
    }
    default:
      throw new Error("Unknown TaskType.");
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  // @ts-ignore
  return <>{error.statusCode === 404 ? <NotFoundError /> : <CustomError />}</>;
}

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
