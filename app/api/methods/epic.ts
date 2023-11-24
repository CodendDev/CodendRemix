import { ProjectTask } from "~/api/types/baseEntitiesTypes";
import { getAxiosInstance } from "~/api/axios";
import {
  CreateEpicRequest,
  GetEpicRequest,
  UpdateEpicRequest,
} from "~/api/types/epicTypes";

export async function getEpic({
  projectId,
  id,
  token,
}: GetEpicRequest): Promise<ProjectTask | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(`/api/projects/${projectId}/epics/${id}`);
    return { ...response.data, taskType: "Epic" };
  } catch (err) {
    return undefined;
  }
}

export async function deleteEpic({
  projectId,
  id,
  token,
}: GetEpicRequest): Promise<ProjectTask | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.delete(
      `/api/projects/${projectId}/epics/${id}`
    );
    return { ...response.data, taskType: "Epic" };
  } catch (err) {
    return undefined;
  }
}

export async function createEpic(request: CreateEpicRequest) {
  const { token, projectId } = request;
  const axios = getAxiosInstance(token);

  const apiRequest = {
    name: request.name,
    description: request.description,
    statusId: request.statusId,
    sprintId: request.sprintId,
  };

  try {
    const response = await axios.post(
      `/api/projects/${projectId}/epics`,
      apiRequest
    );
    return response.status;
  } catch (err) {
    return undefined;
  }
}

export async function updateEpic(request: UpdateEpicRequest) {
  const { token, id, projectId } = request;
  const axios = getAxiosInstance(token);

  const apiRequest = {
    name: request.name,
    description: request.description,
    statusId: request.statusId,
  };

  try {
    const response = await axios.put(
      `/api/projects/${projectId}/epics/${id}`,
      apiRequest
    );
    return response.status;
  } catch (err) {
    return undefined;
  }
}
