import React from "react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Button, useDisclosure } from "@nextui-org/react";
import { createSprint, getSprints } from "~/api/methods/sprint";
import getToken from "~/actions/getToken";
import { CreateSprintModal } from "~/components/sprint/CreateSprintModal";

export const action = async ({ request }: ActionFunctionArgs) => {
  const token = await getToken(request);
  if (token === undefined) {
    return null;
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const res = await createSprint({
    name: data.Name.toString(),
    startDate: data.StartDate.toString(),
    endDate: data.EndDate.toString(),
    goal: data.Goal.toString().trim(),
    projectId: data.ProjectId.toString(),
    token: token,
  });

  if (res === undefined || res.errors !== undefined) {
    return json({ errors: res?.errors ?? [] });
  }

  return redirect("");
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  if (token === undefined) {
    redirect("/user/login");
  }

  const projectId = params.projectId!;

  const sprints = await getSprints({
    projectId: projectId,
    token: token!,
  });

  return json({ projectId: projectId, sprints });
};

export default function SprintsPage() {
  const loaderData = useLoaderData<typeof loader>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Create
      </Button>
      <CreateSprintModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        projectId={loaderData.projectId}
      />
      <Outlet />
    </>
  );
}
