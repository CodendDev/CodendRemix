import type { LoginRequest } from "~/api/types/authorizationTypes";
import { createCookie, redirect } from "@remix-run/node";
import { login } from "~/api/methods/user";
import SETTINGS from "~/actions/settings";

export type handleLoginRequest = LoginRequest & {
  remember: boolean;
};

export const handleLogin = async ({
  email,
  password,
  remember,
}: handleLoginRequest) => {
  const loginResponse = await login({ email, password });

  if (loginResponse === undefined || loginResponse.errors !== undefined) {
    return false;
  }

  const accessToken = loginResponse.accessToken!;

  const tokenCookie = createCookie("user-token", {
    maxAge: remember
      ? SETTINGS.LOGIN_TOKEN_REMEMBER_LIFE_DURATION
      : SETTINGS.LOGIN_TOKEN_LIFE_DURATION,
  });

  return redirect("/", {
    headers: {
      "Set-Cookie": await tokenCookie.serialize(accessToken),
    },
  });
};

export default handleLogin;
