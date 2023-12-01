import { useContext } from "react";
import { MembersContext } from "~/routes/project.$projectId/route";
import { useOutletContext } from "react-router";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { removeMember } from "~/api/methods/project";
import { ProjectMembers } from "~/components/members/ProjectMembers";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const projectId = params.projectId!;
  const memberId = Object.fromEntries(await request.formData()).id.toString();

  return removeMember({ token, projectId, memberId });
};

export default function UsersPage() {
  const members = useContext(MembersContext);
  // @ts-ignore
  const { project } = useOutletContext();
  return (
    <div className="flex h-full flex-col items-center">
      <ProjectMembers members={members} ownerId={project.ownerId} />
    </div>
  );
}
