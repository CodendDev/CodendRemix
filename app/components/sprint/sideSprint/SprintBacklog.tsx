import type {
  BacklogType,
  BacklogTaskType,
} from "~/api/types/baseEntitiesTypes";
import { Suspense } from "react";
import { Await } from "@remix-run/react";

interface SprintBacklogProps {
  backlogPromise: Promise<BacklogType>;
}
export default function SprintBacklog(props: SprintBacklogProps) {
  return (
    <Suspense>
      <Await resolve={props.backlogPromise}>
        {(backlog) => <AwaitedBacklog backlog={backlog} {...props} />}
      </Await>
    </Suspense>
  );
}

const AwaitedBacklog = ({
  backlog,
}: SprintBacklogProps & { backlog: BacklogType }) => (
  <div className="px-4">
    {backlog.tasks.map((task, i) => (
      <BacklogTask key={i} {...task} />
    ))}
  </div>
);

const BacklogTask = (task: BacklogTaskType) => {
  return <>{JSON.stringify(task)}</>;
};
