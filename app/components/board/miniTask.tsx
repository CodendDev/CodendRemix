import { Priority, TaskType } from "~/api/types/baseEntitiesTypes";
import { Card } from "@nextui-org/card";
import { Avatar, Spacer } from "@nextui-org/react";
import { MoreHoriz } from "@mui/icons-material";

type MiniTaskProps = {
  name: string;
  priority?: Priority;
  taskType: MiniTaskType;
  avatarUrl: string;
};

type MiniTaskType = TaskType | "Story" | "Epic";

export function MiniTask({
  name,
  priority,
  taskType,
  avatarUrl,
}: MiniTaskProps) {
  const type = taskType !== "Base" && taskType;
  const prio = priority !== null && priority;

  return (
    <Card>
      <div className="flex justify-between py-3 px-5">
        <div>
          <div className="flex">
            {type && <MiniTaskType type={taskType} />}
            {prio && (
              <>
                {type && <Spacer x={2} />}
                <MiniTaskPriority priority={priority} />
              </>
            )}
          </div>
          <div>{name}</div>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="flex justify-center ">
            <Avatar src={avatarUrl} />
          </div>
          <div className="flex justify-center">
            <MoreHoriz></MoreHoriz>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default MiniTask;

function MiniTaskType({ type }: { type: MiniTaskType }) {
  const taskTypeToColorClass: Record<MiniTaskType, string> = {
    Base: "",
    Bugfix: "text-amber-500",
    Story: "text-green-500",
    Epic: "text-purple-500",
  };

  const colorClass = taskTypeToColorClass[type];

  return (
    <>
      <div className={`${colorClass} font-semibold`}>{type}</div>
    </>
  );
}

function MiniTaskPriority({ priority }: { priority: Priority }) {
  const priorityToColorClass: Record<Priority, string> = {
    VeryHigh: "text-red-500",
    High: "text-orange-500",
    Medium: "text-yellow-500",
    Low: "text-emerald-500",
    VeryLow: "text-teal-500",
  };

  const colorClass = priorityToColorClass[priority];

  return <div className={`${colorClass} font-semibold`}>{priority}</div>;
}
