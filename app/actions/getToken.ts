import { userTokenCookie } from "~/actions/cookies/tokenCookie";

export const getToken = async (
  request: Request
): Promise<string | undefined> => {
  const tokenHeader = request.headers.get("Cookie");
  const cookie = await userTokenCookie.parse(tokenHeader);

  if (cookie === null) {
    return undefined;
  }

  return `Bearer ${cookie}`;
};

export default getToken;
