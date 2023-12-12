import type { Sprint } from "~/api/types/baseEntitiesTypes";
import { Card } from "@nextui-org/card";

export function SprintDetails({ sprint }: { sprint: Sprint }) {
  const { name, startDate, endDate, goal } = sprint;
  return (
    <Card className="flex flex-col px-4 py-2 text-lg">
      <div className="text-xl text-emerald-800">
        {name}
        <span className="ml-2 text-gray-600">
          ({startDate.slice(0, 10)} - {endDate.slice(0, 10)})
        </span>
      </div>
      <span>{goal}</span>
    </Card>
  );
}
