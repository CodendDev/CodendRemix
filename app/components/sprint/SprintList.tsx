import type { SprintsResponse } from "~/api/types/sprintTypes";
import React, { Suspense } from "react";
import { Await } from "@remix-run/react";
import type { Sprint } from "~/api/types/baseEntitiesTypes";

interface SprintListProps {
  sprintsPromise: Promise<SprintsResponse | undefined>;
}
export function SprintList({ sprintsPromise }: SprintListProps) {
  return (
    <Suspense fallback={<SprintListLoading />}>
      <Await resolve={sprintsPromise} errorElement={<SprintListError />}>
        {(sprints) =>
          sprints ? <AwaitedSprintList {...sprints} /> : <SprintListError />
        }
      </Await>
    </Suspense>
  );
}

export function SprintListLoading() {
  return <>Loading</>;
}

export function SprintListError() {
  return <>Error</>;
}

export function AwaitedSprintList(sprints: SprintsResponse) {
  return (
    <div className="w-full px-6 py-1">
      <div className="px-6 py-2 font-bold text-gray-700">
        Sprints
        <span className="ml-1 font-normal text-gray-400">
          ({sprints.sprints.length} sprints)
        </span>
      </div>
      <div className="outl flex flex-col justify-between gap-1 rounded-lg outline-dashed outline-1 outline-offset-4 outline-gray-400">
        {sprints.sprints.map((sprint) => (
          <SprintElement key={sprint.id} {...sprint} />
        ))}
      </div>
    </div>
  );
}

function SprintElement({ name }: Sprint) {
  return (
    <div className="flex flex-row items-center bg-gray-100 p-1 first:rounded-t-lg last:rounded-b-lg hover:cursor-pointer hover:bg-gray-200">
      <div className="flex w-unit-xl min-w-[15rem] grow flex-row">
        <div className="truncate">{name}</div>
      </div>
    </div>
  );
}

export default SprintList;
