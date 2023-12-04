import type {
  PagedProjectRequest,
  ProjectBacklogRequest,
  ProjectBoardRequest,
  ProjectRequest,
  ProjectActiveSprintsRequest,
  isFavouriteProjectRequest,
} from "~/api/types/projectTypes";
import { getApiErrorsFromError, getAxiosInstance } from "~/api/axios";
import type {
  BacklogTaskType,
  BoardTask,
  PagedResponse,
  Project,
  Sprint,
  UserDetails,
} from "~/api/types/baseEntitiesTypes";
import {
  AddMemberProjectRequest,
  CreateProjectRequest,
  RemoveMemberProjectRequest,
  UpdateProjectRequest,
} from "~/api/types/projectTypes";

export async function getBoard({
  projectId,
  sprintId,
  token,
  assigneeId,
}: ProjectBoardRequest): Promise<BoardTask[] | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(
      `/api/projects/${projectId}/board/${sprintId}
      ${assigneeId ? `?assigneeId=${assigneeId}` : ""}`
    );
    return response.data.tasks;
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
}: ProjectBacklogRequest): Promise<BacklogTaskType[] | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(`/api/projects/${projectId}/backlog`);
    return response.data.tasks;
  } catch (err) {
    return undefined;
  }
}

export async function getMembers({
  projectId,
  token,
}: ProjectRequest): Promise<UserDetails[] | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get(`/api/projects/${projectId}/members`);
    return response.data;
  } catch (err) {
    return undefined;
  }
}

export async function setIsFavourite({
  projectId,
  token,
  isFavourite,
}: isFavouriteProjectRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.put(`/api/projects/${projectId}/favourite`, {
      isFavourite,
    });
    return response.data;
  } catch (err) {
    return undefined;
  }
}

export async function updateProject({
  projectId,
  token,
  name,
  description,
}: UpdateProjectRequest) {
  const axios = getAxiosInstance(token);

  const apiRequest = {
    name,
    description: {
      shouldUpdate: true,
      value: description,
    },
  };

  try {
    const response = await axios.put(`/api/projects/${projectId}`, apiRequest);
    return response.status;
  } catch (err) {
    return undefined;
  }
}

export async function createProject({
  token,
  name,
  description,
}: CreateProjectRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.post(`/api/projects`, { name, description });
    return response.data;
  } catch (err) {
    return undefined;
  }
}

/**
 * Remove a member from a project.
 *
 * @param {RemoveMemberProjectRequest} request - The request object containing the token, projectId, and memberId.
 * @param {string} request.token - The access token for authentication.
 * @param {string} request.projectId - The ID of the project.
 * @param {string} request.memberId - The ID of the member to be removed.
 *
 * @return {Promise<Object|undefined>} - A Promise that resolves to the response data if the member is successfully removed, or undefined if there was an error.
 */
export async function removeMember({
  token,
  projectId,
  memberId,
}: RemoveMemberProjectRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.delete(
      `/api/projects/${projectId}/members/${memberId}`
    );
    return response.data;
  } catch (err) {
    return undefined;
  }
}

/**
 * Add a member to a project.
 *
 * @param {RemoveMemberProjectRequest} request - The request object containing the token, projectId, and memberEmail.
 * @param {string} request.token - The authentication token.
 * @param {string} request.projectId - The ID of the project.
 * @param {string} request.memberEmail - The email address of the member to be added.
 *
 * @return {Promise<Object|undefined>} - A promise that resolves to the response data when the member is added successfully, or undefined if an error occurs.
 */
export async function addMember({
  token,
  projectId,
  memberEmail,
}: AddMemberProjectRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.post(
      `/api/projects/${projectId}/members`,
      null,
      {
        params: {
          email: memberEmail,
        },
      }
    );
    return response.data;
  } catch (err) {
    return undefined;
  }
}
