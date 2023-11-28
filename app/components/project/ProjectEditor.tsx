import React, { Suspense } from "react";
import { Project } from "~/api/types/baseEntitiesTypes";
import { Await, useFetcher } from "@remix-run/react";
import { Button, Input, Textarea } from "@nextui-org/react";

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
      defaultValue={project?.name}
      labelPlacement="outside"
      placeholder=" "
      size="lg"
      autoFocus
      classNames={{
        label: "mx-5 text-xl",
      }}
    />,
    <Textarea
      label="Description"
      name="description"
      labelPlacement="outside"
      defaultValue={project?.description}
      size="lg"
      rows={10}
      classNames={{
        label: "mx-5 text-xl",
      }}
    />,
  ];
  return (
    <div className="grow p-10">
      <fetcher.Form method={project ? "PUT" : "POST"} action={action}>
        {inputs.map((i) => (
          <div className="py-2">{i}</div>
        ))}
        <div className="flex justify-end">
          <Button color="primary" type="submit" size="lg">
            {project ? "Save" : "Create"}
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}

function ProjectEditorLoading() {
  return <div>Loading</div>;
}

export default ProjectEditor;
