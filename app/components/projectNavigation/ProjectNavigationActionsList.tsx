import React from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import {
  FiUsers,
  GiSprint,
  GoTasklist,
  BsListColumnsReverse,
  FaClipboardList,
} from "~/components/projectNavigation/icons";

export function ProjectNavigationActionsList({ action }: { action: string }) {
  const navigate = useNavigate();

  return (
    <Listbox
      label="Project actions"
      selectionMode="single"
      defaultSelectedKeys={[action]}
      disallowEmptySelection
    >
      {actions().map(({ name, redirectUrl, icon }, index) => (
        <ListboxItem
          key={name.toLowerCase()}
          onClick={async () => navigate(redirectUrl)}
          startContent={icon}
        >
          {name}
        </ListboxItem>
      ))}
    </Listbox>
  );
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
