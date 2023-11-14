import { ProjectRequest } from "~/api/types/projectTypes";
import {
  EstimatedTime,
  ProjectTask,
  TaskType,
} from "~/api/types/baseEntitiesTypes";

export const emptyTask = (): ProjectTask => ({
  id: "",
  name: "",
  priority: "Normal",
  statusId: "",
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
}

export interface UpdateProjectTaskRequest
  extends CreateProjectTaskRequest,
    ProjectTaskRequest {}
