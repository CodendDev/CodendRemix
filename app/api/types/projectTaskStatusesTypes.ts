import type { ProjectTaskStatus } from "~/api/types/baseEntitiesTypes";
import type { WithTokenRequest } from "~/api/types/authorizationTypes";

export interface ProjectTaskStatusesRequest extends WithTokenRequest {
  projectId: string;
}

export interface ProjectTaskStatusesResponse {
  projectTaskStatuses: ProjectTaskStatus[];
}
