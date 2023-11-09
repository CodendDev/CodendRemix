import { getAxiosInstance } from "~/api/axios";
import { ProjectTaskRequest } from "~/api/types/projectTaskTypes";
import { ProjectTask } from "~/api/types/baseEntitiesTypes";

export async function getProjectTask({
  projectId,
  projectTaskId,
  token,
}: ProjectTaskRequest): Promise<ProjectTask | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/tasks/${projectTaskId}`
    );
    return response.data;
  } catch (err) {
    return undefined;
  }
}
