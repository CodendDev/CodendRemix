import { BacklogTaskType } from "~/api/types/baseEntitiesTypes";
import React from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from "@nextui-org/react";
import { MdMoreHoriz } from "react-icons/md/index.js";
import {
  taskTypeToColorClass,
  typeToOutlineColor,
} from "~/components/utils/TypeToColor";

type backlogTaskProps = Omit<BacklogTaskType, "createdOn"> & {
  selectedBacklogTaskId: string | undefined;
  setSelectedBacklogTaskId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

export function BacklogTask({
  id,
  name,
  taskType,
  statusName,
  assigneeAvatar,
  selectedBacklogTaskId,
  setSelectedBacklogTaskId,
}: backlogTaskProps) {
  const backlogTaskSelected: string =
    selectedBacklogTaskId === id
      ? `outline ${typeToOutlineColor[taskType]} outline-offset-0 outline-1`
      : "";

  const handleClick = () => {
    setSelectedBacklogTaskId(id);
  };

  return (
    <div
      className={`flex min-w-fit flex-shrink-0 flex-row items-center bg-gray-100 p-1 first:rounded-t-lg last:rounded-b-lg hover:cursor-pointer hover:bg-gray-200 ${backlogTaskSelected}`}
      onClick={handleClick}
    >
      <div className="flex w-unit-xl min-w-[15rem] grow flex-row">
        <div
          className={`${taskTypeToColorClass[taskType]}  min-w-unit-20 text-center font-bold`}
        >
          {taskType.replace(/Base/, "Task")}
        </div>
        <div className="truncate">{name}</div>
      </div>
      <div className="flex w-52 flex-row items-center justify-around">
        <div className="wh w-24 truncate text-start italic text-gray-600">
          {statusName}
        </div>
        <div className="flex w-8 justify-center">
          {assigneeAvatar && <Avatar src={assigneeAvatar} size="sm" />}
        </div>
        <div className="w-8 text-center">
          <BacklogTaskMoreDropdown />
        </div>
      </div>
    </div>
  );
}

export default BacklogTask;

export function BacklogTaskLoading() {
  return <Skeleton className="h-10 p-1 first:rounded-t-lg last:rounded-b-lg" />;
}

function BacklogTaskMoreDropdown() {
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
