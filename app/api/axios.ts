import type { AxiosInstance } from "axios";
import axios, { isAxiosError } from "axios";
import type { ApiErrorResponse } from "~/api/types/apiErrorsTypes";

export function getAxiosInstance(token?: string): AxiosInstance {
  const url = process.env.API_SERVER;
  if (url === undefined) {
    throw new Error("API server address is undefined.");
  }

  const authorizationHeaders = token
    ? {
        authorization: token,
      }
    : {};

  return axios.create({
    baseURL: url,
    timeout: 2000,
    headers: {
      ...authorizationHeaders,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Checks if given error is axios error. If error contains API errors returns then.
 *
 * @param err any error
 *
 * @return object with list of API errors or undefined if there are no API errors
 */
export function getApiErrorsFromError(
  err: unknown
): { errors: ApiErrorResponse[] } | undefined {
  if (!isAxiosError(err)) {
    return undefined;
  }

  if (err.response === undefined) {
    return undefined;
  }

  const apiErrors = err.response.data.errors;
  if (apiErrors === undefined) {
    return undefined;
  }

  return { errors: err.response.data.errors as ApiErrorResponse[] };
}
