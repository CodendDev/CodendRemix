import React, { Suspense, useEffect, useState } from "react";
import type { Sprint } from "~/api/types/baseEntitiesTypes";
import { Await, useLocation, useNavigate } from "@remix-run/react";
import type { Selection } from "@nextui-org/react";
import { Button, Link, Select, SelectItem, Skeleton } from "@nextui-org/react";
import { ProjectBoardLoading } from "~/components/board/ProjectBoard";
import { GiSprint } from "~/components/projectNavigation/icons";

type ProjectBoardSprintSelectorProps = {
  sprintsPromise: Promise<Sprint[]>;
  route: string;
};

export function ProjectBoardSprintSelector({
  sprintsPromise,
  route,
}: ProjectBoardSprintSelectorProps) {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<ProjectBoardSprintSelectorLoading />}>
        <Await resolve={sprintsPromise}>
          {(sprints) => (
            <AwaitedProjectBoardSprintSelector
              sprints={sprints}
              route={route}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export default ProjectBoardSprintSelector;

export function ProjectBoardSprintSelectorLoading() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex p-4">
        <Skeleton className="ml-5 h-14 w-96 rounded-lg" />
      </div>
      <div className="flex">
        <ProjectBoardLoading />
      </div>
    </div>
  );
}
function AwaitedProjectBoardSprintSelector({
  sprints,
  route,
}: {
  sprints: Sprint[];
  route: string;
}) {
  const [selectedValues, setSelectedValues] = useState<Selection>(
    sprints.length > 0 ? new Set([sprints[0].id]) : new Set([])
  );
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname
    .toLowerCase()
    .replace("/project/", "")
    .slice(0, 36);
  const getSelectedSprint = () => {
    const arr = Array.from(selectedValues);
    return arr.length > 0 ? arr[0].toString() : null;
  };

  useEffect(() => {
    const selectedSprint = getSelectedSprint();
    if (
      selectedSprint &&
      !location.pathname.toLowerCase().includes(selectedSprint)
    ) {
      navigate(`/project/${projectId}/${route}/${selectedSprint}`);
    }
  }, [selectedValues, location]);

  const handleSelectionChange = (keys: Selection) => {
    setSelectedValues(keys);
    const keysArray = Array.from(keys);
    keysArray.length > 0
      ? navigate(`/project/${projectId}/${route}/${keysArray[0]}`)
      : navigate(`/project/${projectId}/${route}`);
  };

  const noSprintSelected =
    selectedValues[Symbol.iterator]().next().done === true;

  // @ts-ignore
  // noinspection RequiredAttributes
  return (
    <>
      <div className="ml-5 flex flex-row items-center justify-start gap-10 p-4">
        <Select
          items={sprints}
          size="lg"
          label="Selected sprint"
          placeholder="No active sprints."
          className="w-96"
          selectedKeys={selectedValues}
          onSelectionChange={handleSelectionChange}
        >
          {(sprint) => (
            <SelectItem key={sprint.id} value={sprint.id}>
              {sprint.name}
            </SelectItem>
          )}
        </Select>
        {noSprintSelected && (
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
        )}
      </div>
      {noSprintSelected && (
        <div>
          <ProjectBoardLoading isLoaded={true} />
        </div>
      )}
    </>
  );
}
