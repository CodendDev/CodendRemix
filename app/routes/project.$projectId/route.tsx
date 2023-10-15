import { Outlet } from "@remix-run/react";

export default function Projects() {
  return (
    <>
      <div className="min-h-unit-10">To jest projekt</div>
      <div>
        <Outlet />
      </div>
    </>
  );
}
