import type { SprintsResponse } from "~/api/types/sprintTypes";
import { Suspense } from "react";
import { Await } from "@remix-run/react";

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
  return <>{JSON.stringify(sprints.sprints)}</>;
}

export default SprintList;
