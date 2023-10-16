import React from "react";
import { Outlet, useLoaderData } from "@remix-run/react";
import ProjectNavigationBar from "~/components/projectNavigation/ProjectNavigationBar";
import getToken from "~/actions/getToken";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { defer, redirect } from "@remix-run/node";
import { getPagedProjects } from "~/api/methods/project";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const projects = getPagedProjects({ pageIndex: 1, pageSize: 10, token });

  return defer({ projects });
};

export default function ProjectPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { projects } = loaderData;

  return (
    <div className="flex flex-row">
      <div className="w-[200px] min-w-[140px]">
        <ProjectNavigationBar projectsPromise={projects} />
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
