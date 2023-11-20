import React, { Suspense, useEffect, useState } from "react";
import type { Sprint } from "~/api/types/baseEntitiesTypes";
import { Await, useNavigate, useParams } from "@remix-run/react";
import type { Selection } from "@nextui-org/react";
import { Select, SelectItem, Skeleton } from "@nextui-org/react";
import { ProjectBoardLoading } from "~/components/board/ProjectBoard";
type ProjectBoardSprintSelectorProps = {
  sprintsPromise: Promise<Sprint[]>;
  noSprintsComponent: React.ReactElement;
  route: string;
};
export function ProjectBoardSprintSelector(
  props: ProjectBoardSprintSelectorProps
) {
  const { sprintsPromise } = props;
  return (
    <div className="flex flex-col">
      <Suspense fallback={<ProjectBoardSprintSelectorLoading />}>
        <Await resolve={sprintsPromise}>
          {(sprints) => (
            <AwaitedProjectBoardSprintSelector {...props} sprints={sprints} />
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

interface AwaitedProjectBoardSprintSelectorProps
  extends ProjectBoardSprintSelectorProps {
  sprints: Sprint[];
}
function AwaitedProjectBoardSprintSelector({
  sprints,
  noSprintsComponent,
  route,
}: AwaitedProjectBoardSprintSelectorProps) {
  const [selectedValues, setSelectedValues] = useState<Selection>(
    sprints.length > 0 ? new Set([sprints[0].id]) : new Set([])
  );
  const navigate = useNavigate();
  const routeSprintId = useParams().sprintId;
  const getSelectedSprint = () => {
    const arr = Array.from(selectedValues);
    return arr.length > 0 ? arr[0].toString() : null;
  };

  useEffect(() => {
    if (!routeSprintId) {
      const selectedSprint = getSelectedSprint();
      if (selectedSprint) {
        navigate(`${route}/${selectedSprint}`);
      }
    }
  }, [selectedValues, routeSprintId]);

  const handleSelectionChange = (keys: Selection) => {
    setSelectedValues(keys);
    const keysArray = Array.from(keys);
    keysArray.length > 0
      ? navigate(`${route}/${keysArray[0]}`)
      : navigate(`${route}`);
  };

  const noSprintSelected =
    selectedValues[Symbol.iterator]().next().done === true;

  // @ts-ignore
  // noinspection RequiredAttributes
  return (
    <>
      <div className="ml-3 flex flex-row items-center justify-start gap-10 p-2">
        <Select
          items={sprints}
          size="sm"
          variant="flat"
          label="Selected sprint:"
          labelPlacement="outside-left"
          placeholder="No active sprints."
          className="w-96"
          classNames={{
            label: "w-40 self-center text-sm text-ellipsis whitespace-nowrap",
          }}
          selectedKeys={selectedValues}
          disabledKeys={new Set(["archived"])}
          onSelectionChange={handleSelectionChange}
        >
          {(sprint) => (
            <SelectItem key={sprint.id} value={sprint.id}>
              {sprint.name}
            </SelectItem>
          )}
        </Select>
        {noSprintSelected && noSprintsComponent}
      </div>
      {noSprintSelected && (
        <div>
          <ProjectBoardLoading isLoaded={true} />
        </div>
      )}
    </>
  );
}
