import type { SprintsResponse, SprintsRequest } from "~/api/types/sprintTypes";
import { getAxiosInstance } from "~/api/axios";

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
