import { WithTokenRequest } from "~/api/types/authorizationTypes";

export interface UpdateUserRequest extends WithTokenRequest {
  firstName: string;
  lastName: string;
  imageUrl: string;
}
