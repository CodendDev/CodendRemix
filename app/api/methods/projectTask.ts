import { getApiErrorsFromError, getAxiosInstance } from "~/api/axios";
import {
  CreateProjectTaskRequest,
  ProjectTaskRequest,
  UpdateProjectTaskRequest,
} from "~/api/types/projectTaskTypes";
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

export async function deleteProjectTask({
  projectId,
  projectTaskId,
  token,
}: ProjectTaskRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.delete(
      `/api/projects/${projectId}/tasks/${projectTaskId}`
    );
    return response.status;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

export async function updateProjectTask(request: UpdateProjectTaskRequest) {
  const { projectId, projectTaskId, token } = request;
  const axios = getAxiosInstance(token);

  const apiRequest = {
    name: request.name,
    priority: request.priority,
    statusId: request.statusId,
    description: {
      shouldUpdate: true,
      value: request.description,
    },
    dueDate: {
      shouldUpdate: true,
      value:
        request.dueDate?.length === 0
          ? undefined
          : `${request.dueDate}T23:59:00.000Z`,
    },
    storyPoints: {
      shouldUpdate: true,
      value: request.storyPoints,
    },
    estimatedTime: {
      shouldUpdate: true,
      value: request.estimatedTime,
    },
    assigneeId: {
      shouldUpdate: true,
      value: request.assigneeId,
    },
    storyId: {
      shouldUpdate: true,
      value: request.storyId,
    },
  };

  try {
    const response = await axios.put(
      `/api/projects/${projectId}/tasks/${request.taskType.toLowerCase()}/${projectTaskId}`,
      apiRequest
    );
    return response.status;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

export async function createProjectTask(request: CreateProjectTaskRequest) {
  const { projectId, token } = request;
  const axios = getAxiosInstance(token);

  const apiRequest = {
    name: request.name,
    priority: request.priority,
    statusId: request.statusId,
    description: request.description,
    dueDate: `${request.dueDate}T23:59:00.000Z`,
    storyPoints: request.storyPoints,
    estimatedTime: request.estimatedTime,
    assigneeId: request.assigneeId,
    storyId: request.storyId,
  };

  try {
    const response = await axios.post(
      `/api/projects/${projectId}/tasks/${request.taskType.toLowerCase()}`,
      apiRequest
    );
    return response.status;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}
