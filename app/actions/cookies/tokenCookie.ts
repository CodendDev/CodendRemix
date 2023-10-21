import { createCookie } from "@remix-run/node";
import SETTINGS from "~/actions/settings";

export const userTokenCookie = createCookie("user-token", {});

export const createUserTokenCookie = (remember?: boolean) => {
  return createCookie("user-token", {
    maxAge: remember
      ? SETTINGS.LOGIN_TOKEN_REMEMBER_LIFE_DURATION
      : SETTINGS.LOGIN_TOKEN_LIFE_DURATION,
  });
};

export const deleteUserTokenCookie = () =>
  createCookie("user-token", {
    expires: new Date(0),
  });
