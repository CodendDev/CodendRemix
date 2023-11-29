import type {
  SprintsResponse,
  SprintsRequest,
  CreateSprintRequest,
  DeleteSprintRequest,
  UpdateSprintRequest,
  SprintRequest,
  SprintAssignTasksRequest,
  MoveProjectTaskRequest,
} from "~/api/types/sprintTypes";
import { getApiErrorsFromError, getAxiosInstance } from "~/api/axios";

export async function getSprints({
  projectId,
  token,
}: SprintsRequest): Promise<SprintsResponse | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(`/api/projects/${projectId}/sprints`);
    return response.data;
  } catch (err) {
    return undefined;
  }
}

export async function getSprint({ sprintId, projectId, token }: SprintRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/sprints/${sprintId}`
    );
    return response.data;
  } catch (err) {
    return undefined;
  }
}

export async function getAssignableToSprintTasks({
  sprintId,
  projectId,
  token,
}: SprintRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/sprints/${sprintId}/assignable`
    );
    return response.data.tasks;
  } catch (err) {
    return undefined;
  }
}

export async function createSprint(request: CreateSprintRequest) {
  const { name, startDate, endDate, goal, projectId, token } = request;
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.post(`/api/projects/${projectId}/sprints`, {
      name,
      startDate: `${startDate}T00:01:00.000Z`,
      endDate: `${endDate}T23:59:00.000Z`,
      goal: goal.length === 0 ? null : goal,
    });
    return response.data;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

export async function deleteSprint({
  token,
  projectId,
  sprintId,
}: DeleteSprintRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.delete(
      `/api/projects/${projectId}/sprints/${sprintId}`
    );
    return response.data;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

export async function updateSprint(request: UpdateSprintRequest) {
  const { token, projectId, sprintId } = request;
  const axios = getAxiosInstance(token);

  const apiRequest = {
    name: request.name,
    startDate: `${request.startDate}T00:01:00.000Z`,
    endDate: `${request.endDate}T23:59:00.000Z`,
    goal: {
      shouldUpdate: true,
      value: request.goal.trim().length > 0 ? request.goal.trim() : null,
    },
  };

  try {
    const response = await axios.put(
      `/api/projects/${projectId}/sprints/${sprintId}`,
      apiRequest
    );
    return response.data;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

export async function sprintRemoveTasks({
  token,
  projectId,
  sprintId,
  tasks,
}: SprintAssignTasksRequest) {
  const axios = getAxiosInstance(token);

  const body = tasks
    .filter(({ state }) => state === "DELETED")
    .map(({ id, taskType }) => ({
      id,
      type: taskType,
    }));

  try {
    const response = await axios.post(
      `/api/projects/${projectId}/sprints/${sprintId}/tasks/delete`,
      { tasks: body }
    );
    return response.data;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

export async function sprintAssignTasks({
  token,
  projectId,
  sprintId,
  tasks,
}: SprintAssignTasksRequest) {
  const axios = getAxiosInstance(token);

  const body = tasks
    .filter(({ state }) => state === "NEW")
    .map(({ id, taskType }) => ({
      id,
      type: taskType,
    }));

  try {
    const response = await axios.post(
      `/api/projects/${projectId}/sprints/${sprintId}/tasks/assign`,
      { tasks: body }
    );
    return response.data;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

export async function moveProjectTask(request: MoveProjectTaskRequest) {
  const axios = getAxiosInstance(request.token);
  const requestData = {
    prev: request.prev.length === 0 ? undefined : request.prev,
    next: request.next.length === 0 ? undefined : request.next,
    taskRequest: {
      Id: request.taskId,
      Type: request.taskType,
    },
    statusId: request.statusId.length === 0 ? undefined : request.statusId,
  };

  try {
    const response = await axios.post(
      `/api/projects/${request.projectId}/sprints/${request.sprintId}/tasks/move`,
      requestData
    );
    return response.status;
  } catch (err) {
    return undefined;
  }
}
