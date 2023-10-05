import { getApiErrorsFromError, getAxiosInstance } from "~/api/axios";
import type {
  LoginResponse,
  LoginRequest,
} from "~/api/types/authorizationTypes";

export async function login(
  request: LoginRequest
): Promise<LoginResponse | undefined> {
  const axios = getAxiosInstance();

  try {
    const response = await axios.post("/api/login", request);
    return { accessToken: response.data };
  } catch (err) {
    const errors = getApiErrorsFromError(err);
    if (errors === undefined) {
      return undefined;
    }

    return { errors };
  }
}
