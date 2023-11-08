import { Card } from "@nextui-org/card";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from "@nextui-org/react";
import { MdMoreHoriz, MdAddCircleOutline } from "react-icons/md/index.js";
import React from "react";
import type { ProjectBoardTaskProps } from "~/components/board/ProjectBoardTask";
import ProjectBoardTask, {
  ProjectBoardTaskLoading,
} from "~/components/board/ProjectBoardTask";
import { useDrop } from "react-dnd";
import { DragItemTypes } from "~/components/board/ProjectBoard";

type BoardStatusContainerProps = {
  name: string;
  statusId: string;
  tasks: ProjectBoardTaskProps[];
};

export function ProjectTaskStatusContainer({
  name,
  statusId,
  tasks,
}: BoardStatusContainerProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragItemTypes.Task,
      drop: () => {},
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [tasks]
  );

  return (
    <div className="flex h-full w-full min-w-[300px] flex-col">
      <StatusContainerHeader name={name} />
      <Card className="flex h-full w-full flex-col gap-4 bg-gray-100 px-4 py-6 shadow-none">
        {tasks.map((task) => (
          <ProjectBoardTask {...task} key={task.id} />
        ))}
      </Card>
    </div>
  );
}

export default ProjectTaskStatusContainer;

export function ProjectTaskStatusContainerLoading({ name }: { name?: string }) {
  return (
    <div className="flex h-full w-full min-w-[300px] flex-col">
      {name ? (
        <StatusContainerHeader name={name} />
      ) : (
        <Skeleton className="mx-4 mb-2 rounded-lg">
          <div className="px-6 py-1 text-lg">Es</div>
        </Skeleton>
      )}
      <Card className="flex h-full flex-col gap-4 bg-gray-100 px-4 py-6 shadow-none">
        <ProjectBoardTaskLoading />
        <ProjectBoardTaskLoading />
        <ProjectBoardTaskLoading />
        <ProjectBoardTaskLoading />
      </Card>
    </div>
  );
}

function StatusContainerHeader({ name }: { name: string }) {
  const iconsStyle: string = "text-sky-500 text-xl";

  return (
    <div className="flex justify-between px-6 py-1">
      <div className="text-lg">{name}</div>
      <div className="flex justify-center gap-1">
        <Button isIconOnly radius="full" size="sm" variant="light">
          <MdAddCircleOutline className={iconsStyle} />
        </Button>
        <Dropdown className="min-w-fit">
          <DropdownTrigger>
            <Button isIconOnly radius="full" size="sm" variant="light">
              <MdMoreHoriz className={iconsStyle} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="More">
            <DropdownItem key="edit">Edit name</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
