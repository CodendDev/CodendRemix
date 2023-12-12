import React, { useContext, useEffect, useState } from "react";

import { taskTypeToColorClass } from "~/components/utils/TypeToColor";
import type {
  SprintContextType,
  SprintTask,
  SprintTaskState,
} from "~/components/sprint/sideSprint/SprintContext";
import {
  matchAdd,
  matchDelete,
  toSprintTasks,
} from "~/components/sprint/sideSprint/SprintContext";

import type {
  Sprint,
  SprintAssignableTask,
} from "~/api/types/baseEntitiesTypes";

import { Button } from "@nextui-org/react";
import { AiOutlineSave } from "react-icons/ai/index.js";
import { FiPlus, FiCheck } from "react-icons/fi/index.js";
import { useSubmit } from "@remix-run/react";
import ClickableDiv from "~/components/utils/ClickableDiv";

export const SprintContext = React.createContext<SprintContextType>({
  handleAdd(_: SprintTask): void {},
  handleDelete(_: SprintTask): void {},
  handleSave(): void {},
  sprint: undefined,
  tasks: [],
});

interface SprintBacklogProps {
  assignableTasksPromise: Promise<SprintAssignableTask[]>;
  sprint: Sprint;
}
export default function SprintBacklog({
  assignableTasksPromise,
  sprint,
}: SprintBacklogProps) {
  const assigned = toSprintTasks(sprint.sprintTasks.tasks, "ASSIGNED");
  const [tasks, setTasks] = useState<SprintTask[]>(assigned);
  const [updatedTasks, setUpdatedTasks] = useState<{
    [Key: string]: SprintTask;
  }>({});

  useEffect(() => {
    (async () => {
      const unassigned = toSprintTasks(
        await assignableTasksPromise,
        "UNASSIGNED"
      );
      setTasks(assigned.concat(unassigned));
    })();
  }, [assignableTasksPromise, sprint]);

  const handleTask = (
    task: SprintTask,
    matcher: (_: SprintTaskState) => SprintTaskState
  ) => {
    if (!tasks) {
      return;
    }

    const index = tasks.findIndex((t) => t.id === task.id);
    if (index === -1) {
      return;
    }

    if (updatedTasks[task.id] === undefined) {
      updatedTasks[task.id] = task;
    }
    setUpdatedTasks(updatedTasks);
    tasks.splice(index, 1);
    setTasks(tasks.concat([{ ...task, state: matcher(task.state) }]));
  };

  const submit = useSubmit();
  const handleSave = () => {
    const toUpdate: SprintTask[] = [];

    for (const id in updatedTasks) {
      const task = tasks.find((t) => t.id === id);
      if (task?.state !== updatedTasks[id].state) {
        toUpdate.push(task!);
      }
    }

    submit({ tasks: JSON.stringify(toUpdate) }, { method: "POST" });
  };

  if (!tasks) {
    return <BacklogLoading />;
  }

  return (
    <SprintContext.Provider
      value={{
        tasks,
        handleDelete: (t) => handleTask(t, matchDelete),
        handleAdd: (t) => handleTask(t, matchAdd),
        handleSave,
      }}
    >
      <AwaitedBacklog />
    </SprintContext.Provider>
  );
}

const BacklogLoading = () => <></>;

const AwaitedBacklog = () => {
  const { handleSave, handleAdd, handleDelete, tasks } =
    useContext(SprintContext);

  const handleCheck = (task: SprintTask, check: boolean) => {
    if (check) {
      handleAdd(task);
    } else {
      handleDelete(task);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between py-4 pl-4">
        <div className="text-xl text-emerald-800">
          Chose tasks that you want to add to the sprint
        </div>
        <Button
          color="primary"
          size="md"
          startContent={<AiOutlineSave />}
          className=" text-lg font-bold"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
      <BacklogTasksList
        handleCheck={handleCheck}
        labelElement={<>Sprint tasks</>}
        tasks={tasks.filter(({ state }) => state === "ASSIGNED")}
        defaultChecked
      />
      <BacklogTasksList
        handleCheck={handleCheck}
        labelElement={<>Tasks that you unassigned</>}
        tasks={tasks.filter(({ state }) => state === "DELETED")}
      />
      <BacklogTasksList
        handleCheck={handleCheck}
        labelElement={<>Tasks that you assigned</>}
        tasks={tasks.filter(({ state }) => state === "NEW")}
        defaultChecked
      />
      <BacklogTasksList
        handleCheck={handleCheck}
        labelElement={<>Available tasks</>}
        tasks={tasks.filter(({ state }) => state === "UNASSIGNED")}
      />
    </div>
  );
};

const BacklogTasksList = ({
  labelElement,
  tasks,
  handleCheck,
  defaultChecked = false,
}: {
  labelElement: React.ReactElement;
  tasks: SprintTask[];
  handleCheck: (task: SprintTask, check: boolean) => void;
  defaultChecked?: boolean;
}) => {
  if (tasks.length < 1) {
    return <></>;
  }

  return (
    <div>
      <div className="rounded-t-xl border-1 border-gray-300 px-4 py-1 text-lg text-emerald-800">
        {labelElement}
      </div>
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
  state,
  checked = false,
}: SprintTask & {
  checkTask: (task: SprintTask, check: boolean) => void;
  checked?: boolean;
}) => {
  const colorClass = taskTypeToColorClass[taskType];
  const [selected, setSelected] = useState(checked);
  const handleClick = () => {
    setSelected((prev) => !prev);
    checkTask({ id, name, taskType, statusName, state }, !selected);
  };

  return (
    <ClickableDiv
      className={`flex cursor-pointer justify-between border-1 border-t-0 border-gray-300 px-4 py-1 last:rounded-b-xl hover:bg-gray-200
       ${selected ? "bg-gray-100" : ""}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center pr-2 text-xl">
          {selected ? <FiCheck /> : <FiPlus />}
        </div>
        <div className={`pr-1 ${colorClass}`}>{taskType}</div>
        <div className="w-[11em] overflow-hidden text-ellipsis whitespace-nowrap md:w-[15em] lg:w-[20em] xl:w-[32em] 2xl:w-[45em]">
          {name}
        </div>
      </div>
    </ClickableDiv>
  );
};
