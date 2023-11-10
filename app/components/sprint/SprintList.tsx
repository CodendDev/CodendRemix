import type { SprintsResponse } from "~/api/types/sprintTypes";
import React, { Suspense } from "react";
import { Await } from "@remix-run/react";
import CustomError from "~/components/errors/CustomError";
import Sprint, { SprintLoading } from "~/components/sprint/Sprint";

interface SprintListProps {
  projectId: string;
  sprintsPromise: Promise<SprintsResponse | undefined>;
}
export function SprintList({ projectId, sprintsPromise }: SprintListProps) {
  return (
    <Suspense fallback={<SprintListLoading />}>
      <Await resolve={sprintsPromise} errorElement={<CustomError />}>
        {(sprints) =>
          sprints ? (
            <AwaitedSprintList projectId={projectId} {...sprints} />
          ) : (
            <CustomError />
          )
        }
      </Await>
    </Suspense>
  );
}

export function SprintListLoading() {
  return (
    <div className="w-full px-6 py-1">
      <div className="px-6 py-2 font-bold text-gray-700">
        Sprints
        <span className="ml-1 font-normal text-gray-400"></span>
      </div>
      <div className="outl flex flex-col justify-between gap-1 rounded-lg outline-dashed outline-1 outline-offset-4 outline-gray-400">
        {[...Array(4)].map((_, i) => (
          <SprintLoading key={i} />
        ))}
      </div>
    </div>
  );
}

export function AwaitedSprintList({
  projectId,
  sprints,
}: SprintsResponse & {
  projectId: string;
}) {
  return (
    <div className="w-full px-6 py-1">
      <div className="px-6 py-2 font-bold text-gray-700">
        Sprints
        <span className="ml-1 font-normal text-gray-400">
          ({sprints.length} sprints)
        </span>
      </div>
      <div className="outl flex flex-col justify-between gap-1 rounded-lg outline-dashed outline-1 outline-offset-4 outline-gray-400">
        {sprints.map((sprint) => (
          <Sprint key={sprint.id} {...sprint} projectId={projectId} />
        ))}
      </div>
    </div>
  );
}

export default SprintList;
