import type { WithTokenRequest } from "~/api/types/authorizationTypes";

export interface ProjectTaskStatusesRequest extends WithTokenRequest {
  projectId: string;
}

export interface CreateProjectTaskStatusRequest extends WithTokenRequest {
  projectId: string;
  request: { name: string };
}

export interface DeleteProjectTaskStatusRequest extends WithTokenRequest {
  projectId: string;
  statusId: string;
}

export interface UpdateProjectTaskStatusRequest extends WithTokenRequest {
  projectId: string;
  statusId: string;
  request: { name: string };
}
