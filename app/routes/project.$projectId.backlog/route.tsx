import type { LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { getBacklog } from "~/api/methods/project";
import { defer, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Backlog from "~/components/backlog/Backlog";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }
  const backlogPromise = getBacklog({
    projectId: params.projectId!,
    token: token!,
  });

  return defer({ backlogPromise });
};

export default function BacklogPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { backlogPromise } = loaderData;

  return (
    <div className="flex w-full flex-shrink overflow-x-auto">
      <div className="grow">
        <Backlog backlogPromise={backlogPromise} />
      </div>
      <div>
        <Outlet context={backlogPromise} />
      </div>
    </div>
  );
}
