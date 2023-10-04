/**
 * Represents board entity.
 */
export interface Board{
    Tasks: BoardProjectTask[];
    Stories: BoardStory[];
    Epics: BoardEpic[];
}

/**
 * Represents boardEpic entity.
 */
export interface BoardEpic{
    id: string;
    name: string;
    statusId: string;
}

/**
 * Represents boardStory entity.
 */
export interface BoardStory{
    id: string;
    name: string;
    epicId?: string;
    statusId: string;
}

/**
 * Represents boardProjectTask entity.
 */
export interface BoardProjectTask{
    id: string;
    taskType: string;
    name: string;
    priority: string;
    statusId: string;
    storyId?: string;
    assigneeId?: string;
}