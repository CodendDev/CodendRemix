import type { Project } from "~/api/types/baseEntitiesTypes";
import { Accordion, AccordionItem, Skeleton } from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate, useSubmit } from "@remix-run/react";
import { AiOutlineFileSearch } from "react-icons/ai/index.js";
import { ProjectNavigationBarContext } from "~/components/projectNavigation/ProjectNavigationBar";
import { FaStar, FaRegStar } from "react-icons/fa/index.js";

type ProjectNavigationListProps = {
  projects: Project[];
  selectedProjectId?: string;
};

export function ProjectNavigationList({
  projects,
  selectedProjectId,
}: ProjectNavigationListProps) {
  return (
    <Accordion defaultExpandedKeys={["Projects"]} className="text-center">
      <AccordionItem
        key="Projects"
        aria-label="Projects"
        title={<ProjectNavigationListTitle />}
      >
        <ProjectList
          projects={projects.sort(
            (a, b) => Number(b.isFavourite) - Number(a.isFavourite)
          )}
          selectedProjectId={selectedProjectId}
        />
      </AccordionItem>
    </Accordion>
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
    <div className="flex flex-row">
      <div className="flex items-center justify-center">
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
    <div className="flex min-w-full flex-col">
      {projects.map((project) => (
        <ProjectListItem
          key={project.id}
          {...project}
          selected={project.id == selected}
          setSelect={() => setSelected(project.id)}
        />
      ))}
    </div>
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
        navigate(`/project/${id}`);
        setSelect();
        nameContext.setProjectName(name);
      }}
      className={`flex cursor-pointer  p-2 text-center hover:bg-gray-100
      ${
        selected
          ? "border-r-5 border-gray-400 bg-gray-100 hover:bg-gray-200"
          : "border-r-5"
      }`}
    >
      <ProjectStar isFavourite={isFavourite} projectId={id} />
      <div className="w-full grow">{name}</div>
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
  const [hover, setHover] = useState(false);
  const hoverIcon = isFavouriteState ? <FaRegStar /> : <FaStar />;
  const icon = isFavouriteState ? <FaStar /> : <FaRegStar />;
  const location = useLocation().pathname;

  const submit = useSubmit();
  return (
    <div
      className="mx-2 flex items-center justify-center text-yellow-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        submit(
          { isFavourite: !isFavourite, projectId, location },
          { method: "PUT" }
        );
        setIsFavouriteState((p) => !p);
        e.stopPropagation();
      }}
    >
      {hover ? hoverIcon : icon}
    </div>
  );
};

export default ProjectNavigationList;
