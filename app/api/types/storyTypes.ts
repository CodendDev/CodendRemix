import { ProjectRequest } from "~/api/types/projectTypes";

export interface GetStoryRequest extends ProjectRequest {
  id: string;
}

export interface CreateStoryRequest extends ProjectRequest {
  name: string;
  description: string;
  statusId: string;
  epicId?: string;
  sprintId?: string;
}

export interface UpdateStoryRequest
  extends CreateStoryRequest,
    GetStoryRequest {}
