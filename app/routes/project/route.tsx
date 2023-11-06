import React from "react";
import { Outlet, useLoaderData } from "@remix-run/react";
import ProjectNavigationBar from "~/components/projectNavigation/ProjectNavigationBar";
import getToken from "~/actions/getToken";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { defer, redirect } from "@remix-run/node";
import { getPagedProjects } from "~/api/methods/project";
import { RxRows } from "react-icons/rx/index.js";
import { AiOutlineClose } from "react-icons/ai/index.js";

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

  const [isMenuOpen, setIsMenuOpen] = React.useState(true);

  return (
    <div className="flex h-full flex-col">
      <div>
        <div
          className="bg-sky-950 p-3 shadow-sm shadow-sky-950"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <AiOutlineClose className="text-gray-300" />
          ) : (
            <RxRows className="text-gray-300" />
          )}
        </div>
      </div>
      <div className="flex h-full flex-row">
        <div
          className={`duration-300 ${
            isMenuOpen
              ? "w-[250px] min-w-[250px] border-r-1 border-sky-700"
              : "w-0 overflow-hidden"
          }`}
        >
          <ProjectNavigationBar projectsPromise={projects} />
        </div>
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
