import { Outlet, useLoaderData } from "@remix-run/react";
import { defer, LoaderFunctionArgs, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { getMembers, getProject } from "~/api/methods/project";
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
    projectId,
    token,
  });
  const projectMembersPromise = getMembers({ projectId, token });
  const [projectTaskStatuses, projectMembers] = await Promise.all([
    projectTaskStatusesPromise,
    projectMembersPromise,
  ]);
  const project = await getProject({ projectId, token });

  return defer({ projectTaskStatuses, projectMembers, project });
};

export const StatusesContext = createContext<ProjectTaskStatus[]>([]);
export const MembersContext = createContext<UserDetails[]>([]);

export default function ProjectPage() {
  // @ts-ignore
  const { projectTaskStatuses, projectMembers, project } =
    useLoaderData<typeof loader>();

  return (
    <MembersContext.Provider value={projectMembers}>
      <StatusesContext.Provider value={projectTaskStatuses}>
        <Outlet context={{ project }} />
      </StatusesContext.Provider>
    </MembersContext.Provider>
  );
}
