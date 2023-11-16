import type {
  Sprint,
  SprintAssignableTask,
} from "~/api/types/baseEntitiesTypes";
import { Suspense, useState } from "react";
import { Await } from "@remix-run/react";
import { GrAdd } from "react-icons/gr/index.js";
import { taskTypeToColorClass } from "~/components/utils/TypeToColor";
import { AiOutlineCheck, AiOutlineSave } from "react-icons/ai/index.js";
import { Button } from "@nextui-org/react";

interface SprintBacklogProps {
  assignableTasksPromise: Promise<SprintAssignableTask[]>;
  sprint: Sprint;
}

export default function SprintBacklog(props: SprintBacklogProps) {
  return (
    <Suspense>
      <Await resolve={props.assignableTasksPromise}>
        {(tasks) => <AwaitedBacklog tasks={tasks} {...props} />}
      </Await>
    </Suspense>
  );
}

const AwaitedBacklog = ({
  tasks,
  sprint,
}: SprintBacklogProps & { tasks: SprintAssignableTask[] }) => {
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  const handleCheck = (id: string, check: boolean) => {
    const c_checkedTasks = checkedTasks;
    if (check) {
      c_checkedTasks.push(id);
    } else {
      c_checkedTasks.splice(c_checkedTasks.indexOf(id), 1);
    }

    setCheckedTasks(c_checkedTasks);
  };

  const handleSave = () => {
    console.log(checkedTasks);
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="flex items-center justify-between p-4">
        <div>Chose tasks that you want to add to the sprint</div>
        <Button
          color="primary"
          size="lg"
          onClick={handleSave}
          startContent={<AiOutlineSave />}
        >
          Save
        </Button>
      </div>
      <div className="px-4">
        <div>Assigned tasks</div>
        {sprint.sprintTasks.tasks.map((task, i) => (
          <BacklogTask key={i} {...task} checkTask={handleCheck} checked />
        ))}
      </div>
      <div className="px-4">
        <div>Unassigned tasks</div>
        {tasks.map((task, i) => (
          <BacklogTask key={i} {...task} checkTask={handleCheck} />
        ))}
      </div>
    </div>
  );
};

const BacklogTask = ({
  id,
  name,
  taskType,
  checkTask,
  checked = false,
}: SprintAssignableTask & {
  checkTask: (taskId: string, check: boolean) => void;
  checked?: boolean;
}) => {
  const colorClass = taskTypeToColorClass[taskType];
  const [selected, setSelected] = useState(checked);
  const handleClick = () => {
    setSelected((prev) => !prev);
    checkTask(id, !selected);
  };

  return (
    <div
      className={`flex cursor-pointer justify-between px-4 py-1
       ${selected ? "bg-gray-200" : "hover:bg-gray-100"}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center pr-2">
          {selected ? <AiOutlineCheck /> : <GrAdd />}
        </div>
        <div className={`pr-1 ${colorClass}`}>{taskType}</div>
        <div>{name}</div>
      </div>
    </div>
  );
};
