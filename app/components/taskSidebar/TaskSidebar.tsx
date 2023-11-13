import {
  ProjectTask,
  ProjectTaskStatus,
  UserDetails,
} from "~/api/types/baseEntitiesTypes";
import { Suspense } from "react";
import { Await } from "@remix-run/react";
import { Skeleton } from "@nextui-org/react";
import TaskDetails from "~/components/taskSidebar/TaskDetails";
import { ProjectTaskStatusesResponse } from "~/api/types/projectTaskStatusesTypes";

type TaskSidebarProps = {
  projectTaskPromise: Promise<ProjectTask>;
  projectTaskStatusesResponse: ProjectTaskStatusesResponse;
  projectMembers: UserDetails[];
};
export function TaskSidebar({
  projectTaskPromise,
  projectTaskStatusesResponse,
  projectMembers,
}: TaskSidebarProps) {
  return (
    <Suspense fallback={<TaskSidebarLoading />}>
      <Await resolve={projectTaskPromise}>
        {(projectTask) => (
          <AwaitedTaskSidebar
            task={projectTask}
            statuses={projectTaskStatusesResponse.projectTaskStatuses}
            projectMembers={projectMembers}
          />
        )}
      </Await>
    </Suspense>
  );
}

export default TaskSidebar;

function TaskSidebarLoading() {
  return <Skeleton className="h-full w-[30rem] border-1 border-emerald-700" />;
}

function AwaitedTaskSidebar({
  task,
  statuses,
  projectMembers,
}: {
  task: ProjectTask;
  statuses: ProjectTaskStatus[];
  projectMembers: UserDetails[];
}) {
  return (
    <div className="w-min-[25rem] flex h-full w-[40rem] flex-col overflow-x-auto border-l-1 border-emerald-700">
      <TaskDetails
        projectTask={task}
        statuses={statuses}
        projectMembers={projectMembers}
      />
    </div>
  );
}
