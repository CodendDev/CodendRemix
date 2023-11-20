import React, { Suspense, useState } from "react";
import type { BacklogTaskType } from "~/api/types/baseEntitiesTypes";
import { Await, useNavigate, useParams } from "@remix-run/react";
import BacklogTask, {
  BacklogTaskLoading,
} from "~/components/backlog/BacklogTask";
import { MdAddCircleOutline } from "react-icons/md/index.js";
import { Button } from "@nextui-org/react";

type BacklogProps = {
  backlogTasksPromise: Promise<BacklogTaskType[]>;
};

export function Backlog({ backlogTasksPromise }: BacklogProps) {
  return (
    <Suspense fallback={<BacklogLoading />}>
      <Await resolve={backlogTasksPromise}>
        {(backlog) => AwaitedBacklog({ backlogTasks: backlog })}
      </Await>
    </Suspense>
  );
}

export default Backlog;

function BacklogLoading() {
  return (
    <div className="w-full px-6 py-1">
      <div className="px-6 py-2 font-bold text-gray-700">
        Backlog
        <span className="ml-1 font-normal text-gray-400">(loading...)</span>
      </div>
      <div className="outl flex flex-col justify-between gap-1 rounded-lg outline-dashed outline-1 outline-offset-4 outline-gray-400">
        <BacklogTaskLoading />
        <BacklogTaskLoading />
        <BacklogTaskLoading />
        <BacklogTaskLoading />
        <BacklogTaskLoading />
      </div>
    </div>
  );
}

function AwaitedBacklog({ backlogTasks }: { backlogTasks: BacklogTaskType[] }) {
  const [selectedBacklogTaskId, setSelectedBacklogTaskId] = useState<
    string | undefined
  >(undefined);
  const navigate = useNavigate();
  const params = useParams();

  const handlePress = () => {
    navigate(`/project/${params.projectId!}/backlog/create`);
  };

  return (
    <div className="w-full overflow-x-auto px-6 py-1">
      <div className="flex w-full flex-row gap-1">
        <div className="py-2 pl-6 font-bold text-gray-700">
          Backlog
          <span className="ml-1 font-normal text-gray-400">
            ({backlogTasks.length} tasks)
          </span>
        </div>
        <div className="flex items-center">
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={handlePress}
          >
            <MdAddCircleOutline className="text-2xl text-primary-500" />
          </Button>
        </div>
      </div>
      <div className="flex max-h-[calc(98vh-6rem)] min-h-0 min-w-[10rem] flex-shrink-0 flex-col justify-between gap-1 overflow-auto rounded-lg p-1 outline-dashed outline-1 outline-offset-1 outline-gray-400">
        {backlogTasks.map((task) => (
          <BacklogTask
            key={task.id}
            {...task}
            selectedBacklogTaskId={selectedBacklogTaskId}
            setSelectedBacklogTaskId={setSelectedBacklogTaskId}
          />
        ))}
      </div>
    </div>
  );
}
