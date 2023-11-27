import type { LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { defer, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const userDetailsPromise = "";

  return defer({ userDetailsPromise });
};

export default function SelectedSprintBoardPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { userDetailsPromise } = loaderData;

  return <div>account page</div>;
}
