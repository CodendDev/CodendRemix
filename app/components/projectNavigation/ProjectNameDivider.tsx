import { Divider, Skeleton } from "@nextui-org/react";
import React from "react";

export function ProjectNameDivider({ name }: { name: string }) {
  return (
    <div className="p-2">
      <Divider orientation="horizontal" />
      <div className="w-full text-center">{name}</div>
      <Divider orientation="horizontal" />
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
