import { ProjectRequest } from "~/api/types/projectTypes";

export interface GetEpicRequest extends ProjectRequest {
  epicId: string;
}
