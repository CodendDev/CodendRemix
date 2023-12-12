import { Avatar, Select, SelectItem, Skeleton } from "@nextui-org/react";
import { BsFillClipboardDataFill } from "react-icons/bs/index.js";
import React, { Suspense } from "react";
import {
  MinimalProjectTask,
  Priority,
  ProjectTaskStatus,
  TaskType,
  UserDetails,
} from "~/api/types/baseEntitiesTypes";
import { prioritiesList } from "~/components/utils/PrioritiesList";
import {
  priorityToColorClass,
  taskTypeToColorClass,
} from "~/components/utils/TypeToColor";
import { useOutletContext } from "react-router";
import { TbSubtask } from "react-icons/tb/index.js";
import { Await } from "@remix-run/react";
import { CustomInputProps } from "~/components/taskSidebar/TaskDetailsInputs";

const taskTypeList: TaskType[] = ["Base", "Bugfix", "Story", "Epic"];

interface TaskTypeInputProps
  extends Omit<CustomInputProps<string>, "handleInputChange"> {}

export function TaskTypeInput({
  name,
  value,
  label,
  handleSelectChange,
  propPack,
}: TaskTypeInputProps) {
  return (
    <div>
      <Select
        required
        name={name}
        value={value}
        onChange={handleSelectChange}
        aria-label={label}
        placeholder="Select type"
        disallowEmptySelection={true}
        isInvalid={!value}
        errorMessage={!value && "Type is required"}
        selectedKeys={value ? [value] : []}
        {...propPack}
        size="lg"
        className={`w-[8rem] ${
          value ? taskTypeToColorClass[value as unknown as TaskType] : ""
        }`}
        classNames={{ value: "text-lg font-bold" }}
        radius="full"
        variant="faded"
      >
        {taskTypeList.map((taskType) => (
          <SelectItem
            key={taskType}
            value={taskType}
            className={taskTypeToColorClass[taskType]}
          >
            {taskType}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}

interface StatusInputProps
  extends Omit<CustomInputProps<string>, "handleInputChange"> {
  statuses: ProjectTaskStatus[];
}

export function StatusInput({
  name,
  value,
  label,
  handleSelectChange,
  propPack,
  statuses,
}: StatusInputProps) {
  return (
    <div className="flex-grow">
      <Select
        required
        name={name}
        value={value}
        onChange={handleSelectChange}
        aria-label={label}
        placeholder="Select status"
        disallowEmptySelection={true}
        isInvalid={!value}
        items={statuses}
        selectedKeys={value ? [value] : []}
        startContent={<BsFillClipboardDataFill />}
        {...propPack}
        className={"min-w-[13rem]"}
        size="lg"
      >
        {(status) => (
          <SelectItem key={status.id} value={status.id}>
            {status.name}
          </SelectItem>
        )}
      </Select>
    </div>
  );
}

interface PriorityInputProps
  extends Omit<CustomInputProps<Priority>, "handleInputChange"> {}

export function PriorityInput({
  name,
  value,
  label,
  handleSelectChange,
  propPack,
}: PriorityInputProps) {
  return (
    <div>
      <Select
        required
        name={name}
        value={value}
        onChange={handleSelectChange}
        label={label}
        placeholder={"Select priority"}
        disallowEmptySelection={true}
        isInvalid={!value}
        errorMessage={!value && "Status is required"}
        selectedKeys={value ? [value] : []}
        startContent={
          value && prioritiesList.find((p) => p.value === value)?.icon
        }
        {...propPack}
        className={`w-full items-start ${value && priorityToColorClass[value]}`}
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
  );
}

interface AssigneeInputProps
  extends Omit<CustomInputProps<string>, "handleInputChange"> {
  projectMembers: UserDetails[];
}

export function AssigneeInput({
  name,
  value,
  handleSelectChange,
  label,
  propPack,
  projectMembers,
}: AssigneeInputProps) {
  return (
    <div>
      <Select
        name={name}
        value={value}
        onChange={handleSelectChange}
        label={label}
        items={projectMembers}
        selectedKeys={value ? [value] : []}
        placeholder="Not assigned"
        startContent={
          <Avatar
            src={projectMembers.find((user) => user.id === value)?.imageUrl}
            size="sm"
            className="w-9"
            showFallback
          />
        }
        {...propPack}
        classNames={{
          label: "min-w-unit-24",
          mainWrapper: "min-w-[14rem]",
        }}
      >
        {(member) => (
          <SelectItem
            key={member.id}
            value={member.id}
            startContent={
              <Avatar
                alt={member.email}
                src={member.imageUrl}
                className="h-8 w-8"
                showFallback
              />
            }
          >
            {`${member.firstName} ${member.lastName} (${member.email})`}
          </SelectItem>
        )}
      </Select>
    </div>
  );
}

interface RelatedTaskInputProps
  extends Omit<CustomInputProps<string>, "handleInputChange"> {
  taskType: TaskType;
}

export function RelatedTaskInput({
  name,
  value,
  handleSelectChange,
  label,
  propPack,
  taskType,
}: RelatedTaskInputProps) {
  const tasksPromise: Promise<MinimalProjectTask[]> = useOutletContext();
  return (
    <div>
      <Suspense
        fallback={
          <Select
            label={label}
            selectedKeys={undefined}
            placeholder="Loading..."
            isLoading
            startContent={<TbSubtask />}
            {...propPack}
          >
            <SelectItem
              key="notselected"
              value="notselected"
              textValue="Loading..."
            >
              <Skeleton className="m-1 h-full w-full" />
            </SelectItem>
          </Select>
        }
      >
        <Await resolve={tasksPromise}>
          {(tasks) => (
            <AwaitedRelatedTaskInput
              tasks={tasks}
              name={name}
              value={value}
              handleSelectChange={handleSelectChange}
              label={label}
              propPack={propPack}
              taskType={taskType}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

interface AwaitedRelatedTaskInputProps extends RelatedTaskInputProps {
  tasks: MinimalProjectTask[];
}

function AwaitedRelatedTaskInput({
  name,
  value,
  handleSelectChange,
  label,
  propPack,
  taskType,
  tasks,
}: AwaitedRelatedTaskInputProps) {
  const getTasksAccordingToType = () => {
    if (taskType === "Story") {
      return tasks.filter((task) => task.taskType === "Epic");
    }
    return tasks.filter((task) => task.taskType === "Story");
  };

  return (
    <Select
      name={name}
      value={value}
      onChange={handleSelectChange}
      label={label}
      items={getTasksAccordingToType()}
      selectedKeys={value ? [value] : []}
      placeholder="Not selected"
      startContent={
        <>
          <TbSubtask />
          {value && <TaskTypeWithColor taskId={value} tasks={tasks} />}
        </>
      }
      {...propPack}
    >
      {(task) => (
        <SelectItem
          key={task.id}
          value={task.id}
          textValue={task.name}
          startContent={
            <span className={`italic ${taskTypeToColorClass[task.taskType]}`}>
              {task.taskType}
            </span>
          }
        >
          <span className="overflow-ellipsis">{task.name}</span>
        </SelectItem>
      )}
    </Select>
  );
}

function TaskTypeWithColor({
  taskId,
  tasks,
}: {
  taskId: string;
  tasks: MinimalProjectTask[];
}) {
  const task = tasks.find((task) => task.id === taskId)!;
  return (
    <span
      className={`text-sm ${
        taskTypeToColorClass[task?.taskType as unknown as TaskType]
      }`}
    >
      {task?.taskType}
    </span>
  );
}
