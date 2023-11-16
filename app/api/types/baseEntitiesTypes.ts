//
// Base entities
//

import type { WithErrorsResponse } from "~/api/types/authorizationTypes";

/**
 * Represents project entity.
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
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
 * Represents baseProjectTask entity.
 */
export interface BaseProjectTask {
  id: string;
  taskType: TaskType;
  name: string;
  priority: Priority;
  statusId: string;
  description?: string;
  dueDate?: string;
  estimatedTime?: EstimatedTime;
  storyPoints?: number;
  assigneeId?: string;
  storyId?: string;
}

/**
 * Represents bugfixProjectTask entity.
 */
export interface BugfixProjectTask {
  id: string;
  taskType: TaskType;
  name: string;
  priority: Priority;
  statusId: string;
  description?: string;
  dueDate?: string;
  estimatedTime?: EstimatedTime;
  storyPoints?: number;
  assigneeId?: string;
  storyId?: string;
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

//
// Board entities
//

/**
 * Represents board entity.
 */
export interface Board {
  tasks: BoardTask[];
}

/**
 * Represents boardProjectTask entity.
 */
export interface BoardTask {
  id: string;
  taskType: TaskType;
  name: string;
  statusId: string;
  relatedTaskId: string;
  priority: Priority;
  assigneeAvatar: string;
  position: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal?: string;
  sprintTasks: { tasks: BacklogTaskType[] };
}

export interface SprintAssignableTask {
  id: string;
  name: string;
  taskType: TaskType;
  statusName: string;
}

/**
 * Represents backlogTask entity.
 */
export interface BacklogTaskType {
  id: string;
  name: string;
  taskType: TaskType;
  statusName: string;
  assigneeAvatar?: string;
  createdOn: Date;
}

/**
 * Represents backlog entity.
 */
export interface BacklogType {
  tasks: BacklogTaskType[];
}

export interface ProjectTask {
  id: string;
  taskType?: TaskType;
  name: string;
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
