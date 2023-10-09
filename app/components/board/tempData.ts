import { Board } from "~/api/types/baseEntitiesTypes";

const avatarUrl: string = "https://i.pravatar.cc/150?u=a042581f4e29026024d";

export const statusesData = [
  { id: "0", name: "ToDo" },
  { id: "1", name: "InProgress" },
  { id: "2", name: "Done" },
];

export const boardData: Board = {
  tasks: [
    {
      id: "0",
      name: "Create very cool tasks",
      taskType: "Base",
      priority: "Low",
      statusId: "0",
      storyId: "3",
      assigneeId: avatarUrl,
    },
    {
      id: "1",
      name: "Create very cool tasks v2",
      taskType: "Bugfix",
      priority: "Low",
      statusId: "1",
      storyId: "3",
      assigneeId: avatarUrl,
    },
    {
      id: "2",
      name: "Create not very cool tasks.",
      taskType: "Base",
      priority: "Low",
      statusId: "2",
      storyId: "4",
      assigneeId: avatarUrl,
    },
  ],
  stories: [
    {
      id: "3",
      name: "Some story for you.",
      statusId: "0",
      epicId: "5",
    },
    {
      id: "4",
      name: "Some story not for you.",
      statusId: "1",
      epicId: "5",
    },
  ],
  epics: [
    {
      id: "5",
      name: "Some coool epic essa",
      statusId: "1",
    },
  ],
};
