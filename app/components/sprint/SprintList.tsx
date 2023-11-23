import type { SprintsResponse } from "~/api/types/sprintTypes";
import React, { Suspense, useState } from "react";
import { Await } from "@remix-run/react";
import CustomError from "~/components/errors/CustomError";
import Sprint, { SprintLoading } from "~/components/sprint/Sprint";
import { DeleteModal } from "~/components/shared/modals/DeleteModal";
import { UpdateSprintModal } from "~/components/sprint/SprintFormModals";
import { useDisclosure } from "@nextui-org/react";
import type { Sprint as APISprintProps } from "~/api/types/baseEntitiesTypes";

interface SprintListProps {
  projectId: string;
  sprintsPromise: Promise<SprintsResponse | undefined>;
}
export function SprintList({ projectId, sprintsPromise }: SprintListProps) {
  return (
    <Suspense fallback={<SprintListLoading />}>
      <Await resolve={sprintsPromise} errorElement={<CustomError />}>
        {(sprints) =>
          sprints ? (
            <AwaitedSprintList projectId={projectId} {...sprints} />
          ) : (
            <CustomError />
          )
        }
      </Await>
    </Suspense>
  );
}

export function SprintListLoading() {
  return (
    <div className="w-full px-6 py-1">
      <div className="px-6 py-2 font-bold text-gray-700">
        Sprints
        <span className="ml-1 font-normal text-gray-400"></span>
      </div>
      <div className="outl flex flex-col justify-between gap-1 rounded-lg outline-dashed outline-1 outline-offset-4 outline-gray-400">
        {[...Array(4)].map((_, i) => (
          <SprintLoading key={i} />
        ))}
      </div>
    </div>
  );
}

export function AwaitedSprintList({
  projectId,
  sprints,
}: SprintsResponse & {
  projectId: string;
}) {
  const [sprint, setSprint] = useState<
    Omit<APISprintProps, "sprintTasks"> | undefined
  >(undefined);
  const [action, setAction] = useState<"NONE" | "DELETE" | "UPDATE">("NONE");
  const deleteModal = useDisclosure();
  const updateModal = useDisclosure();

  const handleDelete = (sprint: Omit<APISprintProps, "sprintTasks">) => {
    setSprint(sprint);
    setAction("DELETE");
    deleteModal.onOpen();
  };
  const handleUpdate = (sprint: Omit<APISprintProps, "sprintTasks">) => {
    setSprint(sprint);
    setAction("UPDATE");
    updateModal.onOpen();
  };

  const getModal = () => {
    if (action === "DELETE") {
      return (
        <DeleteModal
          deleteHeader="Delete Sprint"
          deleteName={sprint!.name}
          isOpen={deleteModal.isOpen}
          onOpenChange={deleteModal.onOpenChange}
          actionRoute={`/project/${projectId}/sprints/${sprint!.id}`}
        />
      );
    }
    if (action === "UPDATE") {
      return (
        <UpdateSprintModal
          isOpen={updateModal.isOpen}
          onOpenChange={updateModal.onOpenChange}
          projectId={projectId}
          sprint={sprint!}
        />
      );
    }
    return <></>;
  };

  return (
    <div className="w-full px-6 py-1">
      <div className="px-6 py-2 font-bold text-gray-700">
        Sprints
        <span className="ml-1 font-normal text-gray-400">
          ({sprints.length} sprints)
        </span>
      </div>
      <div className="flex min-h-0 min-w-[10rem] flex-shrink-0 flex-col justify-between gap-1 overflow-auto rounded-lg p-1 outline-dashed outline-1 outline-offset-1 outline-gray-400">
        {sprints.map((sprint) => (
          <Sprint
            showUpdateModal={handleUpdate}
            showDeleteModal={handleDelete}
            key={sprint.id}
            {...sprint}
            projectId={projectId}
          />
        ))}
        {sprints.length === 0 && (
          <div className="flex w-full justify-center self-center p-1 text-lg">
            No existing sprints.
          </div>
        )}
      </div>
      {getModal()}
    </div>
  );
}

export default SprintList;
