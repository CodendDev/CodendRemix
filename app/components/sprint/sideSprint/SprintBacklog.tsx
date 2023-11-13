import type {
  BacklogType,
  BacklogTaskType,
} from "~/api/types/baseEntitiesTypes";
import { Suspense, useState } from "react";
import { Await } from "@remix-run/react";
import { GrAdd } from "react-icons/gr/index.js";
import { taskTypeToColorClass } from "~/components/utils/TypeToColor";
import { AiOutlineCheck, AiOutlineSave } from "react-icons/ai/index.js";
import { Button } from "@nextui-org/react";

interface SprintBacklogProps {
  backlogPromise: Promise<BacklogType>;
}
export default function SprintBacklog(props: SprintBacklogProps) {
  return (
    <Suspense>
      <Await resolve={props.backlogPromise}>
        {(backlog) => <AwaitedBacklog backlog={backlog} {...props} />}
      </Await>
    </Suspense>
  );
}

const AwaitedBacklog = ({
  backlog,
}: SprintBacklogProps & { backlog: BacklogType }) => {
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
      <div>
        {backlog.tasks.map((task, i) => (
          <BacklogTask key={i} {...task} checkTask={handleCheck} />
        ))}
      </div>
    </div>
  );
};

const BacklogTask = ({
  id,
  name,
  statusName,
  taskType,
  checkTask,
}: BacklogTaskType & {
  checkTask: (taskId: string, check: boolean) => void;
}) => {
  const colorClass = taskTypeToColorClass[taskType];
  const [selected, setSelected] = useState(false);
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
      <div className="flex">
        <div>{statusName}</div>
      </div>
    </div>
  );
};
