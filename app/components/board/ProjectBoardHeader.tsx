import React, { Suspense, useEffect, useState } from "react";

import type { Sprint } from "~/api/types/baseEntitiesTypes";

import { Await, useNavigate, useParams } from "@remix-run/react";

import type { Selection } from "@nextui-org/react";
import { Select, SelectItem, Skeleton } from "@nextui-org/react";
import ProjectBoardFilter from "~/components/board/ProjectBoardFilter";

type ProjectBoardHeaderProps = {
  sprintsPromise: Promise<Sprint[]>;
  route: string;
  filterable?: boolean;
};
export function ProjectBoardHeader(props: ProjectBoardHeaderProps) {
  const { sprintsPromise } = props;
  return (
    <Suspense fallback={<ProjectBoardHeaderLoading />}>
      <Await resolve={sprintsPromise}>
        {(sprints) => (
          <AwaitedProjectBoardHeader {...props} sprints={sprints} />
        )}
      </Await>
    </Suspense>
  );
}

export default ProjectBoardHeader;

export function ProjectBoardHeaderLoading() {
  return (
    <div className="mx-3 flex items-center p-2">
      <Skeleton className="w-full rounded-lg">
        <ProjectBoardFilter />
      </Skeleton>
    </div>
  );
}

interface AwaitedProjectBoardHeaderProps extends ProjectBoardHeaderProps {
  sprints: Sprint[];
}
function AwaitedProjectBoardHeader({
  sprints,
  route,
  filterable = false,
}: AwaitedProjectBoardHeaderProps) {
  const params = useParams();
  const [selectedValues, setSelectedValues] = useState<Selection>(
    sprints.length > 0 ? new Set([sprints[0].id]) : new Set([])
  );
  const [currProjectId, setCurrProjectId] = useState(params.projectId);

  const navigate = useNavigate();
  const routeProjectId = params.projectId;
  const routeSprintId = params.sprintId;
  const selectedSprintId = (() => {
    const arr = Array.from(selectedValues);
    return arr.length > 0 ? arr[0].toString() : null;
  })();

  const getSprintDatesString = (sprint: Sprint) => {
    if (!sprint || !sprint.startDate || !sprint.endDate) {
      return "";
    }
    return `${new Date(sprint.startDate).toLocaleDateString()} ${new Date(
      sprint.endDate
    ).toLocaleDateString()}`;
  };

  useEffect(() => {
    if (currProjectId !== routeProjectId) {
      setCurrProjectId(routeProjectId);
      const newSelectedValues =
        sprints.length > 0 ? new Set([sprints[0].id]) : new Set([]);
      setSelectedValues(newSelectedValues);
      if (sprints.length > 0) {
        navigate(`${route}/${sprints[0].id}`);
      }
      return;
    }
    if (!routeSprintId) {
      if (selectedSprintId) {
        navigate(`${route}/${selectedSprintId}`);
      }
    }
  }, [selectedValues, routeSprintId, routeProjectId]);

  const handleSelectionChange = (keys: Selection) => {
    setSelectedValues(keys);
    const keysArray = Array.from(keys);
    keysArray.length > 0
      ? navigate(`${route}/${keysArray[0]}`)
      : navigate(`${route}`);
  };

  // @ts-ignore
  // noinspection RequiredAttributes
  return (
    <div className="flex w-full min-w-[40rem] items-center justify-between border-b-1 border-emerald-700 p-2">
      <div className="w-2/5">
        <Select
          items={sprints}
          variant="flat"
          label="Selected sprint:"
          labelPlacement="outside-left"
          placeholder="No active sprints."
          classNames={{
            label: "self-center whitespace-nowrap",
          }}
          selectedKeys={selectedValues}
          endContent={
            selectedSprintId && (
              <span className="text-sm text-gray-500">
                {getSprintDatesString(
                  sprints.find((s) => s.id === selectedSprintId)!
                )}
              </span>
            )
          }
          disabledKeys={new Set(["archived"])}
          onSelectionChange={handleSelectionChange}
        >
          {(sprint) => (
            <SelectItem key={sprint.id} value={sprint.id}>
              {sprint.name}
            </SelectItem>
          )}
        </Select>
      </div>
      {filterable && (
        <div className="mx-5 flex w-3/5">
          <ProjectBoardFilter />
        </div>
      )}
    </div>
  );
}
