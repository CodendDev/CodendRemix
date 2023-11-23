import TaskDetails from "~/components/taskSidebar/TaskDetails";
import { ProjectTask } from "~/api/types/baseEntitiesTypes";

type CreateTaskSidebarProps = {
  emptyTask?: ProjectTask;
  actionRouteRoot: string;
  cancelRoute?: string;
};

export function CreateTaskSidebar({
  emptyTask,
  actionRouteRoot,
  cancelRoute = actionRouteRoot,
}: CreateTaskSidebarProps) {
  return (
    <div>
      <div className="flex h-full w-[15rem] flex-col overflow-x-auto border-l-1 border-emerald-700 md:w-[25rem] xl:w-[30rem] 2xl:w-[35rem]">
        <TaskDetails
          projectTask={emptyTask}
          formType="POST"
          actionRouteRoot={actionRouteRoot}
          cancelRoute={cancelRoute}
        />
      </div>
    </div>
  );
}

export default CreateTaskSidebar;
