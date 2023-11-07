import type {
  SprintsResponse,
  SprintsRequest,
  CreateSprintRequest,
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

export async function createSprint(request: CreateSprintRequest) {
  const { name, startDate, endDate, goal, projectId, token } = request;
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.post(`/api/projects/${projectId}/sprints`, {
      name,
      startDate: `${startDate}T00:01:00.000Z`,
      endDate: `${endDate}T00:00:00.000Z`,
      goal: goal.length === 0 ? null : goal,
    });
    return response.data;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}
