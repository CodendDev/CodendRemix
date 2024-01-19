import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { getMembers, getProject } from "~/api/methods/project";
import { getProjectTaskStatuses } from "~/api/methods/projectTaskStauses";
import { createContext } from "react";
import type {
  ProjectTaskStatus,
  UserDetails,
} from "~/api/types/baseEntitiesTypes";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  const projectId = params.projectId!;
  if (!token) {
    return redirect("/user/login");
  }

  const project = await getProject({ projectId, token });
  if (!project) {
    return redirect("/project");
  }

  const projectTaskStatuses = (await getProjectTaskStatuses({
    projectId,
    token,
  }))!;
  const projectMembers = (await getMembers({ projectId, token }))!;

  return json({ projectTaskStatuses, projectMembers, project });
};

export const StatusesContext = createContext<ProjectTaskStatus[]>([]);
export const MembersContext = createContext<UserDetails[]>([]);

export default function ProjectPage() {
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
