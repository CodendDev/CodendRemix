import type { BacklogTaskType } from "~/api/types/baseEntitiesTypes";
import React from "react";
import { Avatar, Skeleton } from "@nextui-org/react";
import {
  taskTypeToColorClass,
  typeToOutlineColor,
} from "~/components/utils/TypeToColor";
import type { OptionsDropdownItem } from "~/components/utils/dropdown/OptionsDropdown";
import { OptionsDropdown } from "~/components/utils/dropdown/OptionsDropdown";
import { deleteOption } from "~/components/utils/dropdown/DropdownDefaultOptions";
import { useNavigate, useParams } from "@remix-run/react";

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
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const backlogTaskSelected: string =
    selectedBacklogTaskId === id
      ? `outline ${typeToOutlineColor[taskType]} outline-offset-0 outline-1`
      : "";

  const handleClick = () => {
    setSelectedBacklogTaskId(id);
    navigate(`/project/${projectId}/backlog/${id}/${taskType.toLowerCase()}`);
  };

  const dropDownOptions: OptionsDropdownItem[] = [
    {
      label: "Assign to me",
      onClick: () => {},
    },
    {
      label: "Edit",
      onClick: () => {},
    },
    deleteOption(() => {}),
  ];

  return (
    <div
      className={`flex min-w-fit flex-shrink-0 flex-row items-center bg-gray-100 p-1 first:rounded-t-lg last:rounded-b-lg hover:cursor-pointer hover:bg-gray-200 ${backlogTaskSelected}`}
      onClick={handleClick}
    >
      <div className="flex w-unit-xl min-w-[8rem] grow flex-row">
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
          <OptionsDropdown options={dropDownOptions} />
        </div>
      </div>
    </div>
  );
}

export default BacklogTask;

export function BacklogTaskLoading() {
  return <Skeleton className="h-10 p-1 first:rounded-t-lg last:rounded-b-lg" />;
}
