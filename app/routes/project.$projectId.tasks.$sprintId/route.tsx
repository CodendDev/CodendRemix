import type { LoaderFunctionArgs } from "@remix-run/node";
import ProjectBoard from "~/components/board/ProjectBoard";
import getToken from "~/actions/getToken";
import { getBacklog, getBoard } from "~/api/methods/project";
import { defer, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { DndProviderWrapper } from "~/components/utils/DndProviderWrapper";
import { jwtDecode } from "jwt-decode";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const projectId = params.projectId!;
  const sprintId = params.sprintId!;
  const assigneeId = jwtDecode(token).sub;

  const boardPromise = getBoard({ projectId, sprintId, assigneeId, token });
  const backlogPromise = getBacklog({ projectId, token });

  return defer({ boardPromise, backlogPromise });
};

export default function SelectedSprintBoardPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { boardPromise, backlogPromise } = loaderData;

  return (
    <DndProviderWrapper className="flex h-full grow border-t-1 border-emerald-700">
      <ProjectBoard boardPromise={boardPromise} editable={false} />
      <Outlet context={backlogPromise} />
    </DndProviderWrapper>
  );
}
