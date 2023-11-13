import { ProjectTask } from "~/api/types/baseEntitiesTypes";
import { getAxiosInstance } from "~/api/axios";
import { GetEpicRequest } from "~/api/types/epicTypes";

export async function getEpic({
  projectId,
  epicId,
  token,
}: GetEpicRequest): Promise<ProjectTask | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/epics/${epicId}`
    );
    return { ...response.data, taskType: "Epic" };
  } catch (err) {
    return undefined;
  }
}
