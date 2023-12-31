import type { ProjectRequest } from "~/api/types/projectTypes";
import type { BoardTask } from "~/api/types/baseEntitiesTypes";
import type { SprintTask } from "~/components/sprint/sideSprint/SprintContext";

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

export interface UpdateSprintRequest
  extends SprintRequest,
    CreateSprintRequest {}

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

export type SprintStatus = "Archived" | "Active" | "Future";

export interface SprintAssignTasksRequest extends SprintRequest {
  tasks: SprintTask[];
}

export interface MoveProjectTaskRequest extends SprintRequest {
  prev: string;
  next: string;
  taskId: string;
  taskType: string;
  statusId: string;
}
