import type { AxiosInstance } from "axios";
import axios, { isAxiosError } from "axios";
import type { ApiErrorResponse } from "~/api/types/apiErrorsTypes";
import * as https from "https";
import * as process from "process";

export function getAxiosInstance(token?: string): AxiosInstance {
  const DEVELOPMENT = process.env.SETTINGS === "DEVELOPMENT";
  const url = process.env.API_SERVER;
  if (!url) {
    throw new Error("API server address is undefined.");
  }

  const httpSecureRegex = new RegExp(/^https:\/\//);
  if (!DEVELOPMENT && !httpSecureRegex.test(url)) {
    throw new Error(
      "API server address must use SSL protocol. " +
        "If you want to use http set environmental variable SETTINGS=DEVELOPMENT"
    );
  }

  const authorizationHeaders = token
    ? {
        authorization: token,
      }
    : {};

  const httpsAgent = DEVELOPMENT
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

  return axios.create({
    baseURL: url,
    timeout: 20000,
    httpsAgent,
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

  if (!err.response) {
    return undefined;
  }

  const apiErrors = err.response.data.errors;
  if (!apiErrors) {
    return undefined;
  }

  return { errors: err.response.data.errors as ApiErrorResponse[] };
}
