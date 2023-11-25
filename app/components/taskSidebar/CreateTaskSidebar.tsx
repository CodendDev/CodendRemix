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
    <div className="min-w-[20em] flex-shrink-0">
      <TaskDetails
        projectTask={emptyTask}
        formType="POST"
        actionRouteRoot={actionRouteRoot}
        cancelRoute={cancelRoute}
      />
    </div>
  );
}

export default CreateTaskSidebar;
