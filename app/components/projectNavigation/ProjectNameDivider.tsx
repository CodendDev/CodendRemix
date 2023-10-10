import { Divider } from "@nextui-org/react";
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

export default ProjectNameDivider;
