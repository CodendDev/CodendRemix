import type { BacklogTaskType } from "~/api/types/baseEntitiesTypes";
import React from "react";
import { Avatar, Skeleton, useDisclosure } from "@nextui-org/react";
import {
  taskTypeToColorClass,
  typeToOutlineColor,
} from "~/components/utils/TypeToColor";
import type { OptionsDropdownItem } from "~/components/utils/dropdown/OptionsDropdown";
import { OptionsDropdown } from "~/components/utils/dropdown/OptionsDropdown";
import { deleteOption } from "~/components/utils/dropdown/DropdownDefaultOptions";
import { useNavigate, useParams, useSubmit } from "@remix-run/react";
import DeleteModal from "~/components/shared/modals/DeleteModal";

type backlogTaskProps = Omit<BacklogTaskType, "createdOn"> & {
  selectedBacklogTaskId: string | undefined;
  setSelectedBacklogTaskId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

export function BacklogTask({
  id,
  name,
  taskType,
  statusName,
  assigneeAvatar,
  selectedBacklogTaskId,
  setSelectedBacklogTaskId,
}: backlogTaskProps) {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const backlogTaskSelected: string =
    selectedBacklogTaskId === id
      ? `outline ${typeToOutlineColor[taskType]} outline-offset-0 outline-1`
      : "";

  const type = taskType !== "Base" && taskType;
  const typeName = !type ? "task" : taskType.toLowerCase();
  const path = `/project/${params.projectId!}/backlog/${id}/${taskType}`;

  const handleClick = () => {
    setSelectedBacklogTaskId(id);
    navigate(`/project/${projectId}/backlog/${id}/${taskType.toLowerCase()}`);
  };

  const submit = useSubmit();
  const taskDropdownOptions: OptionsDropdownItem[] = [
    {
      label: "Assign to me",
      onClick: () => submit({ id }, { method: "put" }),
    },
  ];

  const deleteModal = useDisclosure();
  const dropdownOptions: OptionsDropdownItem[] = [
    { label: "Edit", onClick: handleClick },
    deleteOption(deleteModal.onOpen),
  ];

  return (
    <>
      <div
        className={`flex justify-between bg-gray-100 p-1 first:rounded-t-lg last:rounded-b-lg hover:cursor-pointer hover:bg-gray-200 ${backlogTaskSelected}`}
        onClick={handleClick}
      >
        <div className="flex flex-row items-center">
          <div
            className={`${taskTypeToColorClass[taskType]} mx-3 text-center font-bold`}
          >
            {taskType.replace(/Base/, "Task")}
          </div>
          <div className="truncate">{name}</div>
        </div>
        <div className="flex flex-row items-center">
          <div className="mx-2">{statusName}</div>
          <div className="mx-1">
            {
              <Avatar
                className={!assigneeAvatar ? "invisible" : ""}
                src={assigneeAvatar}
                size="sm"
              />
            }
          </div>
          <div className="mx-1">
            <OptionsDropdown
              options={
                taskType !== "Epic" && taskType !== "Story"
                  ? [...taskDropdownOptions, ...dropdownOptions]
                  : dropdownOptions
              }
            />
          </div>
        </div>
      </div>
      <DeleteModal
        deleteHeader={`Delete ${typeName}`}
        deleteName={name}
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        actionRoute={path}
      />
    </>
  );
}

export default BacklogTask;

export function BacklogTaskLoading() {
  return <Skeleton className="h-10 p-1 first:rounded-t-lg last:rounded-b-lg" />;
}
