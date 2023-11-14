import type { LoaderFunctionArgs } from "@remix-run/node";
import ProjectBoard from "~/components/board/ProjectBoard";
import getToken from "~/actions/getToken";
import { getBoard } from "~/api/methods/project";
import { defer, redirect } from "@remix-run/node";
import { getProjectTaskStatuses } from "~/api/methods/projectTaskStauses";
import { useLoaderData } from "@remix-run/react";
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
  const statusesPromise = getProjectTaskStatuses({ projectId, token });

  return defer({ boardPromise, statusesPromise });
};

export default function SelectedSprintBoardPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { boardPromise, statusesPromise } = loaderData;

  return (
    <DndProviderWrapper className="flex h-full grow">
      <ProjectBoard
        boardPromise={boardPromise}
        statusesPromise={statusesPromise}
      />
    </DndProviderWrapper>
  );
}
