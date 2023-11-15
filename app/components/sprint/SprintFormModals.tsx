import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import type { Sprint } from "~/api/types/baseEntitiesTypes";
import { useFetcher } from "@remix-run/react";

interface UpdateSprintModalProps {
  projectId: string;
  isOpen: boolean;
  onOpenChange: () => void;
  sprint: Sprint;
}
export const UpdateSprintModal = (props: UpdateSprintModalProps) => (
  <CreateSprintModal {...props} />
);

interface CreateSprintModalProps {
  projectId: string;
  isOpen: boolean;
  onOpenChange: () => void;
  sprint?: Sprint;
}
export function CreateSprintModal({
  projectId,
  isOpen,
  onOpenChange,
  sprint,
}: CreateSprintModalProps) {
  const [name, setName] = useState<string>(sprint?.name ?? "");
  const [dateError, setDateError] = useState<boolean>(false);
  const [start, setStart] = useState<string>(
    sprint?.startDate.slice(0, 10) ?? ""
  );
  const [end, setEnd] = useState<string>(sprint?.endDate.slice(0, 10) ?? "");
  const fetcher = useFetcher();

  useEffect(() => {
    const date_start = Date.parse(start);
    const date_end = Date.parse(end);
    setDateError(date_end <= date_start);
  }, [start, end]);

  const onClose = () => {
    setDateError(false);
    onOpenChange();
  };

  const onSubmit = (onClose: () => void) => {
    // validate
    if (dateError || name.trim().length == 0) {
      return;
    }

    // close if valid
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <fetcher.Form
            method={sprint ? "PUT" : "DELETE"}
            action={
              sprint
                ? `/project/${projectId}/sprints/${sprint.id}`
                : `/project/${projectId}/sprints`
            }
          >
            <ModalHeader className="flex flex-col gap-1">
              {sprint ? "Edit" : "Create"} sprint
            </ModalHeader>
            <ModalBody>
              <Input
                type="text"
                label="Name"
                name="Name"
                isRequired
                defaultValue={sprint?.name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex flex-row flex-nowrap">
                <label className="shrink-0 p-2" htmlFor="StartDate">
                  Start date
                </label>
                <Input
                  id="StartDate"
                  type="date"
                  name="StartDate"
                  color={dateError ? "danger" : "default"}
                  isRequired
                  onChange={(e) => setStart(e.target.value)}
                  defaultValue={sprint?.startDate.slice(0, 10)}
                />
              </div>
              <div className="flex">
                <label className="shrink-0 p-2" htmlFor="EndDate">
                  End date &nbsp;
                </label>
                <Input
                  id="EndDate"
                  type="date"
                  name="EndDate"
                  color={dateError ? "danger" : "default"}
                  errorMessage={
                    dateError &&
                    "Sprint end date has to be later than start date!"
                  }
                  isRequired
                  onChange={(e) => setEnd(e.target.value)}
                  defaultValue={sprint?.endDate.slice(0, 10)}
                />
              </div>
              <Input
                type="text"
                label="Goal"
                name="Goal"
                defaultValue={sprint?.goal}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                size="lg"
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                size="lg"
                color="primary"
                type="submit"
                onPress={() => {
                  onSubmit(onClose);
                }}
              >
                {sprint ? "Edit" : "Create"}
              </Button>
            </ModalFooter>
          </fetcher.Form>
        )}
      </ModalContent>
    </Modal>
  );
}
