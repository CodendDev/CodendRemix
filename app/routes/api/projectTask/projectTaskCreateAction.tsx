import { ActionFunctionArgs, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { createProjectTask } from "~/api/methods/projectTask";
import { createStory } from "~/api/methods/story";
import { createEpic } from "~/api/methods/epic";
import { formatStringToEstimatedTime } from "~/components/utils/EstimatedTimeUtils";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }
  const projectId = params.projectId!;
  const sprintId = params.sprintId;

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const task = {
    name: data.name.toString().trim(),
    taskType: data.taskType.toString(),
    priority: data.priority?.toString(),
    statusId: data.statusId.toString(),
    description: data.description?.toString().trim(),
    dueDate: data.dueDate?.toString(),
    estimatedTime: formatStringToEstimatedTime(
      data.estimatedTimeString?.toString()
    )!,
    storyPoints: +data.storyPoints?.toString(),
    assigneeId:
      data.assigneeId?.toString() === ""
        ? undefined
        : data.assigneeId?.toString(),
    storyId:
      data.storyId?.toString() === "" ? undefined : data.storyId?.toString(),
    epicId:
      data.epicId?.toString() === "" ? undefined : data.epicId?.toString(),
  };

  switch (task.taskType.toLowerCase()) {
    case "bugfix":
    case "base":
      return await createProjectTask({
        token: token!,
        projectId,
        sprintId,
        ...task,
      });
    case "story":
      return await createStory({
        token: token!,
        projectId,
        sprintId,
        ...task,
      });
    case "epic":
      return await createEpic({
        token: token!,
        projectId,
        sprintId,
        ...task,
      });
    default:
      throw new Error("Unsupported TaskType");
  }
};
