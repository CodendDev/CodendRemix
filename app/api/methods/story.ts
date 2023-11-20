import { getAxiosInstance } from "~/api/axios";
import {
  CreateStoryRequest,
  GetStoryRequest,
  UpdateStoryRequest,
} from "~/api/types/storyTypes";
import { ProjectTask } from "~/api/types/baseEntitiesTypes";

export async function getStory({
  projectId,
  id,
  token,
}: GetStoryRequest): Promise<ProjectTask | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/stories/${id}`
    );
    return { ...response.data, taskType: "Story" };
  } catch (err) {
    return undefined;
  }
}

export async function deleteStory({
  projectId,
  id,
  token,
}: GetStoryRequest): Promise<ProjectTask | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.delete(
      `/api/projects/${projectId}/stories/${id}`
    );
    return { ...response.data, taskType: "Story" };
  } catch (err) {
    return undefined;
  }
}

export async function createStory(request: CreateStoryRequest) {
  const { token, projectId } = request;
  const axios = getAxiosInstance(token);

  const apiRequest = {
    name: request.name,
    description: request.description,
    statusId: request.statusId,
    epicId: request.epicId,
    sprintId: request.sprintId,
  };

  try {
    const response = await axios.post(
      `/api/projects/${projectId}/stories`,
      apiRequest
    );
    return response.status;
  } catch (err) {
    return undefined;
  }
}

export async function updateStory(request: UpdateStoryRequest) {
  const { token, id, projectId } = request;
  const axios = getAxiosInstance(token);

  const apiRequest = {
    name: request.name,
    description: request.description,
    statusId: request.statusId,
    epicId: {
      shouldUpdate: true,
      value: request.epicId,
    },
  };

  try {
    const response = await axios.put(
      `/api/projects/${projectId}/stories/${id}`,
      apiRequest
    );
    return response.status;
  } catch (err) {
    return undefined;
  }
}
