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
import handleLogout from "~/actions/handleLogout";
import { getUserDetails } from "~/api/methods/user";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  if (request.method === "POST") {
    return await handleLogout({ url: "/" });
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

  const userDetails = await getUserDetails({ token });
  const projects = getPagedProjects({ pageIndex: 1, pageSize: 100, token });

  return defer({ projects, userDetails });
};

export default function ProjectPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { projects, userDetails } = loaderData;

  const [isMenuOpen, setIsMenuOpen] = React.useState(true);

  return (
    <div className="flex h-screen">
      <div className="flex">
        <NavigationBarContext.Provider
          value={{ isOpen: isMenuOpen, setIsOpen: setIsMenuOpen }}
        >
          <NavigationBar />
        </NavigationBarContext.Provider>
        <div
          className={`flex w-full overflow-hidden border-r-1 border-emerald-700 duration-300 ease-in-out ${
            isMenuOpen ? "ml-0" : "-ml-56"
          }`}
        >
          <ProjectNavigationBar
            projectsPromise={projects}
            userDetails={userDetails}
          />
        </div>
      </div>
      <div className="grow overflow-y-auto">
        <Outlet context={userDetails} />
      </div>
    </div>
  );
}
