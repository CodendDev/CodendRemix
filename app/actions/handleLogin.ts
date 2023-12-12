import type { LoginRequest } from "~/api/types/authorizationTypes";
import { redirect } from "@remix-run/node";
import { login } from "~/api/methods/user";
import { createUserTokenCookie } from "~/actions/cookies/tokenCookie";
import type { ApiErrorResponse } from "~/api/types/apiErrorsTypes";

export type handleLoginRequest = LoginRequest & {
  remember: boolean;
  errorHandler: (errors: ApiErrorResponse[]) => void;
};

export const handleLogin = async ({
  email,
  password,
  remember,
  errorHandler,
}: handleLoginRequest) => {
  const loginResponse = await login({ email, password });

  if (loginResponse === undefined || loginResponse.errors !== undefined) {
    return errorHandler(loginResponse?.errors ?? []);
  }

  const accessToken = loginResponse.accessToken!;

  const tokenCookie = createUserTokenCookie(remember);

  return redirect("/project", {
    headers: {
      "Set-Cookie": await tokenCookie.serialize(accessToken),
    },
  });
};

export default handleLogin;
