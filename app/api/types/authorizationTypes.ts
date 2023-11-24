import type { ApiErrorResponse } from "~/api/types/apiErrorsTypes";

export interface WithTokenRequest {
  token: string;
}

export interface WithErrorsResponse {
  errors?: ApiErrorResponse[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends WithErrorsResponse {
  accessToken?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface RegisterResponse extends LoginResponse {}
