import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import ProjectBoard from "~/components/board/ProjectBoard";
import getToken from "~/actions/getToken";
import { getBacklog, getBoard } from "~/api/methods/project";
import { defer, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { jwtDecode } from "jwt-decode";
import { assignProjectTask } from "~/api/methods/projectTask";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const projectId = params.projectId!;
  const sprintId = params.sprintId!;

  const boardPromise = getBoard({ projectId, sprintId, token });
  const backlogPromise = getBacklog({ projectId, token });

  return defer({ boardPromise, backlogPromise });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return undefined;
  }

  if (request.method !== "PUT") {
    return undefined;
  }

  const projectId = params.projectId!;
  const projectTaskId = Object.fromEntries(
    await request.formData()
  ).id.toString();
  const assigneeId = jwtDecode(token).sub!;

  return assignProjectTask({ projectId, projectTaskId, assigneeId, token });
};

export default function SelectedSprintBoardPage({
  editable = true,
}: {
  editable?: boolean;
}) {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { boardPromise, backlogPromise } = loaderData;

  return (
    <div className="flex grow">
      <div className="grow overflow-x-auto">
        <ProjectBoard boardPromise={boardPromise} editable={editable} />
      </div>
      <Outlet context={backlogPromise} />
    </div>
  );
}
