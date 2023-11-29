import { ActionFunctionArgs, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { createProjectTask } from "~/api/methods/projectTask";
import { createStory } from "~/api/methods/story";
import { createEpic } from "~/api/methods/epic";
import { formatStringToEstimatedTime } from "~/components/utils/EstimatedTimeUtils";
import { moveProjectTask } from "~/api/methods/sprint";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }
  const projectId = params.projectId!;
  const sprintId = params.sprintId!;
  const taskId = params.taskId!;
  const taskType = params.taskType!;

  const formData = Object.fromEntries(await request.formData());
  const prev = formData.prev.toString();
  const next = formData.next.toString();
  const statusId = formData.statusId.toString();

  return await moveProjectTask({
    token,
    projectId,
    sprintId,
    taskId,
    taskType,
    prev,
    next,
    statusId,
  });
};
