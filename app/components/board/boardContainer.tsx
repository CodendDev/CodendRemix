import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { MiniTaskProps } from "~/components/board/miniTask";
import { boardData, statusesData } from "~/components/board/tempData";
import StatusContainer from "~/components/board/statusContainer";

interface SelectedMiniTaskContextType {
  selectedMiniTaskId: string | null;
  setSelectedMiniTaskId: Dispatch<SetStateAction<string | null>>;
}

export const SelectedMiniTaskContext =
  createContext<SelectedMiniTaskContextType>({
    selectedMiniTaskId: null,
    setSelectedMiniTaskId: () => {},
  });

export function BoardContainer() {
  const [selectedMiniTaskId, setSelectedMiniTaskId] = useState<string | null>(
    null
  );

  const statuses = statusesData;
  const board = boardData;

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
    <div className="flex h-full p-4 gap-6">
      <SelectedMiniTaskContext.Provider
        value={{ selectedMiniTaskId, setSelectedMiniTaskId }}
      >
        {statuses.map((status) => (
          <StatusContainer
            key={status.id}
            statusId={status.id}
            name={status.name}
            tasks={tasksForStatus(status.id)}
          />
        ))}
      </SelectedMiniTaskContext.Provider>
    </div>
  );
}

export default BoardContainer;
