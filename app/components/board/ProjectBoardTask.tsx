import type {
  BoardTask,
  Priority,
  TaskType,
} from "~/api/types/baseEntitiesTypes";
import { Avatar, Spacer, Skeleton } from "@nextui-org/react";
import React, { useContext } from "react";
import {
  priorityToColorClass,
  relatedTypeToGradientColor,
  taskTypeToColorClass,
  typeToGradientColor,
  typeToOutlineColor,
} from "~/components/utils/TypeToColor";
import { SelectedProjectBoardTaskContext } from "~/components/board/ProjectBoard";
import type { OptionsDropdownItem } from "~/components/utils/dropdown/OptionsDropdown";
import { OptionsDropdown } from "~/components/utils/dropdown/OptionsDropdown";
import { deleteOption } from "~/components/utils/dropdown/DropdownDefaultOptions";
import { useLocation, useNavigate, useParams } from "@remix-run/react";

export function ProjectBoardTask({
  id,
  name,
  priority,
  taskType,
  assigneeAvatar,
  relatedTaskId,
}: BoardTask) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { selectedProjectBoardTaskId, setSelectedProjectBoardTaskId } =
    useContext(SelectedProjectBoardTaskContext);

  const handleClick = () => {
    setSelectedProjectBoardTaskId(id);
    if (location.pathname.toLowerCase().includes("board")) {
      navigate(
        `/project/${params.projectId!}/board/${params.sprintId!}/${id}/${taskType.toLowerCase()}`
      );
    } else {
      navigate(
        `/project/${params.projectId!}/tasks/${params.sprintId!}/${id}/${taskType.toLowerCase()}`
      );
    }
  };
  const type = taskType !== "Base" && taskType;

  const gradientColor =
    relatedTaskId !== null && relatedTaskId === selectedProjectBoardTaskId
      ? relatedTypeToGradientColor[taskType]
      : typeToGradientColor[taskType];

  const dropdownOptions: OptionsDropdownItem[] = [
    {
      label: "Assign to me",
    },
    { label: "Edit", onClick: handleClick },
    deleteOption(() => {}),
  ];

  const projectBoardTaskSelected: string =
    selectedProjectBoardTaskId === id
      ? `outline ${typeToOutlineColor[taskType]} outline-offset-0 outline-1`
      : "";

  return (
    <div
      onClick={handleClick}
      className={`rounded-lg bg-white text-start shadow-md hover:shadow-lg ${projectBoardTaskSelected}`}
    >
      <div
        className={`flex w-full justify-between rounded-lg px-3 py-2 ${gradientColor}`}
      >
        <div>
          <div className="flex">
            {type && <ProjectBoardTaskType type={taskType} />}
            {priority && (
              <>
                {type && <Spacer x={2} />}
                <ProjectBoardTaskPriority priority={priority} />
              </>
            )}
          </div>
          <div>{name}</div>
        </div>
        <div className="flex min-w-unit-10 flex-col items-center justify-center gap-1">
          {assigneeAvatar && (
            <>
              <div className="flex justify-center ">
                <Avatar src={assigneeAvatar} size="sm" />
              </div>
            </>
          )}
          <div className="flex justify-center">
            <OptionsDropdown options={dropdownOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectBoardTask;

export function ProjectBoardTaskLoading({
  isLoaded = false,
}: {
  isLoaded?: boolean;
}) {
  return (
    <Skeleton className="h-16 rounded-lg" isLoaded={isLoaded}>
      <div className="h-16 rounded-lg bg-gray-300"></div>
    </Skeleton>
  );
}

function ProjectBoardTaskType({ type }: { type: TaskType }) {
  const colorClass = taskTypeToColorClass[type];
  return <div className={`${colorClass} font-bold underline`}>{type}</div>;
}

function ProjectBoardTaskPriority({ priority }: { priority: Priority }) {
  const colorClass = priorityToColorClass[priority];

  return (
    <div className={`${colorClass} font-bold`}>
      {priority.replace(/Very/, "Very ")}
    </div>
  );
}
