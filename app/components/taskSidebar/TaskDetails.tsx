import {
  ProjectTask,
  ProjectTaskStatus,
  TaskType,
  UserDetails,
} from "~/api/types/baseEntitiesTypes";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { taskTypeToColorClass } from "~/components/utils/TypeToColor";
import { useFetcher } from "@remix-run/react";
import { isEqual } from "lodash";
import {
  DescriptionInput,
  DueDateInput,
  EstimatedTimeInput,
  NameInput,
  PropPackType,
  StoryPointsInput,
} from "~/components/taskSidebar/TaskDetailsInputs";
import {
  AssigneeInput,
  PriorityInput,
  RelatedTaskInput,
  StatusInput,
} from "~/components/taskSidebar/TaskDetailsSelectInputs";

interface TaskDetailsProps {
  projectTask: ProjectTask;
  statuses: ProjectTaskStatus[];
  projectMembers: UserDetails[];
}

export function TaskDetails({
  projectTask,
  statuses,
  projectMembers,
}: TaskDetailsProps) {
  const [task, setTask] = useState({ ...projectTask });
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const fetcher = useFetcher();
  useEffect(() => {
    setTask({ ...projectTask });
    setIsFormInvalid(false);
    setIsChanged(false);
  }, [projectTask]);

  const checkIfChanged = () => {
    if (isEqual(projectTask, task)) {
      setIsChanged(false);
    } else {
      setIsChanged(true);
    }
  };
  const validateRequiredSelects = (selectName: string, selectValue: string) => {
    if (selectName === "statusId") {
      if (!selectValue) {
        setIsFormInvalid(true);
      } else if (!task.statusId) {
        setIsFormInvalid(false);
      }
    }
    if (selectName === "priority") {
      if (!selectValue) {
        setIsFormInvalid(true);
      } else if (!task.priority) {
        setIsFormInvalid(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [e.currentTarget.name]: e.currentTarget.value });
    checkIfChanged();
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectName = e.target.name;
    const selectValue = e.target.value;
    validateRequiredSelects(selectName, selectValue);
    setTask({ ...task, [selectName]: selectValue });
    checkIfChanged();
  };

  const projectTaskFieldStringFor = (fieldName: keyof ProjectTask) => fieldName;
  const getLabelFor = (fieldName: keyof ProjectTask) => {
    const taskProperty = projectTaskFieldStringFor(fieldName);
    const editedName = taskProperty
      .replace(/Id/, "")
      .replace(/([A-Z]+)/g, " $1");
    return editedName.charAt(0).toUpperCase() + editedName.slice(1);
  };
  const isTaskOrBugfix = () => {
    return task.taskType === "Bugfix" || task.taskType === "Base";
  };

  const propPack: PropPackType = {
    variant: "bordered",
    size: "md",
    color: "default",
    classNames: { label: "min-w-unit-24" },
    className: "items-start min-w-[20rem]",
    labelPlacement: "outside-left",
  };

  return (
    <fetcher.Form>
      <div className="flex h-full flex-col gap-3 px-4 py-3">
        <div className="flex w-full flex-row gap-3">
          <TaskTypeBadge taskType={task.taskType} />
          <StatusInput
            statuses={statuses}
            name={projectTaskFieldStringFor("statusId")}
            value={task.statusId}
            handleSelectChange={handleSelectChange}
            label={getLabelFor("statusId")}
            propPack={propPack}
          />
        </div>
        <NameInput
          name={projectTaskFieldStringFor("name")}
          value={task.name}
          handleInputChange={handleInputChange}
          label={getLabelFor("name")}
          setIsFormInvalid={setIsFormInvalid}
        />
        {isTaskOrBugfix() && (
          <PriorityInput
            name={projectTaskFieldStringFor("priority")}
            value={task.priority}
            handleSelectChange={handleSelectChange}
            label={getLabelFor("priority")}
            propPack={propPack}
          />
        )}
        <DescriptionInput
          name={projectTaskFieldStringFor("description")}
          value={task.description}
          handleInputChange={handleInputChange}
          label={getLabelFor("description")}
          propPack={propPack}
        />
        {isTaskOrBugfix() && (
          <>
            <StoryPointsInput
              name={projectTaskFieldStringFor("storyPoints")}
              value={task.storyPoints}
              handleInputChange={handleInputChange}
              label={getLabelFor("storyPoints")}
              propPack={propPack}
            />
            <DueDateInput
              name={projectTaskFieldStringFor("dueDate")}
              value={task.dueDate}
              handleInputChange={handleInputChange}
              label={getLabelFor("dueDate")}
              propPack={propPack}
            />
            <EstimatedTimeInput
              name={"estimatedTimeString"}
              value={task.estimatedTime}
              setTask={setTask}
              label={"Etc."}
              propPack={propPack}
              setIsFormInvalid={setIsFormInvalid}
            />
            <AssigneeInput
              projectMembers={projectMembers}
              name={projectTaskFieldStringFor("assigneeId")}
              value={task.assigneeId}
              handleSelectChange={handleSelectChange}
              label={getLabelFor("assigneeId")}
              propPack={propPack}
            />
          </>
        )}
        {task.taskType !== "Epic" && (
          <RelatedTaskInput
            taskType={task.taskType!}
            name={projectTaskFieldStringFor(
              task.taskType === "Story" ? "epicId" : "storyId"
            )}
            value={task.taskType === "Story" ? task.epicId : task.storyId}
            handleSelectChange={handleSelectChange}
            label="Related task"
            propPack={propPack}
          />
        )}
        <div className="mt-auto flex flex-row justify-end gap-3">
          <Button
            size="lg"
            color="danger"
            className="font-bold"
            variant="solid"
          >
            Delete
          </Button>
          <Button
            size="lg"
            color="primary"
            className="font-bold"
            variant="solid"
            isDisabled={isFormInvalid || !isChanged}
          >
            Apply
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}

export default TaskDetails;

function TaskTypeBadge({ taskType }: { taskType?: TaskType }) {
  return (
    <div
      className={`my-1 flex w-32 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100 px-6 text-xl font-bold shadow ${
        taskTypeToColorClass[taskType!]
      }`}
    >
      {taskType?.replace(/Base/, "Task")}
    </div>
  );
}