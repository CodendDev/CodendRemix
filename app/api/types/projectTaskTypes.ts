import { ProjectRequest } from "~/api/types/projectTypes";

export interface ProjectTaskRequest extends ProjectRequest {
  projectTaskId: string;
}
