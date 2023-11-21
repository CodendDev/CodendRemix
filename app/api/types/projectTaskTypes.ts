import { ProjectRequest } from "~/api/types/projectTypes";
import { EstimatedTime, ProjectTask } from "~/api/types/baseEntitiesTypes";

export const emptyTask = (statusId?: string): ProjectTask => ({
  id: "",
  name: "",
  taskType: "Base",
  priority: "Normal",
  statusId: statusId ?? "",
  description: "",
  estimatedTime: undefined,
  dueDate: undefined,
  storyPoints: undefined,
  assigneeId: undefined,
  storyId: undefined,
  epicId: undefined,
});

export interface ProjectTaskRequest extends ProjectRequest {
  projectTaskId: string;
}

export interface CreateProjectTaskRequest extends ProjectRequest {
  name: string;
  priority: string;
  statusId: string;
  description?: string;
  estimatedTime: EstimatedTime;
  dueDate?: string;
  storyPoints?: number;
  assigneeId?: string;
  storyId?: string;
  taskType: string;
  sprintId?: string;
}

export interface UpdateProjectTaskRequest
  extends CreateProjectTaskRequest,
    ProjectTaskRequest {}
