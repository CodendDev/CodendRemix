import { deleteUserTokenCookie } from "~/actions/cookies/tokenCookie";
import { redirect } from "@remix-run/node";

type handleLogoutProps = {
  url: string;
};

export const handleLogout = async ({ url }: handleLogoutProps) => {
  const cookie = deleteUserTokenCookie();

  return redirect(url, {
    headers: {
      "Set-Cookie": await cookie.serialize(""),
    },
  });
};

export default handleLogout;
