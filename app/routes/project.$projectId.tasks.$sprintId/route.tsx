import type { LoaderFunctionArgs } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { getBacklog, getBoard } from "~/api/methods/project";
import { defer, redirect } from "@remix-run/node";
import { jwtDecode } from "jwt-decode";
import SelectedSprintBoardPage from "~/routes/project.$projectId.board.$sprintId/route";

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

export default () => <SelectedSprintBoardPage editable={false} />;
