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
  projectId: string;
}) {
  const navigate = useNavigate();

  return (
    <Listbox label="Project actions">
      {actions().map(({ name, redirectUrl, icon }, index) => (
        <ListboxItem
          key={name.toLowerCase()}
          onClick={() => navigate(`/project/${projectId}/${redirectUrl}`)}
          startContent={icon}
          className="w-full"
        >
          {name}
        </ListboxItem>
      ))}
    </Listbox>
  );
}

export function LoadingProjectNavigationActionsList() {
  return [...Array(5)].map((e, i) => (
    <Skeleton key={i} className="m-2 w-2/4 rounded-lg">
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
