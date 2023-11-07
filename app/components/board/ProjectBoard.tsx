import type { Dispatch, SetStateAction } from "react";
import React, { createContext, Suspense, useState } from "react";
import ProjectTaskStatusContainer, {
  ProjectTaskStatusContainerLoading,
} from "~/components/board/ProjectTaskStatusContainer";
import type {
  Board,
  BoardTask,
  ProjectTaskStatus,
} from "~/api/types/baseEntitiesTypes";
import { Await, useLocation } from "@remix-run/react";
import type { ProjectBoardResponse } from "~/api/types/projectTypes";
import type { ProjectTaskStatusesResponse } from "~/api/types/projectTaskStatusesTypes";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { AiOutlinePlus } from "react-icons/ai/index.js";
import { EditStatusModal } from "~/components/projectTaskStatus/EditStatusModal";

export const DragItemTypes = {
  Task: "TASK",
};

interface SelectedProjectBoardTaskContextType {
  selectedProjectBoardTaskId: string | null;
  setSelectedProjectBoardTaskId: Dispatch<SetStateAction<string | null>>;
}

export const SelectedProjectBoardTaskContext =
  createContext<SelectedProjectBoardTaskContextType>({
    selectedProjectBoardTaskId: null,
    setSelectedProjectBoardTaskId: () => {},
  });

type ProjectBoardProps = {
  boardPromise: Promise<ProjectBoardResponse>;
  statusesPromise: Promise<ProjectTaskStatusesResponse>;
};

export function ProjectBoard({
  boardPromise,
  statusesPromise,
}: ProjectBoardProps) {
  const [selectedProjectBoardTaskId, setSelectedProjectBoardTaskId] = useState<
    string | null
  >(null);

  return (
    <SelectedProjectBoardTaskContext.Provider
      value={{ selectedProjectBoardTaskId, setSelectedProjectBoardTaskId }}
    >
      <Suspense fallback={<ProjectBoardLoading />}>
        <Await resolve={statusesPromise}>
          {(statusesResponse) => (
            <Suspense
              fallback={
                <ProjectBoardLoading
                  statuses={statusesResponse.projectTaskStatuses}
                />
              }
            >
              <Await resolve={boardPromise}>
                {(boardResponse) => (
                  <AwaitedBoardContainer
                    statuses={statusesResponse.projectTaskStatuses}
                    board={boardResponse.board}
                  />
                )}
              </Await>
            </Suspense>
          )}
        </Await>
      </Suspense>
    </SelectedProjectBoardTaskContext.Provider>
  );
}

export default ProjectBoard;

export function ProjectBoardLoading({
  statuses,
  isLoaded = false,
}: {
  statuses?: ProjectTaskStatus[];
  isLoaded?: boolean;
}) {
  return statuses ? (
    <div className="flex h-full w-full grow gap-6 p-4">
      {statuses
        .sort((a, b) => a.position.localeCompare(b.position))
        .map((status) => (
          <ProjectTaskStatusContainerLoading
            key={status.id}
            name={status.name}
          />
        ))}
    </div>
  ) : (
    <div className="flex h-full w-full grow gap-6 p-4">
      <ProjectTaskStatusContainerLoading isLoaded={isLoaded} />
      <ProjectTaskStatusContainerLoading isLoaded={isLoaded} />
      <ProjectTaskStatusContainerLoading isLoaded={isLoaded} />
    </div>
  );
}

function AwaitedBoardContainer({
  statuses,
  board,
}: {
  statuses: ProjectTaskStatus[];
  board: Board;
}) {
  const location = useLocation();
  const createStatusModal = useDisclosure();
  const projectId = location.pathname
    .toLowerCase()
    .replace("/project/", "")
    .slice(0, 36);

  const tasksForStatus = (statusId: string): BoardTask[] =>
    board.tasks
      .filter((task) => task.statusId === statusId)
      .sort((a, b) => a.position!.localeCompare(b.position!));

  return (
    <div className="flex max-h-full w-full gap-6 overflow-x-auto scroll-smooth p-4">
      {statuses
        .sort((a, b) => a.position!.localeCompare(b.position!))
        .map((status) => (
          <ProjectTaskStatusContainer
            key={status.id}
            statusId={status.id}
            name={status.name}
            position={status.position}
            tasks={tasksForStatus(status.id)}
          />
        ))}
      <div className="p-1">
        <Tooltip content="Add new status" placement="top" closeDelay={50}>
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={createStatusModal.onOpen}
          >
            <AiOutlinePlus className="text-2xl text-gray-700" />
          </Button>
        </Tooltip>
      </div>
      <EditStatusModal
        projectId={projectId}
        isOpen={createStatusModal.isOpen}
        onOpenChange={createStatusModal.onOpenChange}
      />
    </div>
  );
}
