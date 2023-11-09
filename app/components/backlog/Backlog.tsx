import React, { Suspense, useState } from "react";
import type { BacklogType } from "~/api/types/baseEntitiesTypes";
import { Await } from "@remix-run/react";
import BacklogTask, {
  BacklogTaskLoading,
} from "~/components/backlog/BacklogTask";
import TaskSidebar from "~/components/taskSidebar/TaskSidebar";

type BacklogProps = {
  backlogPromise: Promise<BacklogType>;
};

export function Backlog({ backlogPromise }: BacklogProps) {
  return (
    <Suspense fallback={<BacklogLoading />}>
      <Await resolve={backlogPromise}>
        {(backlog) => AwaitedBacklog({ backlog })}
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

function AwaitedBacklog({ backlog }: { backlog: BacklogType }) {
  const [selectedBacklogTaskId, setSelectedBacklogTaskId] = useState<
    string | undefined
  >(undefined);
  const getSelectedTask = () =>
    backlog.tasks.find((task) => task.id === selectedBacklogTaskId);

  return (
    <>
      <div className="w-full px-6 py-2">
        <div className="px-6 py-2 font-bold text-gray-700">
          Backlog
          <span className="ml-1 font-normal text-gray-400">
            ({backlog.tasks.length} tasks)
          </span>
        </div>
        <div className="flex max-h-[calc(100vh-6rem)] min-h-0 min-w-0 flex-shrink-0 flex-col justify-between gap-1 overflow-auto rounded-lg p-1 outline-dashed outline-1 outline-offset-1 outline-gray-400">
          {backlog.tasks.map((task) => (
            <BacklogTask
              key={task.id}
              {...task}
              selectedBacklogTaskId={selectedBacklogTaskId}
              setSelectedBacklogTaskId={setSelectedBacklogTaskId}
            />
          ))}
        </div>
      </div>
      <TaskSidebar
        taskId={selectedBacklogTaskId}
        taskType={getSelectedTask()?.taskType}
      />
    </>
  );
}
