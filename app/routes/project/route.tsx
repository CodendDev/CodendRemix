import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, defer } from "@remix-run/node";
import getToken from "~/actions/getToken";
import { getPagedProjects } from "~/api/methods/project";
import ProjectNavigationBar from "~/components/projectNavigation/ProjectNavigationBar";
import { Outlet, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (token === undefined) {
    redirect("/user/login");
  }

  const projectsPromise = getPagedProjects({
    pageIndex: 1,
    pageSize: 10,
    token: token!,
  });

  return defer({ projectsPromise });
};

export default function Projects() {
  const { projectsPromise } = useLoaderData() as any;

  return (
    <div className="flex">
      <div className="flex min-w-min">
        <ProjectNavigationBar projectsPromise={projectsPromise} />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
