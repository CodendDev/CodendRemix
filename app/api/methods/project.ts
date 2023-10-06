import type {
  ProjectBoardRequest,
  ProjectBoardResponse,
} from "~/api/types/projectRequests";
import { getAxiosInstance } from "~/api/axios";

export async function getBoard({
  projectId,
  token,
}: ProjectBoardRequest): Promise<ProjectBoardResponse | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(`/api/projects/${projectId}/board`);
    return { board: response.data };
  } catch (err) {
    return undefined;
  }
}
