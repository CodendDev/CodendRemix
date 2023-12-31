import React from "react";

import { Skeleton } from "@nextui-org/react";

import type { Sprint as APISprintProps } from "~/api/types/baseEntitiesTypes";
import type { OptionsDropdownItem } from "~/components/utils/dropdown/OptionsDropdown";
import { OptionsDropdown } from "~/components/utils/dropdown/OptionsDropdown";
import { deleteOption } from "~/components/utils/dropdown/DropdownDefaultOptions";
import { useNavigate } from "@remix-run/react";
import type { SprintStatus } from "~/api/types/sprintTypes";
import { sprintStatusToColorClass } from "~/components/utils/TypeToColor";
import ClickableDiv from "~/components/utils/ClickableDiv";

interface SprintProps extends Omit<APISprintProps, "sprintTasks"> {
  projectId: string;
  showUpdateModal: (sprint: Omit<APISprintProps, "sprintTasks">) => void;
  showDeleteModal: (sprint: Omit<APISprintProps, "sprintTasks">) => void;
}
export function Sprint(sprint: SprintProps) {
  const navigation = useNavigate();
  const { name, showDeleteModal, showUpdateModal } = sprint;

  const dropdownOptionsArchived: OptionsDropdownItem[] = [
    {
      label: "Edit",
      onPress: () => showUpdateModal(sprint),
    },
    deleteOption(() => showDeleteModal(sprint)),
  ];
  const dropdownOptionsActive: OptionsDropdownItem[] = [
    {
      label: "Go to board",
      onPress: () =>
        navigation(`/project/${sprint.projectId}/board/${sprint.id}`),
    },
    ...dropdownOptionsArchived,
  ];

  const sprintStatus = ((): SprintStatus => {
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
  })();

  return (
    <ClickableDiv
      onClick={() => {
        sprintStatus !== "Archived" &&
          navigation(`/project/${sprint.projectId}/sprints/${sprint.id}`);
      }}
      className={`flex min-w-[20rem] flex-row items-center bg-gray-100 p-1 pl-2 first:rounded-t-lg last:rounded-b-lg
      ${
        sprintStatus !== "Archived"
          ? "hover:cursor-pointer hover:bg-gray-200"
          : "text-gray-400"
      }`}
    >
      <div
        className={`mx-2 font-bold ${sprintStatusToColorClass[sprintStatus]}`}
      >
        {sprintStatus}
      </div>
      <div className="flex w-unit-xl grow flex-row">
        <div className="truncate">{name}</div>
      </div>
      {sprintStatus === "Active" ? (
        <OptionsDropdown options={dropdownOptionsActive} />
      ) : (
        <OptionsDropdown options={dropdownOptionsArchived} />
      )}
    </ClickableDiv>
  );
}

export const SprintLoading = () => (
  <Skeleton className="h-10 p-1 first:rounded-t-lg last:rounded-b-lg" />
);

export default Sprint;
