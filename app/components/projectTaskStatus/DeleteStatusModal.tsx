import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";
import { useFetcher } from "@remix-run/react";

export function DeleteStatusModal({
  projectId,
  statusId,
  statusName,
  isOpen,
  onOpenChange,
}: {
  projectId: string;
  statusId: string;
  statusName: string;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const fetcher = useFetcher();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <fetcher.Form
            method="delete"
            action={`/api/project/${projectId}/projectTaskStatus/${statusId}`}
          >
            <ModalHeader className="flex flex-col gap-1">
              Delete status
            </ModalHeader>
            <ModalBody>
              <span className="flex h-full w-full text-center text-lg">
                Are you sure you want to delete
                <span className="ml-1 font-bold text-danger-500">
                  {statusName}
                </span>
                ?
              </span>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                size="lg"
              >
                Cancel
              </Button>
              <Button
                id="form-create-status"
                color="primary"
                type="submit"
                onPress={onClose}
                size="lg"
              >
                Delete
              </Button>
            </ModalFooter>
          </fetcher.Form>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DeleteStatusModal;
