import { ProjectTask, ProjectTaskStatus } from "~/api/types/baseEntitiesTypes";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import {
  priorityToColorClass,
  taskTypeToColorClass,
} from "~/components/utils/TypeToColor";
import { prioritiesList } from "~/components/utils/PrioritiesList";
import { BsFillClipboardDataFill } from "react-icons/bs/index.js";

type TaskDetailsProps = {
  projectTask: ProjectTask;
  statuses: ProjectTaskStatus[];
};

export function TaskDetails({ projectTask, statuses }: TaskDetailsProps) {
  const [task, setTask] = useState({ ...projectTask });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [e.currentTarget.name]: e.currentTarget.value });
    console.log(
      `Logged change for ${e.currentTarget.name} to ${e.currentTarget.value}`
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
    console.log(`Logged change for ${e.target.name} to ${e.target.value}`);
  };

  const projectTaskFieldStringFor = (fieldName: keyof ProjectTask) => fieldName;
  const estimatedTimeRegex = /^(\d+d)?\s*(\d+h)?\s*(\d+m)?$/;

  const propPack: any = {
    variant: "underlined",
    size: "md",
    color: "primary",
  };
  const getLabelFor = (fieldName: keyof ProjectTask) => {
    const taskProperty = projectTaskFieldStringFor(fieldName);
    const editedName = taskProperty
      .replace(/Id/, "")
      .replace(/([A-Z]+)/g, " $1");
    return editedName.charAt(0).toUpperCase() + editedName.slice(1);
  };

  return (
    <div className="flex flex-col gap-3 px-4 py-3">
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
