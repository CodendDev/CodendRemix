import {
  BacklogType,
  EstimatedTime,
  Priority,
  ProjectTask,
  ProjectTaskStatus,
  TaskType,
  UserDetails,
} from "~/api/types/baseEntitiesTypes";
import {
  Avatar,
  Button,
  Input,
  InputProps,
  Select,
  SelectItem,
  Skeleton,
  Textarea,
} from "@nextui-org/react";
import React, { Suspense, useEffect, useState } from "react";
import {
  priorityToColorClass,
  taskTypeToColorClass,
} from "~/components/utils/TypeToColor";
import { prioritiesList } from "~/components/utils/PrioritiesList";
import { BsFillClipboardDataFill } from "react-icons/bs/index.js";
import { TbSubtask } from "react-icons/tb/index.js";
import { useOutletContext } from "react-router";
import { Await } from "@remix-run/react";
import {
  estimatedTimeRegex,
  formatEstimatedTimeToString,
  formatStringToEstimatedTime,
} from "~/components/utils/EstimatedTimeUtils";

interface TaskDetailsProps {
  projectTask: ProjectTask;
  statuses: ProjectTaskStatus[];
  projectMembers: UserDetails[];
}

interface PropPackType
  extends Pick<
    InputProps,
    "variant" | "size" | "color" | "classNames" | "className" | "labelPlacement"
  > {}

interface CustomInputProps<T> {
  name: string;
  value?: T;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  propPack?: PropPackType;
  setIsFormInvalid?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TaskDetails({
  projectTask,
  statuses,
  projectMembers,
}: TaskDetailsProps) {
  const [task, setTask] = useState({ ...projectTask });
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    setTask({ ...projectTask });
    setIsFormInvalid(false);
    setIsChanged(false);
  }, [projectTask]);

  const checkIfChanged = () => {
    if (projectTask === task) {
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
    <div className="flex h-full flex-col gap-3 px-4 py-3">
      <div className="flex w-full flex-row gap-3">
        <div
          className={`flex items-center justify-center rounded-lg bg-gray-200 p-1 px-6 text-xl font-bold shadow ${
            taskTypeToColorClass[task.taskType!]
          }`}
        >
          {task.taskType?.replace(/Base/, "Task")}
        </div>
        <div className="flex-grow">
          <Select
            items={statuses}
            isRequired
            name={projectTaskFieldStringFor("statusId")}
            labelPlacement="outside-left"
            value={task.statusId}
            selectedKeys={[task.statusId]}
            startContent={<BsFillClipboardDataFill />}
            size="lg"
            onChange={handleSelectChange}
            color="primary"
            variant="bordered"
          >
            {(status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            )}
          </Select>
        </div>
      </div>
      <div>
        <Input
          isRequired
          maxLength={150}
          {...propPack}
          name={projectTaskFieldStringFor("name")}
          value={task.name}
          onChange={handleInputChange}
          size="lg"
          classNames={{ input: "text-xl" }}
        />
      </div>

      <div>
        <Select
          isRequired
          name={projectTaskFieldStringFor("priority")}
          value={task.priority}
          selectedKeys={task.priority ? [task.priority] : []}
          size="md"
          onChange={handleSelectChange}
          startContent={
            prioritiesList.find((p) => p.value === task.priority)!.icon
          }
          color="primary"
          variant="underlined"
          className={priorityToColorClass[task.priority!]}
          listboxProps={{
            itemClasses: {
              base: ["data-[hover=true]:bg-default-100"],
            },
          }}
        >
          {prioritiesList.map((priority) => (
            <SelectItem
              key={priority.value}
              value={priority.value}
              startContent={priority.icon}
              className={priorityToColorClass[priority.value]}
            >
              {priority.value}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <Textarea
          minRows={8}
          {...propPack}
          label={getLabelFor("description")}
          name={projectTaskFieldStringFor("description")}
          value={task.description}
        />
      </div>
      <div>
        <Input
          type="number"
          min="1"
          {...propPack}
          label={getLabelFor("storyPoints")}
          name={task.storyPoints}
          value={task.storyPoints}
        />
      </div>
    </div>
  );
}

export default TaskDetails;
