import type { Board } from "~/api/types/baseEntitiesTypes";
import type { WithTokenRequest } from "~/api/types/authorizationTypes";

export interface ProjectBoardRequest extends WithTokenRequest {
  projectId: string;
}

export interface ProjectBoardResponse {
  board: Board;
}
