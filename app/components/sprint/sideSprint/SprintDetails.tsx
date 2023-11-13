import type { Sprint } from "~/api/types/baseEntitiesTypes";

export function SprintDetails({ sprint }: { sprint: Sprint }) {
  const { name, startDate, endDate, goal } = sprint;
  return (
    <div className="border-b-1 border-emerald-700 px-4">
      <div className="flex items-end">
        <div className="text-xl">{name}</div>
      </div>
      <div>
        <span className="font-bold">Date&nbsp;</span>
        {startDate.slice(0, 10)} - {endDate.slice(0, 10)}
      </div>
      {goal && <SprintGoal value={goal} />}
    </div>
  );
}

function SprintGoal({ value }: { value: string }) {
  return (
    <div className="flex">
      <span className="font-bold">Goal&nbsp;</span>
      <div>{value}</div>
    </div>
  );
}
