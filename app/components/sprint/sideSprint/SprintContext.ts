import type {
  BacklogTaskType,
  Sprint,
  SprintAssignableTask,
} from "~/api/types/baseEntitiesTypes";

export type SprintTaskState = "ASSIGNED" | "UNASSIGNED" | "NEW" | "DELETED";
export const matchAdd = (state: SprintTaskState): SprintTaskState => {
  switch (state) {
    case "ASSIGNED":
    case "NEW":
      return state;
    case "UNASSIGNED":
      return "NEW";
    case "DELETED":
      return "ASSIGNED";
  }
};
export const matchDelete = (state: SprintTaskState): SprintTaskState => {
  switch (state) {
    case "ASSIGNED":
      return "DELETED";
    case "NEW":
      return "UNASSIGNED";
    case "UNASSIGNED":
    case "DELETED":
      return state;
  }
};
export type SprintTask = SprintAssignableTask & {
  state: SprintTaskState;
};
export const toSprintTasks = (
  tasks: BacklogTaskType[] | SprintAssignableTask[],
  state: SprintTaskState
): SprintTask[] =>
  tasks.map(
    (t): SprintTask => ({
      ...t,
      state,
    })
  );

export interface SprintContextType {
  tasks: SprintTask[];
  sprint?: Sprint;
  handleDelete: (_: SprintTask) => void;
  handleAdd: (_: SprintTask) => void;
  handleSave: () => void;
}
