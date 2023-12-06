import React, {
  createContext,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
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
import { UserDetails } from "~/api/types/baseEntitiesTypes";
import { ProjectIndexComponent } from "~/components/ProjectIndexComponent";

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

  const userDetailsResponse = await getUserDetails({ token });
  const projects = getPagedProjects({ pageIndex: 1, pageSize: 100, token });

  return defer({ projects, userDetailsResponse });
};

export interface UserDetailsContextProps {
  userDetails: UserDetails;
  setUserDetails: React.Dispatch<SetStateAction<UserDetails>>;
}

export const UserDetailsContext = createContext<UserDetailsContextProps>({
  userDetails: { firstName: "", lastName: "", email: "", imageUrl: "", id: "" },
  setUserDetails: () => {},
});

export default function ProjectPage() {
  const loaderData = useLoaderData<typeof loader>();
  const location = useLocation();
  // @ts-ignore
  const { projects, userDetailsResponse } = loaderData;

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [userDetails, setUserDetails] = useState(userDetailsResponse);

  // 💀
  const isIndexRoute = location.pathname.toLowerCase() === "/project";

  useEffect(() => {
    setUserDetails(userDetailsResponse);
  }, [userDetailsResponse]);

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
        <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
          <Outlet />
          {isIndexRoute && <ProjectIndexComponent projectsPromise={projects} />}
        </UserDetailsContext.Provider>
      </div>
    </div>
  );
}
