import type { ProjectRequest } from "~/api/types/projectTypes";
import type { BoardTask } from "~/api/types/baseEntitiesTypes";

export interface SprintsRequest extends ProjectRequest {}

export interface SprintRequest extends ProjectRequest {
  sprintId: string;
}

export interface DeleteSprintRequest extends SprintRequest {}

export interface CreateSprintRequest extends SprintsRequest {
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
}

export interface SprintResponse {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  sprintTasks: BoardTask[];
}

export interface SprintsResponse {
  activeSprints: string[];
  sprints: SprintResponse[];
}
