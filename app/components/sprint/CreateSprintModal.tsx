import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

export function CreateSprintModal({
  projectId,
  isOpen,
  onOpen,
  onOpenChange,
}: {
  projectId: string;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form method="post">
            <ModalHeader className="flex flex-col gap-1">
              Create sprint
            </ModalHeader>
            <ModalBody>
              <Input type="text" label="Name" name="Name" isRequired />
              <Input
                type="date"
                labelPlacement="outside-left"
                label="Start date"
                name="StartDate"
                isRequired
              />
              <Input
                type="date"
                labelPlacement="outside-left"
                label="End date"
                name="EndDate"
                isRequired
              />
              <Input type="text" label="Goal" name="Goal" />
              <input name="ProjectId" hidden value={projectId} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit">
                Create
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
