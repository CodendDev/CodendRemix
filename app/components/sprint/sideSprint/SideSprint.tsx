import type {
  Sprint,
  SprintAssignableTask,
} from "~/api/types/baseEntitiesTypes";
import { Suspense } from "react";
import { Await } from "@remix-run/react";
import { SprintDetails } from "~/components/sprint/sideSprint/SprintDetails";
import SprintBacklog from "~/components/sprint/sideSprint/SprintBacklog";
import SideSprintHeader from "~/components/sprint/sideSprint/SideSprintHeader";

interface SideSprintProps {
  sprintPromise: Promise<Sprint>;
  assignableTasksPromise: Promise<SprintAssignableTask[]>;
  projectId: string;
}
export default function SideSprint(props: SideSprintProps) {
  return (
    <>
      <SideSprintHeader {...props} />
      <Suspense>
        <Await resolve={props.sprintPromise}>
          {(sprint) => <AwaitedSideSprint sprint={sprint} {...props} />}
        </Await>
      </Suspense>
    </>
  );
}

const AwaitedSideSprint = (props: SideSprintProps & { sprint: Sprint }) => (
  <div className="p-4">
    <SprintDetails {...props} />
    <SprintBacklog {...props} />
  </div>
);
