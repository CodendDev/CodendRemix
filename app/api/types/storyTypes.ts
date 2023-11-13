import { ProjectRequest } from "~/api/types/projectTypes";

export interface GetStoryRequest extends ProjectRequest {
  storyId: string;
}
