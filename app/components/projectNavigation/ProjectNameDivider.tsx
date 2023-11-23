import { Divider, Skeleton } from "@nextui-org/react";
import React from "react";

export function ProjectNameDivider({ name }: { name: string | undefined }) {
  return (
    <div
      className={`my-2 w-full border-y-1 border-emerald-700 py-2 text-center text-xl ${
        name ? "text-primary-900" : "text-gray-500"
      }`}
    >
      {name ?? "Project not selected"}
    </div>
  );
}

export function LoadingProjectNameDivider() {
  return (
    <Skeleton className="m-2 w-3/4 rounded-lg">
      <div className="h-5"></div>
    </Skeleton>
  );
}

export default ProjectNameDivider;
