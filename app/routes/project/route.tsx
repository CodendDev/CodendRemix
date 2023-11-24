import React from "react";
import { Outlet, useLoaderData } from "@remix-run/react";
import ProjectNavigationBar from "~/components/projectNavigation/ProjectNavigationBar";
import getToken from "~/actions/getToken";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { defer, redirect } from "@remix-run/node";
import { getPagedProjects, setIsFavourite } from "~/api/methods/project";
import {
  NavigationBar,
  NavigationBarContext,
} from "~/components/navigation/NavigationBar";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  if (request.method !== "PUT") {
    return undefined;
  }

  const formData = Object.fromEntries(await request.formData());
  await setIsFavourite({
    projectId: formData.projectId.toString(),
    isFavourite: formData.isFavourite.toString() === "true",
    token,
  });

  return redirect(formData.location.toString());
};

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
    <div className="flex h-full grow flex-row">
      <NavigationBarContext.Provider
        value={{ isOpen: isMenuOpen, setIsOpen: setIsMenuOpen }}
      >
        <NavigationBar />
      </NavigationBarContext.Provider>
      <div
        className={`flex border-r-1 border-emerald-700 transition-[margin] duration-300 ease-in-out ${
          isMenuOpen ? "" : "-ml-56 overflow-hidden"
        }`}
      >
        <ProjectNavigationBar projectsPromise={projects} />
      </div>
      <Outlet />
    </div>
  );
}
