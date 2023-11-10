import type { LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { getBacklog } from "~/api/methods/project";
import { defer, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Backlog from "~/components/backlog/Backlog";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    redirect("/user/login");
  }
  const backlogPromise = getBacklog({
    projectId: params.projectId!,
    token: token!,
  });

  if (!backlogPromise) {
    return new Response("Not found", { status: 404 });
  }

  return defer({ backlogPromise });
};

export default function BacklogPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { backlogPromise } = loaderData;

  // @ts-ignore
  return <Backlog backlogPromise={backlogPromise} />;
}
