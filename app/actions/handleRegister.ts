import { register } from "~/api/methods/user";
import { json, redirect } from "@remix-run/node";
import type { RegisterRequest } from "~/api/types/authorizationTypes";
import { createUserTokenCookie } from "~/actions/cookies/tokenCookie";

export const handleRegister = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterRequest) => {
  const response = await register({ firstName, lastName, email, password });

  if (!response || response?.errors) {
    return json({ errors: response?.errors ?? [] });
  }

  // Login
  const accessToken = response.accessToken!;

  const tokenCookie = createUserTokenCookie(false);

  return redirect("/", {
    headers: {
      "Set-Cookie": await tokenCookie.serialize(accessToken),
    },
  });
};
