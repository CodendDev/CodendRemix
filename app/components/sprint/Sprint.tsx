import React from "react";

import { Skeleton } from "@nextui-org/react";

import type { Sprint as APISprintProps } from "~/api/types/baseEntitiesTypes";
import type { OptionsDropdownItem } from "~/components/utils/dropdown/OptionsDropdown";
import { OptionsDropdown } from "~/components/utils/dropdown/OptionsDropdown";
import { deleteOption } from "~/components/utils/dropdown/DropdownDefaultOptions";

interface SprintProps extends APISprintProps {
  projectId: string;
  showUpdateModal: (sprint: APISprintProps) => void;
  showDeleteModal: (sprint: APISprintProps) => void;
}
export function Sprint(sprint: SprintProps) {
  const { name, showDeleteModal, showUpdateModal } = sprint;

  const dropdownOptions: OptionsDropdownItem[] = [
    {
      label: "Edit",
      onPress: () => showUpdateModal(sprint),
    },
    deleteOption(() => showDeleteModal(sprint)),
  ];

  return (
    <div className="flex flex-row items-center bg-gray-100 p-1 pl-2 first:rounded-t-lg last:rounded-b-lg hover:cursor-pointer hover:bg-gray-200">
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
