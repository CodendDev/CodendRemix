import type { LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { getBacklog } from "~/api/methods/project";
import { defer, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import Backlog from "~/components/backlog/Backlog";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  const projectId = params.projectId!;
  if (!token) {
    return redirect("/user/login");
  }
  const backlogPromise = getBacklog({ projectId, token });

  return defer({ backlogPromise });
};

export default function BacklogPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { backlogPromise } = loaderData;

  // 💀
  const regExp = new RegExp(/.backlog$/g);
  const backlog = regExp.test(useLocation().pathname);

  return (
    <div className="flex h-full">
      <div className="grow overflow-y-auto">
        <Backlog backlogTasksPromise={backlogPromise} />
      </div>
      {!backlog && (
        <div className="flex-shrink-0 grow overflow-y-auto border-l-1 border-emerald-700">
          <Outlet context={backlogPromise} />
        </div>
      )}
    </div>
  );
}
