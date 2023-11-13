import { getAxiosInstance } from "~/api/axios";
import { GetStoryRequest } from "~/api/types/storyTypes";
import { ProjectTask } from "~/api/types/baseEntitiesTypes";

export async function getStory({
  projectId,
  storyId,
  token,
}: GetStoryRequest): Promise<ProjectTask | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/stories/${storyId}`
    );
    return { ...response.data, taskType: "Story" };
  } catch (err) {
    return undefined;
  }
}
