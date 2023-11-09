import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import { useFetcher } from "@remix-run/react";

export function EditStatusModal({
  projectId,
  statusId,
  statusName,
  isOpen,
  onOpenChange,
}: {
  projectId: string;
  statusId?: string;
  statusName?: string;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const fetcher = useFetcher();
  const [value, setValue] = useState(statusName ? statusName : "Status Name");
  const isInvalid = useMemo(
    () => value.trim() === "" || value.length <= 0,
    [value]
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <fetcher.Form
            method={statusId ? "put" : "post"}
            action={
              statusId
                ? `/api/project/${projectId}/projectTaskStatus/${statusId}`
                : `/api/project/${projectId}/projectTaskStatus`
            }
          >
            <ModalHeader className="flex flex-col gap-1">
              Create new status
            </ModalHeader>
            <ModalBody>
              <Input
                value={value}
                type="text"
                label="Name"
                placeholder="Enter status name"
                name="name"
                isRequired
                isInvalid={isInvalid}
                color={isInvalid ? "danger" : "default"}
                onValueChange={setValue}
                maxLength={30}
                errorMessage={isInvalid && "Please enter a valid name"}
                size="lg"
              />
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
                onClick={onClose}
                isDisabled={isInvalid}
                size="lg"
              >
                {statusId ? "Edit" : "Create"}
              </Button>
            </ModalFooter>
          </fetcher.Form>
        )}
      </ModalContent>
    </Modal>
  );
}

export default EditStatusModal;
