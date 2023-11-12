import { Button, Link } from "@nextui-org/react";
import { GiSprint } from "~/components/projectNavigation/icons";
import React from "react";

export const CreateSprintTip = ({ projectId }: { projectId: string }) => (
  <div className="flex flex-row gap-3">
    <span className="flex items-center text-lg text-gray-700">
      No existing active sprints? Add new or start one now!
    </span>
    <Button
      href={`/project/${projectId}/sprints`}
      as={Link}
      size="lg"
      anchorIcon={<GiSprint />}
      showAnchorIcon={true}
    >
      New sprint
    </Button>
  </div>
);

export default CreateSprintTip;
