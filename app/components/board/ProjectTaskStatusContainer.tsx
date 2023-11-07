import { Card } from "@nextui-org/card";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { MdMoreHoriz, MdAddCircleOutline } from "react-icons/md/index.js";
import React from "react";
import ProjectBoardTask, {
  ProjectBoardTaskLoading,
} from "~/components/board/ProjectBoardTask";
import { useDrop } from "react-dnd";
import { DragItemTypes } from "~/components/board/ProjectBoard";
import { BoardTask } from "~/api/types/baseEntitiesTypes";
import { useLocation } from "@remix-run/react";
import EditStatusModal from "~/components/projectTaskStatus/EditStatusModal";
import DeleteStatusModal from "~/components/projectTaskStatus/DeleteStatusModal";

type BoardStatusContainerProps = {
  name: string;
  statusId: string;
  position?: string;
  tasks: BoardTask[];
};

export function ProjectTaskStatusContainer({
  name,
  statusId,
  position,
  tasks,
}: BoardStatusContainerProps) {
  const editStatusModal = useDisclosure();
  const deleteStatusModal = useDisclosure();
  const location = useLocation();
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragItemTypes.Task,
      drop: () => {},
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [tasks]
  );
  const projectId = location.pathname
    .toLowerCase()
    .replace("/project/", "")
    .slice(0, 36);

  return (
    <>
      <div className="flex h-full w-full min-w-[300px] flex-col">
        <StatusContainerHeader
          name={name}
          onEdit={editStatusModal.onOpen}
          onDelete={deleteStatusModal.onOpen}
        />
        <Card className="flex h-full w-full flex-col gap-4 bg-gray-100 px-4 py-6 shadow-none">
          {tasks
            .sort((a, b) => a.position.localeCompare(b.position))
            .map((task) => (
              <ProjectBoardTask {...task} key={task.id} />
            ))}
        </Card>
      </div>
      <EditStatusModal
        projectId={projectId}
        statusId={statusId}
        statusName={name}
        isOpen={editStatusModal.isOpen}
        onOpenChange={editStatusModal.onOpenChange}
      />
      <DeleteStatusModal
        projectId={projectId}
        statusId={statusId}
        statusName={name}
        isOpen={deleteStatusModal.isOpen}
        onOpenChange={deleteStatusModal.onOpenChange}
      />
    </>
  );
}

export default ProjectTaskStatusContainer;

export function ProjectTaskStatusContainerLoading({
  name,
  isLoaded = false,
}: {
  name?: string;
  isLoaded?: boolean;
}) {
  return (
    <div className="flex h-full w-full min-w-[300px] grow flex-col">
      {name ? (
        <StatusContainerHeader
          name={name}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ) : (
        <Skeleton className="mx-4 mb-2 rounded-lg" isLoaded={isLoaded}>
          <div className="bg-gray-300 px-6 py-1 text-lg text-gray-300">
            HIDDEN
          </div>
        </Skeleton>
      )}
      <Card className="flex h-full flex-col gap-4 bg-gray-100 px-4 py-6 shadow-none">
        <ProjectBoardTaskLoading isLoaded={isLoaded} />
        <ProjectBoardTaskLoading isLoaded={isLoaded} />
        <ProjectBoardTaskLoading isLoaded={isLoaded} />
        <ProjectBoardTaskLoading isLoaded={isLoaded} />
      </Card>
    </div>
  );
}

function StatusContainerHeader({
  name,
  onEdit,
  onDelete,
}: {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
          <DropdownMenu aria-label="More">
            <DropdownItem key="edit" onPress={onEdit}>
              Edit name
            </DropdownItem>
            <DropdownItem
              key="delete"
              onPress={onDelete}
              className="text-danger"
              color="danger"
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
