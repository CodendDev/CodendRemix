import type { Dispatch, SetStateAction } from "react";
import React, { createContext, Suspense, useState } from "react";
import type { MiniTaskProps } from "~/components/board/ProjectBoardTask";
import ProjectTaskStatusContainer, {
  ProjectTaskStatusContainerLoading,
} from "~/components/board/ProjectTaskStatusContainer";
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

export function ProjectBoard({
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
      </SelectedMiniTaskContext.Provider>
    </div>
  );
}

export default ProjectBoard;

function ProjectBoardLoading({ statuses }: { statuses?: ProjectTaskStatus[] }) {
  return statuses ? (
    <>
      {statuses.map((status) => (
        <ProjectTaskStatusContainerLoading key={status.id} name={status.name} />
      ))}
    </>
  ) : (
    <>
      <ProjectTaskStatusContainerLoading />
      <ProjectTaskStatusContainerLoading />
      <ProjectTaskStatusContainerLoading />
    </>
  );
}

function AwaitedBoardContainer({
  statuses,
  board,
}: {
  statuses: ProjectTaskStatus[];
  board: Board;
}) {
  /* Probably will be replaced, when backend endpoint will be improved. */
  const tasksForStatus = (statusId: string): MiniTaskProps[] => {
    const tasks = board.tasks.filter((task) => task.statusId === statusId);
    const epics = board.epics.filter((story) => story.statusId === statusId);
    const stories = board.stories.filter(
      (epics) => epics.statusId === statusId
    );
    return tasks
      .map((task): MiniTaskProps => ({ ...task, relatedTaskId: task.storyId }))
      .concat(
        epics.map((epic): MiniTaskProps => ({ ...epic, taskType: "Epic" }))
      )
      .concat(
        stories.map(
          (story): MiniTaskProps => ({
            ...story,
            taskType: "Story",
            relatedTaskId: story.epicId,
          })
        )
      );
  };

  return (
    <>
      {statuses.map((status) => (
        <ProjectTaskStatusContainer
          key={status.id}
          statusId={status.id}
          name={status.name}
          tasks={tasksForStatus(status.id)}
        />
      ))}
    </>
  );
}
