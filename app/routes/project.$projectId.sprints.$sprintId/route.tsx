import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { defer, redirect } from "@remix-run/node";

import {
  deleteSprint,
  getAssignableToSprintTasks,
  getSprint,
  sprintAssignTasks,
  sprintRemoveTasks,
  updateSprint,
} from "~/api/methods/sprint";
import { getBacklog } from "~/api/methods/project";

import getToken from "~/actions/getToken";

import SideSprint from "~/components/sprint/sideSprint/SideSprint";

export const action = async (args: ActionFunctionArgs) => {
  switch (args.request.method) {
    case "DELETE":
      return actionDelete(args);
    case "PUT":
      return actionPut(args);
    case "POST":
      return actionPost(args);
  }
};

const actionPost = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);
  const projectId = params.projectId;
  const sprintId = params.sprintId;
  if (!token || !projectId || !sprintId) {
    return;
  }

  // @ts-ignore
  const tasks = JSON.parse(Object.fromEntries(await request.formData()).tasks);

  await sprintAssignTasks({ token, sprintId, projectId, tasks });
  await sprintRemoveTasks({ token, sprintId, projectId, tasks });

  return {};
};

const actionDelete = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);
  const projectId = params.projectId;
  const sprintId = params.sprintId;

  if (!token || !projectId || !sprintId) {
    return;
  }

  return await deleteSprint({ token, projectId, sprintId });
};

const actionPut = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);
  const projectId = params.projectId;
  const sprintId = params.sprintId;

  if (!token || !projectId || !sprintId) {
    return;
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const sprint = {
    name: data.Name.toString(),
    startDate: data.StartDate.toString(),
    endDate: data.EndDate.toString(),
    goal: data.Goal.toString().trim(),
    projectId: projectId,
  };

  return await updateSprint({ token, sprintId, ...sprint });
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const projectId = params.projectId!;
  const sprintId = params.sprintId!;

  const sprint = getSprint({ sprintId, projectId, token });
  const backlog = getBacklog({ projectId, token });
  const assignableTasks = getAssignableToSprintTasks({
    projectId,
    sprintId,
    token,
  });

  return defer({ projectId, sprint, backlog, assignableTasks });
};

export default function SprintPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { projectId, sprint, backlog, assignableTasks } = loaderData;

  return (
    <div className="grow border-l-1 border-emerald-700">
      <SideSprint
        sprintPromise={sprint}
        backlogPromise={backlog}
        projectId={projectId}
        assignableTasksPromise={assignableTasks}
      />
    </div>
  );
}
