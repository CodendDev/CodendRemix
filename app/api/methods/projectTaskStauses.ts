import { getAxiosInstance } from "~/api/axios";
import type {
  ProjectTaskStatusesRequest,
  ProjectTaskStatusesResponse,
} from "~/api/types/projectTaskStatusesTypes";

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
