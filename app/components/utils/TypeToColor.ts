import { Priority, TaskType } from "~/api/types/baseEntitiesTypes";
import { SprintStatus } from "~/api/types/sprintTypes";

export const typeToGradientColor: Record<TaskType, string> = {
  Base: "",
  Bugfix: "",
  Story: "bg-gradient-to-r from-green-100",
  Epic: "bg-gradient-to-r from-purple-200",
};

export const relatedTypeToGradientColor: Record<TaskType, string> = {
  Base: "bg-gradient-to-l via-transparent from-green-100",
  Bugfix: "bg-gradient-to-l via-transparent from-green-100",
  Story: "bg-gradient-to-l via-transparent from-purple-200 to-green-100",
  Epic: "",
};

export const typeToOutlineColor: Record<TaskType, string> = {
  Base: "outline-sky-500",
  Bugfix: "outline-amber-500",
  Story: "outline-green-500",
  Epic: "outline-purple-500",
};

export const taskTypeToColorClass: Record<TaskType, string> = {
  Base: "text-sky-500",
  Bugfix: "text-amber-500",
  Story: "text-green-500",
  Epic: "text-purple-500",
};

export const priorityToColorClass: Record<Priority, string> = {
  VeryHigh: "text-red-500",
  High: "text-orange-500",
  Normal: "text-yellow-500",
  Low: "text-sky-500",
  VeryLow: "text-blue-500",
};

export const sprintStatusToColorClass: Record<SprintStatus, string> = {
  Archived: "text-gray-400",
  Active: "text-primary-500",
  Future: "text-cyan-500",
};
