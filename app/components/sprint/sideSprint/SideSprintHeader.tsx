import { Link } from "@remix-run/react";
import { AiOutlineClose } from "react-icons/ai/index.js";

export function SideSprintHeader({ projectId }: { projectId: string }) {
  return (
    <div className="flex justify-between border-b-1 border-emerald-700 px-4 py-2">
      <div>Sprint</div>
      <div className="flex items-center justify-center">
        <Link to={`/project/${projectId}/sprints`}>
          <AiOutlineClose />
        </Link>
      </div>
    </div>
  );
}

export default SideSprintHeader;
