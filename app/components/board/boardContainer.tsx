import type { Dispatch, SetStateAction } from "react";
import React, { createContext, Suspense, useState } from "react";
import type { MiniTaskProps } from "~/components/board/miniTask";
import StatusContainer from "~/components/board/statusContainer";
import type { Board, ProjectTaskStatus } from "~/api/types/baseEntitiesTypes";
import { Await } from "@remix-run/react";
import type { ProjectBoardResponse } from "~/api/types/projectTypes";
import type { ProjectTaskStatusesResponse } from "~/api/types/projectTaskStatusesTypes";

interface SelectedMiniTaskContextType {
  selectedMiniTaskId: string | null;
  setSelectedMiniTaskId: Dispatch<SetStateAction<string | null>>;
}

export const SelectedMiniTaskContext =
  createContext<SelectedMiniTaskContextType>({
    selectedMiniTaskId: null,
    setSelectedMiniTaskId: () => {},
  });

type BoardContainerProps = {
  boardPromise: Promise<ProjectBoardResponse>;
  statusesPromise: Promise<ProjectTaskStatusesResponse>;
};

export function BoardContainer({
  boardPromise,
  statusesPromise,
}: BoardContainerProps) {
  const [selectedMiniTaskId, setSelectedMiniTaskId] = useState<string | null>(
    null
  );

  return (
    <div className="flex h-full gap-6 p-4">
      <SelectedMiniTaskContext.Provider
        value={{ selectedMiniTaskId, setSelectedMiniTaskId }}
      >
        <Suspense>
          <Await resolve={statusesPromise}>
            {(statusesResponse) => (
              <Suspense>
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
      </SelectedMiniTaskContext.Provider>
    </div>
  );
}

export default BoardContainer;

function AwaitedBoardContainer({
  statuses,
  board,
}: {
  statuses: ProjectTaskStatus[];
  board: Board;
}) {
  /* Probably will be replaced, when backend endpoint will be improved. */
  const tasksForStatus = (statusId: string): MiniTaskProps[] => {
    let tasks = board.tasks.filter((task) => task.statusId === statusId);
    let epics = board.epics.filter((story) => story.statusId === statusId);
    let stories = board.stories.filter((epics) => epics.statusId === statusId);
    return tasks
      .map((task): MiniTaskProps => {
        return { ...task, relatedTaskId: task.storyId };
      })
      .concat(
        epics.map((epic): MiniTaskProps => {
          return { ...epic, taskType: "Epic" };
        })
      )
      .concat(
        stories.map((story): MiniTaskProps => {
          return { ...story, taskType: "Story", relatedTaskId: story.epicId };
        })
      );
  };

  return (
    <>
      {statuses.map((status) => (
        <StatusContainer
          key={status.id}
          statusId={status.id}
          name={status.name}
          tasks={tasksForStatus(status.id)}
        />
      ))}
    </>
  );
}
