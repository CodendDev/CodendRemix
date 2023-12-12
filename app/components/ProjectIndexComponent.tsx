import { Card, CardHeader } from "@nextui-org/card";
import { Button, CardBody, Divider } from "@nextui-org/react";
import CodendLogo from "~/components/utils/CodendLogo";
import { Suspense } from "react";
import { Await, useNavigate } from "@remix-run/react";
import { PagedResponse, Project } from "~/api/types/baseEntitiesTypes";
import ClickableDiv from "~/components/utils/ClickableDiv";

export function ProjectIndexComponent({
  projectsPromise,
}: {
  projectsPromise: Promise<PagedResponse<Project>>;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full justify-center bg-opacity-60 bg-[url('/login-background.svg')] bg-cover p-5">
      <div className="flex w-[50em] min-w-[30em] flex-col gap-10">
        <Card className="w-full bg-white bg-opacity-50">
          <CardHeader className="flex justify-center gap-3">
            <CodendLogo className="max-h-24 lg:max-h-36" />
            <div className="flex flex-col items-center justify-center gap-2 p-2">
              <div className="text-3xl font-bold text-emerald-800 lg:text-5xl">
                Welcome to Codend
              </div>
              <div className="text-xl lg:text-2xl">
                Your Agile Command Center!
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="block px-8 py-4 text-justify lg:text-xl">
            You're all set to embark on a journey of streamlined project
            management with <span className="text-emerald-500">Codend</span>. It
            looks like you haven't selected a project yet. No worries – we're
            here to guide you.
          </CardBody>
          <Divider />
          <CardBody className="flex flex-col items-center justify-center px-8">
            <div className="mb-4 text-lg text-emerald-800 lg:text-2xl">
              Checkout one of yours projects or create a new one:
            </div>
            <ProjectsList projectsPromise={projectsPromise} />
            <Button
              color="primary"
              size="md"
              className="mt-2 text-lg font-bold"
              onPress={() => navigate("/project/create")}
            >
              New project
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function ProjectsList({
  projectsPromise,
}: {
  projectsPromise: Promise<PagedResponse<Project>>;
}) {
  return (
    <Suspense fallback={<div>Loading projects...</div>}>
      <Await resolve={projectsPromise}>
        {(projectsPromise) => (
          <div className="flex flex-col items-center justify-center gap-2 px-2">
            {projectsPromise.data!.items.length > 0 ? (
              projectsPromise.data!.items.map((project) => (
                <ProjectItem key={project.id} {...project} />
              ))
            ) : (
              <div className="text-emerald-800 lg:text-2xl">
                Seems like you don't have any projects
              </div>
            )}
          </div>
        )}
      </Await>
    </Suspense>
  );
}

function ProjectItem(project: Project) {
  const navigate = useNavigate();

  return (
    <ClickableDiv
      onClick={() => navigate(`/project/${project.id}/board`)}
      key={project.id}
    >
      <Card className="flex flex-row gap-2 px-3 py-1 hover:bg-gray-200">
        <div className="whitespace-nowrap text-lg">{project.name}</div>
        {project.description && (
          <div className="text-md hidden min-w-[2em] max-w-[12em] flex-shrink self-center overflow-hidden text-ellipsis whitespace-nowrap text-gray-700 lg:block">
            ({project.description})
          </div>
        )}
      </Card>
    </ClickableDiv>
  );
}
