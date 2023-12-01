import React, { useState } from "react";

import { UserDetails, UserRole } from "~/api/types/baseEntitiesTypes";
import { Button, Input, useDisclosure, User } from "@nextui-org/react";
import { IoMdRemoveCircleOutline } from "react-icons/io/index.js";
import DeleteModal from "~/components/shared/modals/DeleteModal";
import { useFetcher } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io/index.js";

interface ProjectMembersListProps {
  members: UserDetails[];
  ownerId: string;
}
export function ProjectMembersList({
  members,
  ownerId,
}: ProjectMembersListProps) {
  const fetcher = useFetcher();
  const [email, setEmail] = useState<string>("");
  const owner = members.find((m) => m.id === ownerId)!;
  const membersToDisplay = members
    .filter((m) => m.id !== ownerId)
    .filter((m) => m.email.includes(email));
  const disable =
    membersToDisplay.length + (owner.email.includes(email) ? 1 : 0) > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (disable) {
      e.preventDefault();
    }
  };
  return (
    <div className="flex flex-col">
      <fetcher.Form
        className="flex items-center gap-2 p-2"
        method="POST"
        onSubmit={handleSubmit}
      >
        <Input
          name="email"
          type="email"
          label="Email"
          className=""
          size="sm"
          required
          isClearable
          onChange={(e) => setEmail(e.target.value)}
          onClear={() => setEmail("")}
        />
        <Button
          isLoading={fetcher.state !== "idle"}
          isIconOnly
          color="primary"
          className="p-2"
          type="submit"
          radius="full"
          size="lg"
          isDisabled={disable}
        >
          <IoMdAdd />
        </Button>
      </fetcher.Form>
      {owner.email.includes(email) && (
        <ProjectMemberListItem role="Owner" {...owner} />
      )}
      {membersToDisplay.map((m) => (
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
  email,
  role,
}: ProjectMemberListItemProps) => {
  const name = `${firstName} ${lastName}`;
  const deleteStatusModal = useDisclosure();

  return (
    <div className="flex flex-row justify-between gap-5 p-2 odd:bg-white even:bg-slate-100">
      <User
        name={
          <div>
            {name}
            <span className="text-xs italic"> ({email})</span>
          </div>
        }
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
