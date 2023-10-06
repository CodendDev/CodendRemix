import type { Board, PagedRequest } from "~/api/types/baseEntitiesTypes";
import type { WithTokenRequest } from "~/api/types/authorizationTypes";

export interface ProjectBoardRequest extends WithTokenRequest {
  projectId: string;
}

export interface ProjectBoardResponse {
  board: Board;
}

export interface PagedProjectRequest extends WithTokenRequest, PagedRequest {}

export interface ProjectRequest extends WithTokenRequest {
  projectId: string;
}
