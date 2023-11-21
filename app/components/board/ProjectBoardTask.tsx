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
import {
  DragItemTypes,
  SelectedProjectBoardTaskContext,
} from "~/components/board/ProjectBoard";
import { useDrag } from "react-dnd";
import type { OptionsDropdownItem } from "~/components/utils/dropdown/OptionsDropdown";
import { OptionsDropdown } from "~/components/utils/dropdown/OptionsDropdown";
import { deleteOption } from "~/components/utils/dropdown/DropdownDefaultOptions";
import { useNavigate, useParams } from "@remix-run/react";

export function ProjectBoardTask({
  id,
  name,
  statusId,
  priority,
  taskType,
  assigneeAvatar,
  relatedTaskId,
}: BoardTask) {
  const navigate = useNavigate();
  const params = useParams();
  const { selectedProjectBoardTaskId, setSelectedProjectBoardTaskId } =
    useContext(SelectedProjectBoardTaskContext);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DragItemTypes.Task,
    item: {
      id,
      name,
      statusId,
      priority,
      taskType,
      assigneeAvatar,
      relatedTaskId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      didDrop: monitor.didDrop(),
    }),
  }));

  const handleClick = () => {
    setSelectedProjectBoardTaskId(id);
    navigate(
      `/project/${params.projectId!}/board/${params.sprintId!}/${id}/${taskType.toLowerCase()}`
    );
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

  const dropdownOptions: OptionsDropdownItem[] = [
    {
      label: "Assign to me",
    },
    { label: "Edit" },
    deleteOption(() => {}),
  ];

  return (
    <div
      ref={drag}
      className={`rounded-lg bg-white text-start shadow-md hover:shadow-lg 
        ${!isDragging && miniTaskSelected} ${isDragging && "hidden"}`}
      onClick={handleClick}
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
