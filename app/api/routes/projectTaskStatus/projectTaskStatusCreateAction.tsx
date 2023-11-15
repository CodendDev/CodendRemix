import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { ApiErrorResponse } from "~/api/types/apiErrorsTypes";
import { createProjectTaskStatus } from "~/api/methods/projectTaskStauses";
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

  if (request.method !== "POST") {
    return;
  }

  if (data.name === undefined) {
    return errorHandler([]);
  }

  const createStatusResponse = await createProjectTaskStatus({
    projectId: projectId,
    token: token!,
    request: {
      name: data.name.toString().trim(),
    },
  });

  if (
    createStatusResponse === undefined ||
    createStatusResponse.errors !== undefined
  ) {
    return errorHandler(createStatusResponse?.errors ?? []);
  }
  return;
};
