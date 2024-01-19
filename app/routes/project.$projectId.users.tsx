import { useContext } from "react";
import { MembersContext } from "~/routes/project.$projectId";
import { useOutletContext } from "react-router";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { addMember, removeMember } from "~/api/methods/project";
import { ProjectMembers } from "~/components/members/ProjectMembers";
import { jwtDecode } from "jwt-decode";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  if (request.method === "DELETE") {
    const projectId = params.projectId!;
    const memberId = Object.fromEntries(await request.formData()).id.toString();
    const assigneeId = jwtDecode(token).sub;

    const response = await removeMember({ token, projectId, memberId });
    return memberId === assigneeId ? redirect("/project") : response;
  }

  if (request.method === "POST") {
    const projectId = params.projectId!;
    const email = Object.fromEntries(await request.formData()).email.toString();
    await addMember({ token, projectId, memberEmail: email });
    return {};
  }

  return undefined;
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
