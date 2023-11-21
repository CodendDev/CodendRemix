import TaskDetails from "~/components/taskSidebar/TaskDetails";
import { ProjectTask } from "~/api/types/baseEntitiesTypes";

type CreateTaskSidebarProps = {
  emptyTask?: ProjectTask;
  actionRouteRoot: string;
};

export function CreateTaskSidebar({
  emptyTask,
  actionRouteRoot,
}: CreateTaskSidebarProps) {
  return (
    <div className="flex h-full w-[35rem] flex-col overflow-x-auto border-l-1 border-emerald-700">
      <TaskDetails
        projectTask={emptyTask}
        formType="POST"
        actionRouteRoot={actionRouteRoot}
      />
    </div>
  );
}

export default CreateTaskSidebar;
