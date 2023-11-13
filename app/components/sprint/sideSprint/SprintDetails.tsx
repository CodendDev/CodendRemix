import type { Sprint } from "~/api/types/baseEntitiesTypes";

export function SprintDetails({ sprint }: { sprint: Sprint }) {
  const { name, startDate, endDate, goal } = sprint;
  return (
    <div className="border-b-1 border-emerald-700 px-4">
      <SprintDetail label="Name" value={name} />
      <SprintDetail label="Start date" value={startDate} />
      <SprintDetail label="End date" value={endDate} />
      {goal && <SprintDetail label="Goal" value={goal} />}
    </div>
  );
}

function SprintDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <div>{label}&nbsp;</div>
      <div>{value}</div>
    </div>
  );
}
