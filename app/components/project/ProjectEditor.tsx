import React, { Suspense } from "react";
import { Project } from "~/api/types/baseEntitiesTypes";
import { Await, useFetcher } from "@remix-run/react";
import { Button, Input } from "@nextui-org/react";

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
  return (
    <fetcher.Form method={project ? "PUT" : "POST"} action={action}>
      <Input
        name="name"
        type="text"
        label="Name"
        defaultValue={project?.name}
      />
      <Input
        name="description"
        type="text"
        label="Description"
        defaultValue={project?.description}
      />
      <Button color="primary" type="submit">
        Save
      </Button>
    </fetcher.Form>
  );
}

function ProjectEditorLoading() {
  return <div>Loading</div>;
}

export default ProjectEditor;
