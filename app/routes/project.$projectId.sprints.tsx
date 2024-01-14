import React from "react";
import { defer, json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { createSprint, getSprints } from "~/api/methods/sprint";
import getToken from "~/actions/getToken";
import ProjectSprints from "~/components/sprint/ProjectSprints";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return null;
  }
  const projectId = params.projectId!;

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const res = await createSprint({
    name: data.Name.toString(),
    startDate: data.StartDate.toString(),
    endDate: data.EndDate.toString(),
    goal: data.Goal.toString().trim(),
    token,
    projectId,
  });

  if (!res || res.errors) {
    return json({ errors: res?.errors ?? [] });
  }

  return redirect("");
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (!token) {
    return redirect("/user/login");
  }

  const projectId = params.projectId!;
  const sprints = getSprints({ projectId, token });

  return defer({ projectId, sprints });
};

export default function SprintsPage() {
  const loaderData = useLoaderData<typeof loader>();
  // @ts-ignore
  const { projectId, sprints } = loaderData;

  return (
    <div className="flex h-full">
      <ProjectSprints projectId={projectId} sprints={sprints} />
      <Outlet />
    </div>
  );
}
