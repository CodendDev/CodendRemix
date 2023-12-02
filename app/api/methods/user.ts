import { getApiErrorsFromError, getAxiosInstance } from "~/api/axios";
import type {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  WithTokenRequest,
} from "~/api/types/authorizationTypes";
import { UserDetails } from "~/api/types/baseEntitiesTypes";
import { UpdateUserRequest } from "~/api/types/userTypes";

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

export async function getUserDetails({
  token,
}: WithTokenRequest): Promise<UserDetails | undefined> {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.get("/api/user");
    return response.data;
  } catch (err) {
    return undefined;
  }
}

export async function UpdateUserDetails(request: UpdateUserRequest) {
  const { token, firstName, lastName, imageUrl } = request;
  const axios = getAxiosInstance(token);

  const userData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    imageUrl: imageUrl.trim(),
  };

  try {
    const response = await axios.put("/api/user", userData);
    return response.status;
  } catch (err) {
    return undefined;
  }
}

/**
 * Enables all user notifications.
 *
 * @param {Object} request - The request object.
 * @param {string} request.token - The user token used for authorization.
 *
 * @return {Promise<number | undefined>} - The HTTP status code of the response if successful, otherwise undefined.
 */
export async function enableAllUserNotifications({ token }: WithTokenRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.post("/api/user/notifications/enable");
    return response.status;
  } catch (err) {
    return undefined;
  }
}

/**
 * Disables all user notifications.
 *
 * @param {object} request - The request object containing the token.
 * @param {string} request.token - The user token used for authentication.
 *
 * @return {Promise<number|undefined>} A promise that resolves with the response status code
 * if the request is successful, or undefined if there is an error.
 */
export async function disableAllUserNotifications({ token }: WithTokenRequest) {
  const axios = getAxiosInstance(token);

  try {
    const response = await axios.post("/api/user/notifications/disable");
    return response.status;
  } catch (err) {
    return undefined;
  }
}
