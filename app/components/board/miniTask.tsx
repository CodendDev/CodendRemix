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
} from "@nextui-org/react";
import { MdMoreHoriz } from "react-icons/md/index.js";
import React, { useContext } from "react";
import { SelectedMiniTaskContext } from "~/components/board/boardContainer";

export type MiniTaskProps = {
  id: string;
  taskType: TaskType;
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

export function MiniTask({
  id,
  name,
  priority,
  taskType,
  avatarUrl,
  relatedTaskId,
}: MiniTaskProps) {
  const { selectedMiniTaskId, setSelectedMiniTaskId } = useContext(
    SelectedMiniTaskContext
  );
  const handleClick = () => {
    setSelectedMiniTaskId(id);
  };

  const type = taskType !== "Base" && taskType;
  const gradientColor =
    relatedTaskId !== null && relatedTaskId === selectedMiniTaskId
      ? relatedTypeToGradientColor[taskType]
      : typeToGradientColor[taskType];

  const miniTaskSelected: string =
    selectedMiniTaskId === id
      ? `outline ${typeToOutlineColor[taskType]} outline-offset-0 outline-1`
      : "";

  return (
    <Card
      className={`text-start shadow-md hover:shadow-lg ${miniTaskSelected}`}
      isPressable={true}
      onPress={handleClick}
    >
      <div className={`flex w-full justify-between px-5 py-3 ${gradientColor}`}>
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
    </Card>
  );
}

export default MiniTask;

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
  return (
    <Dropdown className="min-w-fit">
      <DropdownTrigger>
        <Link isBlock>
          <MdMoreHoriz className="text-lg" />
        </Link>
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
