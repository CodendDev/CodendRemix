import { Card } from "@nextui-org/card";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { MdMoreHoriz, MdAddCircleOutline } from "react-icons/md/index.js";
import React from "react";
import MiniTask, { MiniTaskProps } from "~/components/board/miniTask";

type BoardStatusContainerProps = {
  name: string;
  statusId: string;
  tasks: MiniTaskProps[];
};

export function StatusContainer({
  name,
  statusId,
  tasks,
}: BoardStatusContainerProps) {
  return (
    <div className="flex h-full w-full min-w-[300px] flex-col">
      <StatusContainerHeader name={name} />
      <Card className="flex h-full flex-col gap-4 bg-gray-100 px-4 py-6 shadow-none">
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
        <Dropdown className="min-w-fit">
          <DropdownTrigger>
            <Button isIconOnly radius="full" size="sm" variant="light">
              <MdMoreHoriz className={iconsStyle} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="edit">Edit name</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
