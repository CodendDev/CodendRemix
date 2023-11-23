import { ProjectTask } from "~/api/types/baseEntitiesTypes";
import { Suspense } from "react";
import { Await } from "@remix-run/react";
import { Skeleton } from "@nextui-org/react";
import TaskDetails from "~/components/taskSidebar/TaskDetails";

type TaskSidebarProps = {
  projectTaskPromise: Promise<ProjectTask>;
  actionRouteRoot: string;
  cancelRoute?: string;
};
export function TaskSidebar({
  projectTaskPromise,
  actionRouteRoot,
  cancelRoute = actionRouteRoot,
}: TaskSidebarProps) {
  return (
    <Suspense fallback={<TaskSidebarLoading />}>
      <Await resolve={projectTaskPromise}>
        {(projectTask) => (
          <AwaitedTaskSidebar
            task={projectTask}
            actionRouteRoot={actionRouteRoot}
            cancelRoute={cancelRoute}
          />
        )}
      </Await>
    </Suspense>
  );
}

export default TaskSidebar;

export function TaskSidebarLoading() {
  return (
    <div className="flex h-full w-[15rem] flex-col gap-3 px-4 py-3 md:w-[25rem] xl:w-[30rem] 2xl:w-[35rem]">
      <div className="flex flex-row gap-3">
        <Skeleton className="h-12 w-36 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <div className="ml-32 flex flex-col gap-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-12 w-1/2 rounded-lg" />
        <Skeleton className="h-12 w-1/2 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}

function AwaitedTaskSidebar({
  task,
  actionRouteRoot,
  cancelRoute,
}: {
  task: ProjectTask;
  actionRouteRoot: string;
  cancelRoute: string;
}) {
  return (
    <div>
      <div className="flex h-full w-[15rem] flex-col overflow-x-auto border-l-1 border-emerald-700 md:w-[25rem] xl:w-[30rem] 2xl:w-[35rem]">
        <TaskDetails
          projectTask={task}
          formType="PUT"
          actionRouteRoot={actionRouteRoot}
          cancelRoute={cancelRoute}
        />
      </div>
    </div>
  );
}
