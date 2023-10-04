//
// Base entities
//

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
  taskType: string;
  name: string;
  priority: string;
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
  taskType: string;
  name: string;
  priority: string;
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
}

/**
 * Represents user details.
 */
export interface UserDetails {
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
  Tasks: BoardProjectTask[];
  Stories: BoardStory[];
  Epics: BoardEpic[];
}

/**
 * Represents boardEpic entity.
 */
export interface BoardEpic {
  id: string;
  name: string;
  statusId: string;
}

/**
 * Represents boardStory entity.
 */
export interface BoardStory {
  id: string;
  name: string;
  epicId?: string;
  statusId: string;
}

/**
 * Represents boardProjectTask entity.
 */
export interface BoardProjectTask {
  id: string;
  taskType: string;
  name: string;
  priority: string;
  statusId: string;
  storyId?: string;
  assigneeId?: string;
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

/**
 * Represents api error response object.
 */
export interface ApiErrorResponse {
  errorCode: string;
  message: string;
}

/**
 * Represents api errors response object.
 */
export interface ApiErrorsResponse {
  errors: ApiErrorResponse[];
}
