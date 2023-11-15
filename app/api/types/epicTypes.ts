import { ProjectRequest } from "~/api/types/projectTypes";

export interface GetEpicRequest extends ProjectRequest {
  id: string;
}

export interface CreateEpicRequest extends ProjectRequest {
  name: string;
  description: string;
  statusId: string;
}

export interface UpdateEpicRequest extends CreateEpicRequest, GetEpicRequest {}
