import React, { createContext, Suspense, useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import { Await, useParams } from "@remix-run/react";
import type { BoardTask } from "~/api/types/baseEntitiesTypes";

import ProjectTaskStatusContainer, {
  ProjectTaskStatusContainerLoading,
} from "~/components/board/ProjectTaskStatusContainer";

import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { AiOutlinePlus } from "react-icons/ai/index.js";
import { EditStatusModal } from "~/components/projectTaskStatus/EditStatusModal";

import { BoardQueryContext } from "~/components/board/ProjectBoardFilter";
import { StatusesContext } from "~/routes/project.$projectId/route";

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
  boardPromise: Promise<BoardTask[]>;
  editable?: boolean;
};

export function ProjectBoard({
  boardPromise,
  editable = true,
}: ProjectBoardProps) {
  const [selectedProjectBoardTaskId, setSelectedProjectBoardTaskId] = useState<
    string | null
  >(null);

  return (
    <SelectedProjectBoardTaskContext.Provider
      value={{ selectedProjectBoardTaskId, setSelectedProjectBoardTaskId }}
    >
      <Suspense fallback={<ProjectBoardLoading />}>
        <Await resolve={boardPromise}>
          {(boardTasks) => (
            <AwaitedBoardContainer
              boardTasks={boardTasks}
              editable={editable}
            />
          )}
        </Await>
      </Suspense>
    </SelectedProjectBoardTaskContext.Provider>
  );
}

export default ProjectBoard;

export function ProjectBoardLoading({
  isLoaded = false,
}: {
  isLoaded?: boolean;
}) {
  const statuses = useContext(StatusesContext);

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
  boardTasks,
  editable,
}: {
  boardTasks: BoardTask[];
  editable: boolean;
}) {
  const createStatusModal = useDisclosure();
  const statuses = useContext(StatusesContext);
  const projectId = useParams().projectId!;

  const queryContext = useContext(BoardQueryContext);
  const queriedTasks = queryContext.filter(queryContext, boardTasks);
  const tasksForStatus = (statusId: string): BoardTask[] =>
    queriedTasks
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
            editable={editable}
          />
        ))}
      {editable && (
        <>
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
        </>
      )}
    </div>
  );
}
