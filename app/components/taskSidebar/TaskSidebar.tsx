import { ProjectTask, ProjectTaskStatus } from "~/api/types/baseEntitiesTypes";
import { Suspense } from "react";
import { Await } from "@remix-run/react";
import { Skeleton } from "@nextui-org/react";
import TaskDetails from "~/components/taskSidebar/TaskDetails";
import { ProjectTaskStatusesResponse } from "~/api/types/projectTaskStatusesTypes";

type TaskSidebarProps = {
  projectTaskPromise: Promise<ProjectTask>;
  projectTaskStatusesResponse: ProjectTaskStatusesResponse;
};
export function TaskSidebar({
  projectTaskPromise,
  projectTaskStatusesResponse,
}: TaskSidebarProps) {
  return (
    <Suspense fallback={<TaskSidebarLoading />}>
      <Await resolve={projectTaskPromise}>
        {(projectTask) => (
          <AwaitedTaskSidebar
            task={projectTask}
            statuses={projectTaskStatusesResponse.projectTaskStatuses}
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
}: {
  task: ProjectTask;
  statuses: ProjectTaskStatus[];
}) {
  return (
    <div className="flex h-full w-[30rem] min-w-[20rem] flex-shrink flex-col overflow-x-auto rounded-lg border-1 border-emerald-700 bg-gray-100">
      <TaskDetails projectTask={task} statuses={statuses} />
    </div>
  );
}
