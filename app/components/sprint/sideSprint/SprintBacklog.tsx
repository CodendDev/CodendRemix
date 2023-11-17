import type {
  Sprint,
  SprintAssignableTask,
} from "~/api/types/baseEntitiesTypes";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineSave } from "react-icons/ai/index.js";
import { Button } from "@nextui-org/react";
import { taskTypeToColorClass } from "~/components/utils/TypeToColor";
import { GrAdd } from "react-icons/gr/index.js";

interface SprintContextType {
  assignedTasks: SprintAssignableTask[];
  unassignedTasks: SprintAssignableTask[];
  newTasks: SprintAssignableTask[];
  toDelete: SprintAssignableTask[];
  sprint?: Sprint;
  handleDelete: (_: SprintAssignableTask) => void;
  handleAdd: (_: SprintAssignableTask) => void;
  handleSave: () => void;
}
export const SprintContext = React.createContext<SprintContextType>({
  handleAdd(_: SprintAssignableTask): void {},
  handleDelete(_: SprintAssignableTask): void {},
  handleSave(): void {},
  sprint: undefined,
  assignedTasks: [],
  unassignedTasks: [],
  toDelete: [],
  newTasks: [],
});

interface SprintBacklogProps {
  assignableTasksPromise: Promise<SprintAssignableTask[]>;
  sprint: Sprint;
}
export default function SprintBacklog({
  assignableTasksPromise,
  sprint,
}: SprintBacklogProps) {
  // 💀💀💀💀💀💀💀💀💀💀
  const [tasks, setTasks] = useState<SprintContextType | undefined>();

  const handleDelete = (task: SprintAssignableTask) => {
    console.log("delete", task);
  };
  const handleAdd = (task: SprintAssignableTask) => {
    console.log("add", task);
  };
  const handleSave = () => {
    console.log("save");
  };

  useEffect(() => {
    (async () => {
      const res = await assignableTasksPromise;
      setTasks({
        assignedTasks: sprint.sprintTasks.tasks,
        newTasks: [],
        unassignedTasks: res,
        toDelete: [],
        handleDelete,
        handleAdd,
        handleSave,
      });
    })();
  }, [assignableTasksPromise, sprint]);

  if (!tasks) {
    return <></>;
  }

  return (
    <SprintContext.Provider value={tasks}>
      <AwaitedBacklog />
    </SprintContext.Provider>
  );
}

const AwaitedBacklog = () => {
  const {
    assignedTasks,
    unassignedTasks,
    newTasks,
    handleSave,
    handleAdd,
    handleDelete,
  } = useContext(SprintContext);

  const handleCheck = (task: SprintAssignableTask, check: boolean) => {
    if (check) {
      handleAdd(task);
    } else {
      handleDelete(task);
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="flex items-center justify-between p-4">
        <div>Chose tasks that you want to add to the sprint</div>
        <Button
          color="primary"
          size="lg"
          startContent={<AiOutlineSave />}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
      <BacklogTasksList
        handleCheck={handleCheck}
        label="Assigned tasks"
        tasks={assignedTasks}
        defaultChecked
      />
      <BacklogTasksList
        handleCheck={handleCheck}
        label="New tasks"
        tasks={newTasks}
      />
      <BacklogTasksList
        handleCheck={handleCheck}
        label="Tasks you can assign"
        tasks={unassignedTasks}
      />
    </div>
  );
};

const BacklogTasksList = ({
  label,
  tasks,
  handleCheck,
  defaultChecked = false,
}: {
  label: string;
  tasks: SprintAssignableTask[];
  handleCheck: (task: SprintAssignableTask, check: boolean) => void;
  defaultChecked?: boolean;
}) => {
  if (tasks.length < 1) {
    return <></>;
  }

  return (
    <div>
      <div className="px-2">{label}</div>
      {tasks.map((task) => (
        <BacklogTask
          key={task.id}
          {...task}
          checkTask={handleCheck}
          checked={defaultChecked}
        />
      ))}
    </div>
  );
};

const BacklogTask = ({
  id,
  name,
  taskType,
  checkTask,
  statusName,
  checked = false,
}: SprintAssignableTask & {
  checkTask: (task: SprintAssignableTask, check: boolean) => void;
  checked?: boolean;
}) => {
  const colorClass = taskTypeToColorClass[taskType];
  const [selected, setSelected] = useState(checked);
  const handleClick = () => {
    setSelected((prev) => !prev);
    checkTask({ id, name, taskType, statusName }, !selected);
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
