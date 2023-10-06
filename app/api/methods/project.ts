import type {
  PagedProjectRequest,
  ProjectBoardRequest,
  ProjectBoardResponse,
} from "~/api/types/projectTypes";
import { getApiErrorsFromError, getAxiosInstance } from "~/api/axios";
import type { PagedResponse, Project } from "~/api/types/baseEntitiesTypes";

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

export async function getPagedProjects({
  pageIndex,
  pageSize,
  search,
  sortColumn,
  sortOrder,
  token,
}: PagedProjectRequest): Promise<PagedResponse<Project> | undefined> {
  const axios = getAxiosInstance(token);
  const params = {
    pageIndex,
    pageSize,
    search,
    sortColumn,
    sortOrder,
  };
  try {
    const response = await axios.get(`/api/projects`, { params });
    return { data: response.data };
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}
