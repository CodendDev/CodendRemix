import { Link } from "@remix-run/react";
import { IoIosCloseCircle } from "react-icons/io/index.js";
import React from "react";

export function SideSprintHeader({ projectId }: { projectId: string }) {
  return (
    <div className="flex justify-between border-b-1 border-emerald-700 px-4 py-2">
      <div className="text-2xl text-emerald-800">Sprint</div>
      <div className="flex items-center justify-center">
        <Link
          to={`/project/${projectId}/sprints`}
          className="text-3xl text-danger-500"
        >
          <IoIosCloseCircle />
        </Link>
      </div>
    </div>
  );
}

export default SideSprintHeader;
