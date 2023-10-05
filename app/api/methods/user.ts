import { getAxiosInstance } from "~/api/axios";
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
    return response.data as LoginResponse;
  } catch (err) {
    return undefined;
  }
}
