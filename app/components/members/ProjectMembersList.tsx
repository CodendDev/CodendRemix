import React from "react";

import { UserDetails, UserRole } from "~/api/types/baseEntitiesTypes";
import { Button, useDisclosure, User } from "@nextui-org/react";
import { IoMdRemoveCircleOutline } from "react-icons/io/index.js";
import DeleteModal from "~/components/shared/modals/DeleteModal";

interface ProjectMembersListProps {
  members: UserDetails[];
  ownerId: string;
}
export function ProjectMembersList({
  members,
  ownerId,
}: ProjectMembersListProps) {
  return (
    <div className="flex flex-col">
      <ProjectMemberListItem
        role="Owner"
        {...members.find((m) => m.id === ownerId)!}
      />
      {members
        .filter((m) => m.id !== ownerId)
        .map((m) => (
          <ProjectMemberListItem role="Member" {...m} />
        ))}
    </div>
  );
}

interface ProjectMemberListItemProps extends UserDetails {
  role: UserRole;
}
const ProjectMemberListItem = ({
  imageUrl,
  firstName,
  lastName,
  id,
  role,
}: ProjectMemberListItemProps) => {
  const name = `${firstName} ${lastName}`;
  const deleteStatusModal = useDisclosure();

  return (
    <div className="flex flex-row justify-between gap-5 p-2 odd:bg-white even:bg-slate-100">
      <User
        name={name}
        description={role}
        avatarProps={{ src: imageUrl }}
        classNames={
          role === "Owner"
            ? {
                description: "text-red-600",
              }
            : {}
        }
      />
      {role !== "Owner" && (
        <>
          <Button
            radius="full"
            color="danger"
            startContent={<IoMdRemoveCircleOutline />}
            onClick={() => deleteStatusModal.onOpen()}
          >
            Remove
          </Button>
          <DeleteModal
            actionRoute=""
            deleteName={name}
            deleteHeader="Remove member"
            isOpen={deleteStatusModal.isOpen}
            onOpenChange={deleteStatusModal.onOpenChange}
            children={[<input type="hidden" name="id" value={id} />]}
          />
        </>
      )}
    </div>
  );
};

export default ProjectMembersList;
