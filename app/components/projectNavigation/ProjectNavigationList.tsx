import type { Project } from "~/api/types/baseEntitiesTypes";
import { Accordion, AccordionItem, Skeleton } from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { AiOutlineFileSearch } from "react-icons/ai/index.js";
import { ProjectNavigationBarContext } from "~/components/projectNavigation/ProjectNavigationBar";

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
        className="min-w-[200px]"
        title={<ProjectNavigationListTitle />}
      >
        <ProjectList
          projects={projects}
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
      {projects.map(({ id, name }, i) => (
        <ProjectListItem
          key={i}
          id={id}
          name={name}
          selected={id == selected}
          setSelect={() => setSelected(id)}
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
      className={`cursor-pointer p-2 text-center hover:bg-gray-100 
      ${
        selected
          ? "border-r-5 border-gray-400 bg-gray-100 hover:bg-gray-200"
          : "border-r-5"
      }`}
    >
      {name}
    </div>
  );
}

export default ProjectNavigationList;
