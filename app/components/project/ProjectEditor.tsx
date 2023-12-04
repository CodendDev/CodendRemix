import React, { Suspense } from "react";
import { Project } from "~/api/types/baseEntitiesTypes";
import { Await, useFetcher } from "@remix-run/react";
import { Button, CardBody, Input, Textarea } from "@nextui-org/react";
import { Card } from "@nextui-org/card";

interface ProjectEditorProps {
  projectPromise?: Promise<Project>;
}
export function ProjectEditor(props: ProjectEditorProps) {
  return (
    <Suspense fallback={<ProjectEditorLoading />}>
      <Await resolve={props.projectPromise}>
        {(project) => <AwaitedProjectEditor project={project} {...props} />}
      </Await>
    </Suspense>
  );
}

interface AwaitedProjectEditorProps extends ProjectEditorProps {
  project?: Project;
}
function AwaitedProjectEditor({ project }: AwaitedProjectEditorProps) {
  const fetcher = useFetcher();
  const action = project ? `/project/${project.id}/update` : `/project/create`;
  const inputs = [
    <Input
      name="name"
      type="text"
      label="Name"
      variant="bordered"
      defaultValue={project?.name}
      labelPlacement="outside"
      placeholder=" "
      size="lg"
      autoFocus
      classNames={{
        label: "mx-2 text-lg text-gray-700",
        input: "text-xl",
      }}
    />,
    <Textarea
      label="Description"
      variant="bordered"
      name="description"
      labelPlacement="outside"
      defaultValue={project?.description}
      size="lg"
      rows={10}
      classNames={{
        label: "mx-2 text-lg text-gray-700",
        input: "text-xl",
      }}
    />,
  ];
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-[20em] min-w-[20em] flex-col justify-center gap-6 py-4 md:w-[30em] lg:w-[40em]">
        <div className="p-2 text-3xl text-emerald-800">
          {project ? "Update project" : "Create project"}
        </div>
        <Card>
          <CardBody>
            <fetcher.Form method={project ? "PUT" : "POST"} action={action}>
              {inputs.map((i, index) => (
                <div className="py-2" key={index}>
                  {i}
                </div>
              ))}
              <div className="flex justify-end">
                <Button color="primary" type="submit" size="lg">
                  {project ? "Save" : "Create"}
                </Button>
              </div>
            </fetcher.Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function ProjectEditorLoading() {
  return <div>Loading</div>;
}

export default ProjectEditor;
