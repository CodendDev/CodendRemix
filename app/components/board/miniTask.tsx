import { TaskType } from "~/api/types/baseEntitiesTypes";
import type { BaseProjectTask } from "~/api/types/baseEntitiesTypes";
import { Card } from "@nextui-org/card";
import { Avatar, Spacer } from "@nextui-org/react";

type MiniTaskProps = Pick<BaseProjectTask, "name" | "priority" | "taskType"> & {
  avatarUrl: string;
};

export function MiniTask({
  name,
  priority,
  taskType,
  avatarUrl,
}: MiniTaskProps) {
  const type = taskType !== "Base" && taskType;

  return (
    <Card>
      <div className="flex justify-between">
        <div>
          <div className="flex">
            <TaskPriority priority={priority} />
            {type && (
              <>
                <Spacer x={2} />
                <TaskType type={taskType} />
              </>
            )}
          </div>
          <div>{name}</div>
        </div>
        <div>
          <Avatar src={avatarUrl} />
        </div>
      </div>
    </Card>
  );
}

export default MiniTask;

function TaskType({ type }: { type: TaskType }) {
  return (
    <>
      <div>{type}</div>
    </>
  );
}

function TaskPriority({ priority }: { priority: string }) {
  return <div>{priority}</div>;
}
