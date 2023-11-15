import React from "react";

import { Skeleton } from "@nextui-org/react";

import type { Sprint as APISprintProps } from "~/api/types/baseEntitiesTypes";
import type { OptionsDropdownItem } from "~/components/utils/dropdown/OptionsDropdown";
import { OptionsDropdown } from "~/components/utils/dropdown/OptionsDropdown";
import { deleteOption } from "~/components/utils/dropdown/DropdownDefaultOptions";
import { useNavigate } from "@remix-run/react";
import { SprintStatus } from "~/api/types/sprintTypes";
import { sprintStatusToColorClass } from "~/components/utils/TypeToColor";

interface SprintProps extends APISprintProps {
  projectId: string;
  showUpdateModal: (sprint: APISprintProps) => void;
  showDeleteModal: (sprint: APISprintProps) => void;
}
export function Sprint(sprint: SprintProps) {
  const navigation = useNavigate();
  const { name, showDeleteModal, showUpdateModal } = sprint;

  const dropdownOptions: OptionsDropdownItem[] = [
    {
      label: "Edit",
      onPress: () => showUpdateModal(sprint),
    },
    deleteOption(() => showDeleteModal(sprint)),
  ];

  const getSprintStatus = (): SprintStatus => {
    const now = new Date();
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    if (end < now) {
      return "Archived";
    } else if (start < now && now < end) {
      return "Active";
    } else {
      return "Future";
    }
  };

  return (
    <div
      onClick={() => {
        getSprintStatus() !== "Archived" &&
          navigation(`/project/${sprint.projectId}/board/${sprint.id}`);
      }}
      className={`flex flex-row items-center bg-gray-100 p-1 pl-2 first:rounded-t-lg last:rounded-b-lg
      ${
        getSprintStatus() !== "Archived"
          ? "hover:cursor-pointer hover:bg-gray-200"
          : "text-gray-400"
      }`}
    >
      <div
        className={`min-w-[5rem] font-bold ${
          sprintStatusToColorClass[getSprintStatus()]
        }`}
      >
        {getSprintStatus()}
      </div>
      <div className="flex w-unit-xl min-w-[15rem] grow flex-row">
        <div className="truncate">{name}</div>
      </div>
      <OptionsDropdown options={dropdownOptions} />
    </div>
  );
}

export const SprintLoading = () => (
  <Skeleton className="h-10 p-1 first:rounded-t-lg last:rounded-b-lg" />
);

export default Sprint;
