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

export function CreateSprintModal({
  projectId,
  isOpen,
  onOpenChange,
}: {
  projectId: string;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [dateError, setDateError] = useState<boolean>(false);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  useEffect(() => {
    const date_start = Date.parse(start);
    const date_end = Date.parse(end);
    setDateError(date_end <= date_start);
  }, [start, end]);

  const onClose = () => {
    setDateError(false);
    onOpenChange();
  };

  const onSubmit = (e: React.FormEvent) => {
    if (dateError) {
      e.preventDefault();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <form method="post">
            <ModalHeader className="flex flex-col gap-1">
              Create sprint
            </ModalHeader>
            <ModalBody>
              <Input type="text" label="Name" name="Name" isRequired />
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
                />
              </div>
              <Input type="text" label="Goal" name="Goal" />
              <input name="ProjectId" hidden value={projectId} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit" onClick={onSubmit}>
                Create
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
