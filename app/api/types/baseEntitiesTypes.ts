import type { WithErrorsResponse } from "~/api/types/authorizationTypes";

/**
 * Represents project entity.
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  isFavourite: boolean;
}

/**
 * Represents epic entity.
 */
export interface Epic {
  id: string;
  name: string;
  description: string;
  statusId: string;
}

/**
 * Represents story entity.
 */
export interface Story {
  id: string;
  name: string;
  description: string;
  epicId?: string;
  statusId: string;
}

/**
 * Represents Sprint entity.
 */
export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal?: string;
  sprintTasks: { tasks: BacklogTaskType[] };
}

/**
 * Represents Sprint assignable task
 */
export interface SprintAssignableTask {
  id: string;
  name: string;
  taskType: TaskType;
  statusName: string;
}

/**
 * Represents project task status entity.
 */
export interface ProjectTaskStatus {
  id: string;
  name: string;
  position: string;
}

/**
 * Represents user details.
 */
export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
}

export interface MinimalProjectTask {
  id: string;
  name: string;
  taskType: TaskType;
}

/**
 * Represents ProjectTask
 */
export interface ProjectTask extends MinimalProjectTask {
  priority?: Priority;
  statusId: string;
  description?: string;
  dueDate?: string;
  estimatedTime?: EstimatedTime;
  storyPoints?: number;
  assigneeId?: string;
  storyId?: string;
  epicId?: string;
}

/**
 * Represents boardProjectTask entity.
 */
export interface BoardTask extends MinimalProjectTask {
  statusId: string;
  relatedTaskId: string;
  priority: Priority;
  assigneeAvatar: string;
  position: string;
}

/**
 * Represents backlogTask entity.
 */
export interface BacklogTaskType extends MinimalProjectTask {
  statusName: string;
  assigneeAvatar?: string;
  createdOn: Date;
}

//
// Common entities
//

/**
 * Represents estimated time object.
 */
export interface EstimatedTime {
  minutes: number;
  hours: number;
  days: number;
}

//
// Const types
//

/**
 * Represents TaskType.
 */
export type TaskType = "Base" | "Bugfix" | "Story" | "Epic";

/**
 * Represents Priority.
 */
export type Priority = "VeryHigh" | "High" | "Normal" | "Low" | "VeryLow";

export interface PagedRequest {
  pageIndex: number;
  pageSize: number;
  search?: string;
  sortColumn?: string;
  sortOrder?: string;
}

export interface PagedResponseData<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasePreviousPage: boolean;
  items: T[];
}

export interface PagedResponse<T> extends WithErrorsResponse {
  data?: PagedResponseData<T>;
}
