import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { ApiErrorResponse } from "~/api/types/apiErrorsTypes";
import {
  deleteProjectTaskStatus,
  updateProjectTaskStatus,
} from "~/api/methods/projectTaskStauses";
import getToken from "~/actions/getToken";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    redirect("/user/login");
  }
  const body = await request.formData();
  const data = Object.fromEntries(body);
  const errorHandler = (errors: ApiErrorResponse[]) => json({ errors });
  const projectId = params.projectId!;
  const statusId = params.statusId!;

  switch (request.method) {
    case "PUT": {
      if (data.name === undefined) {
        return errorHandler([]);
      }
      const editStatusResponse = await updateProjectTaskStatus({
        projectId: projectId,
        token: token!,
        statusId: statusId!,
        request: {
          name: data.name.toString().trim(),
        },
      });

      if (
        editStatusResponse === undefined ||
        editStatusResponse.errors !== undefined
      ) {
        return errorHandler(editStatusResponse?.errors ?? []);
      }
      return;
    }
    case "DELETE": {
      const deleteStatusResponse = await deleteProjectTaskStatus({
        projectId: projectId,
        token: token!,
        statusId: statusId!,
      });

      if (
        deleteStatusResponse === undefined ||
        deleteStatusResponse.errors !== undefined
      ) {
        return errorHandler(deleteStatusResponse?.errors ?? []);
      }
      return;
    }
  }
  return;
};
