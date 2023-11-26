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

type BoardStatusContainerProps = {
  name: string;
  statusId: string;
  position?: string;
  tasks: BoardTask[];
  editable: boolean;
};

export function ProjectTaskStatusContainer({
  name,
  statusId,
  position,
  tasks,
  editable,
}: BoardStatusContainerProps) {
  const editStatusModal = useDisclosure();
  const deleteStatusModal = useDisclosure();
  const location = useLocation();
  const projectId = location.pathname
    .toLowerCase()
    .replace("/project/", "")
    .slice(0, 36);

  return (
    <>
      <div className="flex w-[30em] flex-shrink-0 flex-col px-2">
        <StatusContainerHeader
          statusId={statusId}
          name={name}
          onEdit={editStatusModal.onOpen}
          onDelete={deleteStatusModal.onOpen}
          editable={editable}
        />
        <Card className="flex h-full flex-col gap-4 overflow-y-auto bg-gray-100 p-3">
          {tasks
            .sort((a, b) => a.position.localeCompare(b.position))
            .map((task) => (
              <ProjectBoardTask {...task} key={task.id} />
            ))}
        </Card>
      </div>
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
    <div className="flex h-full w-full min-w-[15rem] grow flex-col">
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
