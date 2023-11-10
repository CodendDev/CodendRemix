import type { ActionFunctionArgs } from "@remix-run/node";
import { deleteSprint } from "~/api/methods/sprint";
import getToken from "~/actions/getToken";

export const action = async (args: ActionFunctionArgs) => {
  switch (args.request.method) {
    case "DELETE":
      return actionDelete(args);
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
