import type { ApiErrorResponse } from "~/api/types/apiErrorsTypes";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  errors?: ApiErrorResponse[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse extends LoginResponse {}
