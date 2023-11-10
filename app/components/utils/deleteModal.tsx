import { useFetcher } from "@remix-run/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

interface DeleteModalProps {
  url?: string;
  label: string;
  isOpen: boolean;
  onOpenChange: () => void;
}
export function DeleteModal({
  url,
  label,
  isOpen,
  onOpenChange,
}: DeleteModalProps) {
  const fetcher = useFetcher();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <fetcher.Form method="delete" action={url ?? ""}>
            <ModalHeader className="flex flex-col gap-1">Delete</ModalHeader>
            <ModalBody>
              <span className="flex h-full w-full text-center text-lg">
                Are you sure you want to delete
                <span className="ml-1 font-bold text-danger-500">{label}</span>?
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
