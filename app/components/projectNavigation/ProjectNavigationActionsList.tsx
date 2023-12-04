import React from "react";
import { Listbox, ListboxItem, Skeleton } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import {
  FiUsers,
  GiSprint,
  GoTasklist,
  BsListColumnsReverse,
  FaClipboardList,
} from "~/components/projectNavigation/icons";

export function ProjectNavigationActionsList({
  projectId,
}: {
  projectId: string | undefined;
}) {
  const navigate = useNavigate();

  return (
    <Listbox
      label="Project actions"
      disabledKeys={
        !projectId ? actions().map((action) => action.name.toLowerCase()) : []
      }
    >
      {actions().map(({ name, redirectUrl, icon }) => (
        <ListboxItem
          key={name.toLowerCase()}
          onClick={() => navigate(`/project/${projectId}/${redirectUrl}`)}
          startContent={icon}
          className="w-full rounded-lg px-3 text-xl"
          classNames={{
            title: "ml-2 text-lg",
          }}
        >
          {name}
        </ListboxItem>
      ))}
    </Listbox>
  );
}

export function LoadingProjectNavigationActionsList() {
  return [...Array(5)].map((e, i) => (
    <Skeleton key={i} className="m-2 w-44 rounded-lg">
      <div className="h-6 w-0.5"></div>
    </Skeleton>
  ));
}

function actions(): {
  name: string;
  redirectUrl: string;
  icon: React.ReactNode;
}[] {
  return [
    {
      name: "Board",
      redirectUrl: "board",
      icon: <FaClipboardList />,
    },
    {
      name: "Backlog",
      redirectUrl: "backlog",
      icon: <BsListColumnsReverse />,
    },
    {
      name: "My tasks",
      redirectUrl: "tasks",
      icon: <GoTasklist />,
    },
    {
      name: "Sprints",
      redirectUrl: "sprints",
      icon: <GiSprint />,
    },
    {
      name: "Users",
      redirectUrl: "users",
      icon: <FiUsers />,
    },
  ];
}

export default ProjectNavigationActionsList;
