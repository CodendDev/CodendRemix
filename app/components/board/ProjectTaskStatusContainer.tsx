import { Card } from "@nextui-org/card";
import { Button, Skeleton, useDisclosure } from "@nextui-org/react";
import { MdAddCircleOutline } from "react-icons/md/index.js";
import React from "react";
import ProjectBoardTask, {
  ProjectBoardTaskLoading,
} from "~/components/board/ProjectBoardTask";
import type { BoardTask } from "~/api/types/baseEntitiesTypes";
import { useLocation, useNavigate, useParams } from "@remix-run/react";
import EditStatusModal from "~/components/projectTaskStatus/EditStatusModal";
import type { OptionsDropdownItem } from "~/components/utils/dropdown/OptionsDropdown";
import { OptionsDropdown } from "~/components/utils/dropdown/OptionsDropdown";
import { deleteOption } from "~/components/utils/dropdown/DropdownDefaultOptions";
import DeleteModal from "~/components/shared/modals/DeleteModal";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { DroppableType } from "~/components/board/ProjectBoardDnd";

type BoardStatusContainerProps = {
  name: string;
  statusId: string;
  tasks: BoardTask[];
  editable: boolean;
  index: number;
};

export function ProjectTaskStatusContainer({
  name,
  statusId,
  tasks,
  editable,
  index,
}: BoardStatusContainerProps) {
  const editStatusModal = useDisclosure();
  const deleteStatusModal = useDisclosure();
  const location = useLocation();
  const projectId = location.pathname
    .toLowerCase()
    .replace("/project/", "")
    .slice(0, 36);

  return (
    <Draggable draggableId={statusId} index={index} isDragDisabled={!editable}>
      {(draggableStatusProvided, draggableStatusSnapshot) => (
        <div
          ref={draggableStatusProvided.innerRef}
          {...draggableStatusProvided.draggableProps}
          {...draggableStatusProvided.dragHandleProps}
          className={`flex w-[20em] flex-shrink-0 flex-col px-2 ${
            draggableStatusSnapshot.isDragging
              ? "rounded-lg outline-dashed outline-2 -outline-offset-4 outline-emerald-500 drop-shadow-xl"
              : ""
          }`}
        >
          <StatusContainerHeader
            statusId={statusId}
            name={name}
            onEdit={editStatusModal.onOpen}
            onDelete={deleteStatusModal.onOpen}
            editable={editable}
          />
          <Droppable
            droppableId={statusId}
            type={DroppableType.statusContainer}
            isDropDisabled={!editable}
          >
            {(droppableProvided, droppableSnapshot) => (
              <Card
                className={`
                flex h-[calc(100vh-8.5rem)] flex-col overflow-y-auto bg-gray-100 ${
                  droppableSnapshot.draggingOverWith
                    ? "outline-2 -outline-offset-1 outline-emerald-500"
                    : droppableSnapshot.draggingFromThisWith
                    ? "outline-dashed outline-2 -outline-offset-1 outline-emerald-500"
                    : ""
                } p-3
              `}
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    draggableId={task.id}
                    key={task.id}
                    index={index}
                    isDragDisabled={!editable}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ProjectBoardTask
                          {...task}
                          key={task.id}
                          isDragged={snapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </Card>
            )}
          </Droppable>
          {editable && (
            <>
              <EditStatusModal
                projectId={projectId}
                statusId={statusId}
                statusName={name}
                isOpen={editStatusModal.isOpen}
                onOpenChange={editStatusModal.onOpenChange}
              />
              <DeleteModal
                actionRoute={`/api/project/${projectId}/projectTaskStatus/${statusId}`}
                deleteName={name}
                deleteHeader="Delete status"
                isOpen={deleteStatusModal.isOpen}
                onOpenChange={deleteStatusModal.onOpenChange}
              />
            </>
          )}
        </div>
      )}
    </Draggable>
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
    <div className="flex w-[20em] flex-shrink-0 flex-col px-2">
      {name ? (
        <StatusContainerHeader
          name={name}
          onEdit={() => {}}
          onDelete={() => {}}
          editable={true}
        />
      ) : (
        <Skeleton className="mx-4 mb-2 rounded-lg" isLoaded={isLoaded}>
          <div className="bg-gray-300 px-6 py-1 text-lg text-gray-300">
            HIDDEN
          </div>
        </Skeleton>
      )}
      <Card className="flex h-full flex-col gap-4 overflow-y-auto bg-gray-100 p-3">
        <ProjectBoardTaskLoading isLoaded={isLoaded} />
        <ProjectBoardTaskLoading isLoaded={isLoaded} />
        <ProjectBoardTaskLoading isLoaded={isLoaded} />
        <ProjectBoardTaskLoading isLoaded={isLoaded} />
      </Card>
    </div>
  );
}

function StatusContainerHeader({
  statusId,
  name,
  onEdit,
  onDelete,
  editable,
}: {
  statusId?: string;
  name: string;
  onEdit: () => void;
  onDelete: () => void;
  editable: boolean;
}) {
  const navigate = useNavigate();
  const params = useParams();
  const iconsStyle: string = "text-primary-500 text-xl";
  const dropdownOptions: OptionsDropdownItem[] = [
    {
      label: "Edit name",
      onPress: onEdit,
    },
    deleteOption(onDelete),
  ];

  return (
    <div className="flex justify-between px-6 py-1">
      <div className="text-lg">{name}</div>
      {editable && (
        <div className="flex justify-center gap-1">
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={() => {
              if (statusId) {
                navigate(
                  `/project/${params.projectId!}/board/${params.sprintId!}/${statusId}/create`
                );
              }
            }}
          >
            <MdAddCircleOutline className={iconsStyle} />
          </Button>
          <OptionsDropdown options={dropdownOptions} />
        </div>
      )}
    </div>
  );
}
