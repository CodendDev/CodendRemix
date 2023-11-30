import type { PagedRequest } from "~/api/types/baseEntitiesTypes";
import type { WithTokenRequest } from "~/api/types/authorizationTypes";

export interface ProjectBoardRequest extends WithTokenRequest {
  projectId: string;
  sprintId: string;
  assigneeId?: string;
}

export interface PagedProjectRequest extends WithTokenRequest, PagedRequest {}

export interface ProjectRequest extends WithTokenRequest {
  projectId: string;
}

export interface ProjectBacklogRequest extends WithTokenRequest {
  projectId: string;
}

export interface ProjectActiveSprintsRequest extends WithTokenRequest {
  projectId: string;
}

export interface isFavouriteProjectRequest extends ProjectRequest {
  isFavourite: boolean;
}

export interface CreateProjectRequest extends WithTokenRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest
  extends CreateProjectRequest,
    ProjectRequest {}

export interface RemoveMemberProjectRequest extends ProjectRequest {
  memberId: string;
}
