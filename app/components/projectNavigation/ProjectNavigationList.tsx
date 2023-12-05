import type { Project } from "~/api/types/baseEntitiesTypes";
import {
  Accordion,
  AccordionItem,
  Button,
  ScrollShadow,
  Skeleton,
} from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate, useSubmit } from "@remix-run/react";
import { AiOutlineFileSearch } from "react-icons/ai/index.js";
import { ProjectNavigationBarContext } from "~/components/projectNavigation/ProjectNavigationBar";
import { FaStar, FaRegStar } from "react-icons/fa/index.js";
import { AiOutlinePlus } from "react-icons/ai/index.js";

type ProjectNavigationListProps = {
  projects: Project[];
  selectedProjectId?: string;
};

export function ProjectNavigationList({
  projects,
  selectedProjectId,
}: ProjectNavigationListProps) {
  return (
    <>
      <Accordion
        variant="bordered"
        defaultExpandedKeys={projects.length > 0 ? ["Projects"] : []}
        className="rounded-none border-none text-center"
      >
        <AccordionItem
          key="Projects"
          aria-label="Projects"
          title={<ProjectNavigationListTitle />}
        >
          {projects.length > 0 ? (
            <ProjectList
              projects={projects.sort(
                (a, b) => Number(b.isFavourite) - Number(a.isFavourite)
              )}
              selectedProjectId={selectedProjectId}
            />
          ) : (
            <div className="flex justify-center text-lg text-gray-600">
              You don't have any projects.
            </div>
          )}
        </AccordionItem>
      </Accordion>
      <div className="flex flex-row px-4">
        <Button
          size="sm"
          variant="light"
          color="primary"
          fullWidth
          startContent={<AiOutlinePlus />}
          className="text-lg"
          as={Link}
          to="/project/create"
        >
          New project
        </Button>
      </div>
    </>
  );
}

export function LoadingProjectNavigationList({ error }: { error?: boolean }) {
  return (
    <Accordion defaultExpandedKeys={["Projects"]} className="text-center">
      <AccordionItem
        key="Projects"
        aria-label="Projects"
        title={<ProjectNavigationListTitle />}
      >
        {[...Array(4)].map((e, i) => (
          <Skeleton key={i} className="m-3 w-4/5 rounded-lg" isLoaded={error}>
            <div
              className={`h-7 rounded-lg bg-default-200 ${
                error && "bg-gradient-to-r from-red-500"
              }`}
            ></div>
          </Skeleton>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

function ProjectNavigationListTitle() {
  return (
    <div className="flex flex-row text-xl">
      <div className="mx-2 flex items-center justify-center">
        <AiOutlineFileSearch />
      </div>
      Projects
    </div>
  );
}

function ProjectList({
  projects,
  selectedProjectId,
}: ProjectNavigationListProps) {
  const [selected, setSelected] = useState<string | undefined>(
    selectedProjectId
  );

  return (
    <ScrollShadow
      hideScrollBar
      className="-mt-2 flex flex-col rounded-lg border-1 border-gray-200"
    >
      {projects.map((project) => (
        <ProjectListItem
          key={project.id}
          {...project}
          selected={project.id == selected}
          setSelect={() => setSelected(project.id)}
        />
      ))}
    </ScrollShadow>
  );
}

function ProjectListItem({
  id,
  name,
  selected,
  setSelect,
  isFavourite,
}: Omit<Project, "ownerId"> & {
  selected: boolean;
  setSelect: () => void;
}) {
  const navigate = useNavigate();
  const nameContext = useContext(ProjectNavigationBarContext);

  return (
    <div
      onClick={() => {
        navigate(`/project/${id}/board`);
        setSelect();
        nameContext.setProjectName(name);
      }}
      className={`flex cursor-pointer flex-row p-2 text-center first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100 not-first:border-t-1 not-first:border-gray-200
      ${
        selected
          ? "outline outline-1 -outline-offset-1 outline-emerald-500"
          : ""
      }`}
    >
      <ProjectStar isFavourite={isFavourite} projectId={id} />
      <span className="overflow-hidden overflow-ellipsis whitespace-nowrap text-start">
        {name}
      </span>
    </div>
  );
}

const ProjectStar = ({
  isFavourite,
  projectId,
}: {
  isFavourite: boolean;
  projectId: string;
}) => {
  const [isFavouriteState, setIsFavouriteState] = useState(isFavourite);
  const icon = isFavouriteState ? <FaStar /> : <FaRegStar />;
  const location = useLocation().pathname;

  const submit = useSubmit();
  return (
    <div
      className="mx-2 flex items-center justify-center text-primary-500 hover:text-primary-700"
      onClick={(e) => {
        submit(
          { isFavourite: !isFavourite, projectId, location },
          { method: "PUT" }
        );
        setIsFavouriteState((p) => !p);
        e.stopPropagation();
      }}
    >
      {icon}
    </div>
  );
};

export default ProjectNavigationList;
