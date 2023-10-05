import type { ApiErrorResponse } from "~/api/types/apiErrorsTypes";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  errors?: ApiErrorResponse[];
}
