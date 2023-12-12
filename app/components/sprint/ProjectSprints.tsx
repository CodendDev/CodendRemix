import React from "react";

import { Button, useDisclosure } from "@nextui-org/react";
import { GiSprint } from "~/components/projectNavigation/icons";
import { CreateSprintModal } from "~/components/sprint/SprintFormModals";
import SprintList from "~/components/sprint/SprintList";
import type { SprintsResponse } from "~/api/types/sprintTypes";

interface ProjectSprintsProps {
  projectId: string;
  sprints: Promise<SprintsResponse | undefined>;
}
export function ProjectSprints({ projectId, sprints }: ProjectSprintsProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="grow flex-col overflow-x-auto overflow-y-auto">
      <div className="min-w-[30em]">
        <div className="px-10 py-2">
          <div className="flex w-full flex-row gap-3">
            <span className="flex items-center text-lg text-gray-700">
              Create a new one now!
            </span>
            <Button
              color="primary"
              onPress={onOpen}
              endContent={<GiSprint />}
              size="lg"
            >
              New sprint
            </Button>
          </div>

          <CreateSprintModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            projectId={projectId}
          />
        </div>
        <div>
          <SprintList projectId={projectId} sprintsPromise={sprints} />
        </div>
      </div>
    </div>
  );
}

export default ProjectSprints;
