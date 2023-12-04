import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { moveProjectTaskStatus } from "~/api/methods/projectTaskStauses";
import getToken from "~/actions/getToken";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const projectId = params.projectId!;
  const statusId = params.statusId!;
  const data = Object.fromEntries(await request.formData());
  const prev = data.prev.toString();
  const next = data.next.toString();
  if (request.method !== "POST") {
    return;
  }

  return await moveProjectTaskStatus({
    projectId,
    token,
    statusId,
    prev,
    next,
  });
};
