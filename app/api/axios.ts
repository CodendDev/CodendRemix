import type { AxiosInstance } from "axios";
import axios from "axios";

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
