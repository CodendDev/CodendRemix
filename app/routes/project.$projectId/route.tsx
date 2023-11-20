import { Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { getMembers } from "~/api/methods/project";
import { getProjectTaskStatuses } from "~/api/methods/projectTaskStauses";
import { createContext } from "react";
import { ProjectTaskStatus, UserDetails } from "~/api/types/baseEntitiesTypes";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  const projectId = params.projectId!;
  if (!token) {
    return redirect("/user/login");
  }

  const projectTaskStatusesPromise = getProjectTaskStatuses({
    projectId: projectId,
    token: token!,
  });
  const projectMembersPromise = getMembers({
    projectId: projectId,
    token: token!,
  });
  const [projectTaskStatuses, projectMembers] = await Promise.all([
    projectTaskStatusesPromise,
    projectMembersPromise,
  ]);

  return json({ projectTaskStatuses, projectMembers });
};

export const StatusesContext = createContext<ProjectTaskStatus[]>([]);
export const MembersContext = createContext<UserDetails[]>([]);

export default function ProjectPage() {
  const { projectTaskStatuses, projectMembers } = useLoaderData<
    typeof loader
  >() as any;

  return (
    <MembersContext.Provider value={projectMembers}>
      <StatusesContext.Provider value={projectTaskStatuses}>
        <Outlet />
      </StatusesContext.Provider>
    </MembersContext.Provider>
  );
}
