import { BoardMiniTask } from "~/api/types/baseEntitiesTypes";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/react";
import { MdMoreHoriz, MdAddCircleOutline } from "react-icons/md/index.js";
import React from "react";
import MiniTask from "~/components/board/miniTask";

type BoardStatusContainerProps = {
  name: string;
  statusId: string;
  tasks: BoardMiniTask[];
};

export function StatusContainer({
  name,
  statusId,
  tasks,
}: BoardStatusContainerProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <StatusContainerHeader name={name} />
      <Card className="flex flex-col h-full bg-gray-100 py-6 px-4 gap-4 shadow-none">
        {tasks.map((task) => (
          <MiniTask {...task} key={task.id} />
        ))}
      </Card>
    </div>
  );
}

export default StatusContainer;

function StatusContainerHeader({ name }: { name: string }) {
  const iconsStyle: string = "text-sky-500 text-xl";

  return (
    <div className="flex justify-between px-6 py-1">
      <div className="text-lg">{name}</div>
      <div className="flex justify-center gap-1">
        <Button isIconOnly radius="full" size="sm" variant="light">
          <MdAddCircleOutline className={iconsStyle} />
        </Button>
        <Button isIconOnly radius="full" size="sm" variant="light">
          <MdMoreHoriz className={iconsStyle} />
        </Button>
      </div>
    </div>
  );
}
