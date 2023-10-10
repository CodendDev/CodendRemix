import type { Project } from "~/api/types/baseEntitiesTypes";
import { Accordion, AccordionItem } from "@nextui-org/react";
import React, { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { AiOutlineFileSearch } from "react-icons/ai/index.js";

type ProjectNavigationListProps = {
  projects: Project[];
  selectedProjectId?: string;
};

export function ProjectNavigationList({
  projects,
  selectedProjectId,
}: ProjectNavigationListProps) {
  const title = (
    <div className="flex flex-row">
      <div className="flex items-center justify-center">
        <AiOutlineFileSearch />
      </div>
      Projects
    </div>
  );

  return (
    <Accordion defaultExpandedKeys={["Projects"]} className="text-center">
      <AccordionItem key="Projects" aria-label="Projects" title={title}>
        <ProjectList
          projects={projects}
          selectedProjectId={selectedProjectId}
        />
      </AccordionItem>
    </Accordion>
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
    <div className="flex flex-col">
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

  return (
    <div
      onClick={() => {
        navigate(`/project/${id}`);
        setSelect();
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
