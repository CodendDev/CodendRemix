import type {
  PagedResponse,
  Project,
  UserDetails,
} from "~/api/types/baseEntitiesTypes";
import ProjectNavigationList, {
  LoadingProjectNavigationList,
} from "~/components/projectNavigation/ProjectNavigationList";
import ProjectNavigationActionsList, {
  LoadingProjectNavigationActionsList,
} from "~/components/projectNavigation/ProjectNavigationActionsList";
import { Await, useNavigate, useParams, useSubmit } from "@remix-run/react";
import React, { Suspense, useState } from "react";
import ProjectNameDivider, {
  LoadingProjectNameDivider,
} from "~/components/projectNavigation/ProjectNameDivider";
import { LuLogOut } from "react-icons/lu/index.js";
import { Button, User } from "@nextui-org/react";

type ProjectNavigationBarProps = {
  projectsPromise: Promise<PagedResponse<Project>>;
  userDetails: UserDetails;
};

export const ProjectNavigationBarContext = React.createContext<{
  setProjectName: (name: string) => void;
}>({
  setProjectName: () => {},
});

export function ProjectNavigationBar({
  projectsPromise,
  userDetails,
}: ProjectNavigationBarProps) {
  const projectId = useParams().projectId;

  return (
    <Suspense fallback={<LoadingProjectNavigationBar />}>
      <Await
        resolve={projectsPromise}
        errorElement={<ErrorProjectNavigationBar />}
      >
        {(projects) => (
          <AwaitedProjectNavigationBar
            projects={projects.data!.items}
            projectId={projectId}
            userDetails={userDetails}
          />
        )}
      </Await>
    </Suspense>
  );
}

function ErrorProjectNavigationBar() {
  return (
    <div className="flex w-56 flex-col">
      <LoadingProjectNavigationList error />
      <LoadingProjectNameDivider />
      <LoadingProjectNavigationActionsList />
    </div>
  );
}

function LoadingProjectNavigationBar() {
  return (
    <div className="flex w-56 flex-col">
      <LoadingProjectNavigationList />
      <LoadingProjectNameDivider />
      <LoadingProjectNavigationActionsList />
    </div>
  );
}

function AwaitedProjectNavigationBar({
  projectId,
  projects,
  userDetails,
}: {
  projectId: string | undefined;
  projects: Project[];
  userDetails: UserDetails;
}) {
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);
  const [name, setName] = useState<string | undefined>(project?.name);

  const submit = useSubmit();

  return (
    <div className="flex w-56 flex-col overflow-y-auto">
      <ProjectNavigationBarContext.Provider value={{ setProjectName: setName }}>
        <div className="max-h-1/2 overflow-y-auto">
          <ProjectNavigationList
            projects={projects}
            selectedProjectId={projectId}
          />
        </div>
        <ProjectNameDivider name={name} />
        <ProjectNavigationActionsList projectId={projectId} />
        <div className="mb-2 mt-auto flex flex-col gap-2 px-3">
          <User
            name={`${userDetails.firstName} ${userDetails.lastName}`}
            description={userDetails.email}
            avatarProps={{
              src: userDetails.imageUrl,
            }}
            className="cursor-pointer p-1 hover:bg-gray-300"
            classNames={{
              description: "overflow-hidden text-ellipsis w-36",
              name: "w-36 line-clamp-2",
            }}
            onClick={() => {
              navigate("/user/account/details");
            }}
          />
          <Button
            variant="ghost"
            color="primary"
            fullWidth
            endContent={<LuLogOut />}
            className="text-md font-bold"
            onPress={() => submit({}, { method: "POST" })}
          >
            Log Out
          </Button>
        </div>
      </ProjectNavigationBarContext.Provider>
    </div>
  );
}

export default ProjectNavigationBar;
