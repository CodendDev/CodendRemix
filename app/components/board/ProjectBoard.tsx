import React, {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Dispatch, SetStateAction } from "react";

import { Await, useFetcher, useParams } from "@remix-run/react";
import type {
  BoardTask,
  ProjectTaskStatus,
} from "~/api/types/baseEntitiesTypes";

import ProjectTaskStatusContainer, {
  ProjectTaskStatusContainerLoading,
} from "~/components/board/ProjectTaskStatusContainer";

import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { AiOutlinePlus } from "react-icons/ai/index.js";
import { EditStatusModal } from "~/components/projectTaskStatus/EditStatusModal";

import { BoardQueryContext } from "~/components/board/ProjectBoardFilter";
import { StatusesContext } from "~/routes/project.$projectId/route";

import {
  DragDropContext,
  DraggableLocation,
  DropResult,
  OnDragEndResponder,
} from "react-beautiful-dnd";

export const DroppableType = {
  statusContainer: "StatusContainer",
  boardContainer: "BoardContainer",
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
  editable = false,
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

interface StatusTasks {
  status: ProjectTaskStatus;
  tasks: BoardTask[];
}

function AwaitedBoardContainer({
  boardTasks,
  editable,
}: {
  boardTasks: BoardTask[];
  editable: boolean;
}) {
  const params = useParams();
  const projectId = params.projectId!;
  const sprintId = params.sprintId!;
  const fetcher = useFetcher();
  const createStatusModal = useDisclosure();

  const statuses = useContext(StatusesContext);
  const queryContext = useContext(BoardQueryContext);
  const queriedTasks = useCallback(
    () => queryContext.filter(queryContext, boardTasks),
    [queryContext.query, boardTasks]
  );

  const getTasksForStatus = (statusId: string): BoardTask[] => {
    return queriedTasks().filter((task) => task.statusId === statusId);
  };

  const getSortedTasksForStatus = (statusId: string): BoardTask[] => {
    return getTasksForStatus(statusId).sort((a, b) =>
      a.position!.localeCompare(b.position!)
    );
  };

  const getFreshStatusesWithTasks = () =>
    statuses
      .sort((a, b) => a.position!.localeCompare(b.position!))
      .map((status) => ({
        status: status,
        tasks: getSortedTasksForStatus(status.id),
      }));

  const [statusesWithTasks, setStatusesWithTasks] = useState<StatusTasks[]>(
    getFreshStatusesWithTasks
  );

  // refresh when query applied or sprint changed
  useEffect(() => {
    setStatusesWithTasks(getFreshStatusesWithTasks);
  }, [queryContext.query, boardTasks]);

  const updateStatusesWithTasks = (statusId: string, newTasks: BoardTask[]) => {
    setStatusesWithTasks((prevStatuses) =>
      prevStatuses.map((statusTasks) =>
        statusTasks.status.id === statusId
          ? { status: statusTasks.status, tasks: newTasks }
          : statusTasks
      )
    );
  };

  const isSameDroppable = (result: DropResult) =>
    result.destination &&
    result.source.droppableId === result.destination.droppableId &&
    result.source.index === result.destination.index;

  const submitBoardTaskMove = ({
    source,
    destination,
    destinationTasks,
    draggableId,
  }: {
    source: DraggableLocation;
    destination: DraggableLocation;
    destinationTasks: BoardTask[];
    draggableId: string;
  }) => {
    const draggedTask = boardTasks.find((task) => task.id === draggableId)!;

    const prev =
      destination.index - 1 < 0
        ? ""
        : destinationTasks[destination.index - 1].position;
    const next =
      destination.index > destinationTasks.length - 1
        ? ""
        : destinationTasks[destination.index].position;
    const statusId =
      source.droppableId === destination.droppableId
        ? ""
        : destination.droppableId;
    fetcher.submit(
      { prev, next, statusId },
      {
        method: "POST",
        action: `/api/project/${projectId}/sprints/${sprintId}/task/${draggableId}/${draggedTask.taskType}/move`,
      }
    );
  };

  const handleBoardTaskDragDrop = (result: DropResult) => {
    const source = result.source;
    const destination = result.destination!;

    // prepare data for optimistic ui
    const destinationTasks = statusesWithTasks.find(
      ({ status }) => status.id === destination.droppableId
    )!.tasks;
    const newDestinationTasks = [...destinationTasks];

    // moved inside status container
    if (destination.droppableId === source.droppableId) {
      const [removedElement] = newDestinationTasks.splice(source.index, 1);
      newDestinationTasks.splice(destination.index, 0, removedElement);

      // remove reordered element for correct position calculations
      destinationTasks.splice(source.index, 1);
    }
    // moved between status containers
    else {
      const sourceTasks = statusesWithTasks.find(
        ({ status }) => status.id === source.droppableId
      )!.tasks;
      const [removedElement] = sourceTasks.splice(source.index, 1);
      newDestinationTasks.splice(destination.index, 0, removedElement);
    }

    updateStatusesWithTasks(destination.droppableId, newDestinationTasks);
    submitBoardTaskMove({
      source,
      destination,
      destinationTasks,
      draggableId: result.draggableId,
    });
  };

  const handleDragDrop: OnDragEndResponder = (result) => {
    // quit early when dropped in same place or outside droppable
    if (!result.destination || isSameDroppable(result)) return;

    if (result.type === DroppableType.statusContainer) {
      handleBoardTaskDragDrop(result);
    }
  };

  return (
    <div className="flex h-full flex-row gap-6 p-4">
      <DragDropContext onDragEnd={handleDragDrop}>
        {statusesWithTasks.map(({ status, tasks }) => (
          <ProjectTaskStatusContainer
            key={status.id}
            statusId={status.id}
            name={status.name}
            tasks={tasks}
            editable={editable}
          />
        ))}
      </DragDropContext>
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
