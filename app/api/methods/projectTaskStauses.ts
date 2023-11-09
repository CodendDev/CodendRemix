import { getApiErrorsFromError, getAxiosInstance } from "~/api/axios";
import type {
  CreateProjectTaskStatusRequest,
  DeleteProjectTaskStatusRequest,
  ProjectTaskStatusesRequest,
  ProjectTaskStatusesResponse,
} from "~/api/types/projectTaskStatusesTypes";
import { UpdateProjectTaskStatusRequest } from "~/api/types/projectTaskStatusesTypes";

export async function getProjectTaskStatuses({
  projectId,
  token,
}: ProjectTaskStatusesRequest): Promise<
  ProjectTaskStatusesResponse | undefined
> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/task-statuses`
    );
    return { projectTaskStatuses: response.data };
  } catch (err) {
    return undefined;
  }
}

export async function createProjectTaskStatus({
  projectId,
  token,
  request,
}: CreateProjectTaskStatusRequest) {
  const axios = getAxiosInstance(token);

  try {
    await axios.post(`/api/projects/${projectId}/task-statuses`, request);
    return;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

export async function deleteProjectTaskStatus({
  projectId,
  token,
  statusId,
}: DeleteProjectTaskStatusRequest) {
  const axios = getAxiosInstance(token);

  try {
    await axios.delete(`/api/projects/${projectId}/task-statuses/${statusId}`);
    return;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

export async function updateProjectTaskStatus({
  projectId,
  token,
  statusId,
  request,
}: UpdateProjectTaskStatusRequest) {
  const axios = getAxiosInstance(token);

  try {
    await axios.put(
      `/api/projects/${projectId}/task-statuses/${statusId}`,
      request
    );
    return;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}
