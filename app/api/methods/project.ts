import type {
  PagedProjectRequest,
  ProjectBacklogRequest,
  ProjectBoardRequest,
  ProjectBoardResponse,
  ProjectRequest,
  ProjectActiveSprintsRequest,
} from "~/api/types/projectTypes";
import { getApiErrorsFromError, getAxiosInstance } from "~/api/axios";
import type {
  BacklogType,
  PagedResponse,
  Project,
  Sprint,
} from "~/api/types/baseEntitiesTypes";

export async function getBoard({
  projectId,
  sprintId,
  token,
  assigneeId,
}: ProjectBoardRequest): Promise<ProjectBoardResponse | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/board/${sprintId}
      ${assigneeId ? `?assigneeId=${assigneeId}` : ""}`
    );
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

export async function getProject({
  projectId,
  token,
}: ProjectRequest): Promise<Project | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(`api/projects/${projectId}`);
    return response.data;
  } catch (err) {
    return undefined;
  }
}

export async function getActiveSprints({
  projectId,
  token,
}: ProjectActiveSprintsRequest): Promise<Sprint[] | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/sprints/active`
    );
    return response.data;
  } catch (err) {
    return undefined;
  }
}

export async function getBacklog({
  projectId,
  token,
}: ProjectBacklogRequest): Promise<BacklogType | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(`/api/projects/${projectId}/backlog`);
    return response.data;
  } catch (err) {
    return undefined;
  }
}
