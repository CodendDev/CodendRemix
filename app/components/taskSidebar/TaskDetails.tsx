import { ProjectTask, TaskType } from "~/api/types/baseEntitiesTypes";
import { Button, useDisclosure } from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import { taskTypeToColorClass } from "~/components/utils/TypeToColor";
import { useFetcher, useNavigate } from "@remix-run/react";
import _ from "lodash";
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
  TaskTypeInput,
} from "~/components/taskSidebar/TaskDetailsSelectInputs";
import DeleteModal from "~/components/shared/modals/DeleteModal";
import { emptyTask } from "~/api/types/projectTaskTypes";
import {
  MembersContext,
  StatusesContext,
} from "~/routes/project.$projectId/route";
import { IoIosCloseCircle } from "react-icons/io/index.js";

interface TaskDetailsProps {
  projectTask?: ProjectTask;
  formType: "PUT" | "POST";
  actionRouteRoot: string;
  cancelRoute: string;
}

export function TaskDetails({
  projectTask = emptyTask(),
  formType,
  actionRouteRoot,
  cancelRoute,
}: TaskDetailsProps) {
  const [task, setTask] = useState({ ...projectTask });
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const statuses = useContext(StatusesContext);
  const projectMembers = useContext(MembersContext);

  useEffect(() => {
    setTask({ ...projectTask });
    setIsFormInvalid(false);
    setIsChanged(false);
  }, [projectTask]);
  useEffect(() => {
    checkIfChanged();
  }, [task]);

  const checkIfChanged = () => {
    if (
      _.isEqual(_.omit(projectTask, ["taskType"]), _.omit(task, ["taskType"]))
    ) {
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
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectName = e.target.name;
    const selectValue = e.target.value;
    validateRequiredSelects(selectName, selectValue);
    setTask({ ...task, [selectName]: selectValue });
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
    <fetcher.Form
      method={formType}
      action={
        formType === "PUT"
          ? `${actionRouteRoot}/${projectTask?.id}/${projectTask?.taskType}`
          : `${actionRouteRoot}/create`
      }
      className={"h-full"}
    >
      <div className="flex h-full flex-col gap-3 px-4 py-3">
        <div className="flex w-full flex-row items-center gap-3">
          <div
            className="flex h-fit w-fit cursor-pointer rounded-lg text-4xl text-danger hover:text-foreground"
            onClick={() => {
              navigate(cancelRoute);
            }}
          >
            <IoIosCloseCircle />
          </div>
          {formType == "PUT" ? (
            <TaskTypeBadge taskType={task.taskType} />
          ) : (
            <TaskTypeInput
              name={projectTaskFieldStringFor("taskType")}
              value={task.taskType}
              handleSelectChange={handleSelectChange}
              label={getLabelFor("taskType")}
              propPack={propPack}
            />
          )}
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
          isTaskOrBugfix={isTaskOrBugfix()}
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
              setTask={setTask}
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
            <input type="hidden" value={task.assigneeId} name="assigneeId" />
          </>
        )}
        {task.taskType !== "Epic" && (
          <>
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
            <input
              type="hidden"
              value={task.taskType === "Story" ? task.epicId : task.storyId}
              name={task.taskType === "Story" ? "epicId" : "storyId"}
            />
          </>
        )}
        <div className="mt-auto flex flex-row justify-end gap-3">
          {formType === "PUT" ? (
            <Button
              size="lg"
              color="danger"
              className="font-bold"
              variant="solid"
              onPress={onOpen}
            >
              Delete
            </Button>
          ) : (
            <Button
              size="lg"
              color="danger"
              className="font-bold"
              variant="solid"
              onPress={() => {
                navigate(cancelRoute);
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="lg"
            color="primary"
            className="font-bold"
            variant="solid"
            isDisabled={isFormInvalid || !isChanged}
          >
            {formType === "PUT" ? "Apply" : "Create"}
          </Button>
          {formType === "PUT" && (
            <DeleteModal
              actionRoute={`${actionRouteRoot}/${projectTask?.id}/${projectTask?.taskType}`}
              useFetcherForm={false}
              deleteName={projectTask.name}
              deleteHeader="Delete Task"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
            />
          )}
        </div>
      </div>
    </fetcher.Form>
  );
}

export default TaskDetails;

function TaskTypeBadge({ taskType }: { taskType?: TaskType }) {
  return (
    <div
      className={`flex h-12 w-[7rem] items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100 px-6 text-xl font-bold ${
        taskTypeToColorClass[taskType!]
      }`}
    >
      {taskType?.replace(/Base/, "Task")}
    </div>
  );
}
