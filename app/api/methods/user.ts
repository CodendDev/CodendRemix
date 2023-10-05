import { getApiErrorsFromError, getAxiosInstance } from "~/api/axios";
import type {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "~/api/types/authorizationTypes";

/**
 * Less code for same methods 💀
 * {@link login}
 * {@link register}
 *
 * @param request
 */
async function handleLoginRegister<TReq>(request: {
  data: TReq;
  endpoint: string;
}): Promise<LoginResponse | undefined> {
  const axios = getAxiosInstance();

  try {
    const response = await axios.post(request.endpoint, request.data);
    return response.data;
  } catch (err) {
    return getApiErrorsFromError(err);
  }
}

/**
 * Tries to log in user with given credentials.
 *
 * @param request user credentials
 */
export const login = async (
  request: LoginRequest
): Promise<LoginResponse | undefined> =>
  handleLoginRegister({ data: request, endpoint: "/api/login" });

/**
 * Tries to register user with given credentials.
 *
 * @param request user credentials
 */
export const register = async (
  request: RegisterRequest
): Promise<RegisterResponse | undefined> =>
  handleLoginRegister({ data: request, endpoint: "/api/register" });
