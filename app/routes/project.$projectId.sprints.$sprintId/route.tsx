import type { ActionFunctionArgs } from "@remix-run/node";
import { deleteSprint, updateSprint } from "~/api/methods/sprint";
import getToken from "~/actions/getToken";

export const action = async (args: ActionFunctionArgs) => {
  switch (args.request.method) {
    case "DELETE":
      return actionDelete(args);
    case "PUT":
      return actionPut(args);
  }
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
