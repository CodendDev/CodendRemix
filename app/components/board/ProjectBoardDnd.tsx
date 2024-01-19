import { BoardTask, ProjectTaskStatus } from "~/api/types/baseEntitiesTypes";
import ProjectTaskStatusContainer from "~/components/board/ProjectTaskStatusContainer";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BoardQueryContext } from "~/components/board/ProjectBoardFilter";
import { StatusesContext } from "~/routes/project.$projectId";

import {
  DragDropContext,
  DraggableLocation,
  Droppable,
  DropResult,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { useFetcher, useParams } from "@remix-run/react";

export const DroppableType = {
  statusContainer: "StatusContainer",
  boardContainer: "BoardContainer",
};

interface StatusTasks {
  status: ProjectTaskStatus;
  tasks: BoardTask[];
}

export function ProjectBoardDnd({
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

  const statuses = useContext(StatusesContext);

  const queryContext = useContext(BoardQueryContext);
  const queriedTasks = useMemo(() => {
    return queryContext.filter(queryContext, boardTasks);
  }, [queryContext.query, boardTasks]);

  const getSortedTasksForStatus = useCallback(
    (statusId: string): BoardTask[] => {
      return queriedTasks
        .filter((task) => task.statusId === statusId)
        .sort((a, b) => a.position!.localeCompare(b.position!));
    },
    [queriedTasks]
  );

  const getFreshStatusesWithTasks = useMemo(() => {
    return statuses.map((status) => ({
      status: status,
      tasks: getSortedTasksForStatus(status.id),
    }));
  }, [statuses, getSortedTasksForStatus]);

  const [statusesWithTasks, setStatusesWithTasks] = useState<StatusTasks[]>(
    getFreshStatusesWithTasks
  );

  // refresh when query applied or sprint changed
  useEffect(() => {
    setStatusesWithTasks(getFreshStatusesWithTasks);
  }, [queryContext.query, boardTasks, getFreshStatusesWithTasks]);

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

  const updateStatusesWithTasksOrder = (statusesOrder: ProjectTaskStatus[]) => {
    setStatusesWithTasks((prevStatuses) => {
      // Create a map for quick lookup of status positions
      const statusPositionMap = new Map(
        statusesOrder.map((status, index) => [status.id, index])
      );

      // Sort the statuses based on the new order
      return [...prevStatuses].sort(
        (a, b) =>
          statusPositionMap.get(a.status.id)! -
          statusPositionMap.get(b.status.id)!
      );
    });
  };

  const submitStatusMove = ({
    destination,
    oldStatuses,
    draggableId,
  }: {
    destination: DraggableLocation;
    oldStatuses: ProjectTaskStatus[];
    draggableId: string;
  }) => {
    const prev =
      destination.index - 1 < 0
        ? ""
        : oldStatuses[destination.index - 1].position;
    const next =
      destination.index > oldStatuses.length - 1
        ? ""
        : oldStatuses[destination.index].position;
    fetcher.submit(
      { prev, next },
      {
        method: "POST",
        action: `/api/project/${projectId}/task-statuses/${draggableId}/move`,
      }
    );
  };

  const handleStatusDragDrop = (result: DropResult) => {
    const source = result.source;
    const destination = result.destination!;

    // optimistic ui
    const newStatuses = [
      ...statusesWithTasks.map((statusTask) => statusTask.status),
    ];
    const oldStatuses = [...newStatuses];
    const [removedElement] = newStatuses.splice(source.index, 1);
    newStatuses.splice(destination.index, 0, removedElement);

    updateStatusesWithTasksOrder(newStatuses);

    // remove reordered element for correct position calculations
    oldStatuses.splice(source.index, 1);
    submitStatusMove({
      destination,
      oldStatuses,
      draggableId: result.draggableId,
    });
  };

  const handleDragDrop: OnDragEndResponder = (result) => {
    // quit early when dropped in same place or outside droppable
    if (!result.destination || isSameDroppable(result)) return;

    if (result.type === DroppableType.statusContainer) {
      handleBoardTaskDragDrop(result);
    } else if (result.type === DroppableType.boardContainer) {
      handleStatusDragDrop(result);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragDrop}>
      <Droppable
        droppableId="board"
        type={DroppableType.boardContainer}
        isDropDisabled={!editable}
        direction="horizontal"
      >
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={`flex h-full flex-row rounded-lg ${
              droppableSnapshot.draggingOverWith
                ? "outline outline-2 outline-offset-4 outline-emerald-700"
                : ""
            }`}
          >
            {statusesWithTasks.map(({ status, tasks }, index) => (
              <ProjectTaskStatusContainer
                key={status.id}
                statusId={status.id}
                name={status.name}
                tasks={tasks}
                editable={editable}
                index={index}
              />
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
