import type { Priority, TaskType } from "~/api/types/baseEntitiesTypes";
import { Card } from "@nextui-org/card";
import {
  Avatar,
  Spacer,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
  Skeleton,
  Button,
} from "@nextui-org/react";
import { MdMoreHoriz } from "react-icons/md/index.js";
import React, { useContext } from "react";
import {
  DragItemTypes,
  SelectedProjectBoardTaskContext,
} from "~/components/board/ProjectBoard";
import { useDrag } from "react-dnd";

export type ProjectBoardTaskProps = {
  id: string;
  taskType: TaskType;
  statusId: string;
  name: string;
  priority?: Priority;
  relatedTaskId?: string;
  avatarUrl?: string;
};

const typeToGradientColor: Record<TaskType, string> = {
  Base: "",
  Bugfix: "",
  Story: "bg-gradient-to-r from-green-100",
  Epic: "bg-gradient-to-r from-purple-200",
};

const relatedTypeToGradientColor: Record<TaskType, string> = {
  Base: "bg-gradient-to-l via-transparent from-green-100",
  Bugfix: "bg-gradient-to-l via-transparent from-green-100",
  Story: "bg-gradient-to-l via-transparent from-purple-200 to-green-100",
  Epic: "",
};

const typeToOutlineColor: Record<TaskType, string> = {
  Base: "outline-sky-500",
  Bugfix: "outline-amber-500",
  Story: "outline-green-500",
  Epic: "outline-purple-500",
};

export function ProjectBoardTask({
  id,
  name,
  statusId,
  priority,
  taskType,
  avatarUrl,
  relatedTaskId,
}: ProjectBoardTaskProps) {
  const { selectedProjectBoardTaskId, setSelectedProjectBoardTaskId } =
    useContext(SelectedProjectBoardTaskContext);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DragItemTypes.Task,
    item: { id, name, statusId, priority, taskType, avatarUrl, relatedTaskId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      didDrop: monitor.didDrop(),
    }),
  }));

  const handleClick = () => {
    setSelectedProjectBoardTaskId(id);
  };
  const type = taskType !== "Base" && taskType;

  const gradientColor =
    relatedTaskId !== null && relatedTaskId === selectedProjectBoardTaskId
      ? relatedTypeToGradientColor[taskType]
      : typeToGradientColor[taskType];

  const miniTaskSelected: string =
    selectedProjectBoardTaskId === id
      ? `outline ${typeToOutlineColor[taskType]} -outline-offset-1 outline-1`
      : "";

  return (
    <div
      ref={drag}
      className={`rounded-lg bg-white text-start shadow-md hover:shadow-lg 
        ${!isDragging && miniTaskSelected} ${isDragging && "hidden"}`}
      onClick={handleClick}
    >
      <div
        className={`flex w-full justify-between rounded-lg px-5 py-3 ${gradientColor}`}
      >
        <div>
          <div className="flex">
            {type && <MiniTaskType type={taskType} />}
            {priority && (
              <>
                {type && <Spacer x={2} />}
                <MiniTaskPriority priority={priority} />
              </>
            )}
          </div>
          <div>{name}</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          {avatarUrl && (
            <>
              <div className="flex justify-center ">
                <Avatar src={avatarUrl} />
              </div>
            </>
          )}
          <div className="flex justify-center">
            <MiniTaskMoreDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectBoardTask;

export function ProjectBoardTaskLoading() {
  return <Skeleton className="h-16 rounded-lg" />;
}

function MiniTaskType({ type }: { type: TaskType }) {
  const taskTypeToColorClass: Record<TaskType, string> = {
    Base: "",
    Bugfix: "text-amber-500",
    Story: "text-green-500",
    Epic: "text-purple-500",
  };

  const colorClass = taskTypeToColorClass[type];

  return <div className={`${colorClass} font-semibold underline`}>{type}</div>;
}

function MiniTaskPriority({ priority }: { priority: Priority }) {
  const priorityToColorClass: Record<Priority, string> = {
    VeryHigh: "text-red-500",
    High: "text-orange-500",
    Normal: "text-yellow-500",
    Low: "text-emerald-500",
    VeryLow: "text-teal-500",
  };

  const colorClass = priorityToColorClass[priority];

  return (
    <div className={`${colorClass} font-semibold`}>
      {priority.replace(/Very/, "Very ")}
    </div>
  );
}

function MiniTaskMoreDropdown() {
  const iconsStyle: string = "text-sky-500 text-xl";

  return (
    <Dropdown className="min-w-fit">
      <DropdownTrigger>
        <Button variant="light" radius="full" size="sm" isIconOnly>
          <MdMoreHoriz className={iconsStyle} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="More">
        <DropdownItem key="assignToMe">Assign to me</DropdownItem>
        <DropdownItem key="edit">Edit</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
