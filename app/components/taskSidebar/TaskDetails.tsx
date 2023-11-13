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
    if (JSON.stringify(projectTask) === JSON.stringify(task)) {
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
        <Button size="lg" color="danger" className="font-bold" variant="solid">
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

interface StatusInputProps
  extends Omit<CustomInputProps<string>, "handleInputChange"> {
  statuses: ProjectTaskStatus[];
}
function StatusInput({
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
        unselectable="off"
        name={name}
        value={value}
        onChange={handleSelectChange}
        aria-label={label}
        placeholder="Select status"
        isInvalid={!value}
        errorMessage={!value && "Status is required"}
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

interface NameInputProps
  extends Omit<CustomInputProps<string>, "handleSelectChange"> {}
function NameInput({
  name,
  value,
  label,
  handleInputChange,
  setIsFormInvalid,
}: NameInputProps) {
  const [isInvalid, setIsInvalid] = useState(false);
  const checkIfValid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    if (str.trim().length < 3) {
      setIsInvalid(true);
      setIsFormInvalid!(true);
    } else {
      setIsInvalid(false);
      setIsFormInvalid!(false);
    }
  };

  return (
    <div>
      <Input
        required
        name={name}
        value={value}
        onChange={(e) => {
          handleInputChange(e);
          checkIfValid(e);
        }}
        aria-label={label}
        isInvalid={isInvalid}
        errorMessage={isInvalid && "Name cannot be shorter than 3 chars."}
        maxLength={150}
        variant="bordered"
        size="lg"
        classNames={{ input: "text-xl" }}
      />
    </div>
  );
}

interface PriorityInputProps
  extends Omit<CustomInputProps<Priority>, "handleInputChange"> {}
function PriorityInput({
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

interface DescriptionInputProps
  extends Omit<CustomInputProps<string>, "handleSelectChange"> {}
function DescriptionInput({
  name,
  value,
  label,
  handleInputChange,
  propPack,
}: DescriptionInputProps) {
  return (
    <div>
      <Textarea
        name={name}
        value={value ?? ""}
        onChange={handleInputChange}
        label={label}
        minRows={10}
        maxRows={10}
        {...propPack}
      />
    </div>
  );
}

interface StoryPointsInputProps
  extends Omit<CustomInputProps<number>, "handleSelectChange"> {}
function StoryPointsInput({
  name,
  value,
  label,
  handleInputChange,
  propPack,
}: StoryPointsInputProps) {
  return (
    <div>
      <Input
        type="number"
        name={name}
        value={value ? value.toString() : "0"}
        onChange={handleInputChange}
        label={label}
        min="0"
        {...propPack}
      />
    </div>
  );
}

interface DueDateInputProps
  extends Omit<CustomInputProps<string>, "handleSelectChange"> {}
function DueDateInput({
  name,
  value,
  label,
  handleInputChange,
  propPack,
}: DueDateInputProps) {
  return (
    <div>
      <Input
        type="date"
        name={name}
        value={value ? new Date(value).toLocaleDateString("en-CA") : ""}
        onChange={handleInputChange}
        label={label}
        min={new Date().toISOString().split("T")[0]}
        {...propPack}
      />
    </div>
  );
}

interface EstimatedTimeInputProps
  extends Omit<
    CustomInputProps<EstimatedTime>,
    "handleSelectChange" | "handleInputChange"
  > {
  setTask: React.Dispatch<React.SetStateAction<ProjectTask>>;
}
function EstimatedTimeInput({
  name,
  value,
  setTask,
  label,
  propPack,
  setIsFormInvalid,
}: EstimatedTimeInputProps) {
  const [estValue, setEstValue] = useState(formatEstimatedTimeToString(value));
  const [isInvalid, setIsInvalid] = useState(false);
  useEffect(() => {
    setEstValue(formatEstimatedTimeToString(value));
    setIsInvalid(false);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstValue(e.target.value);
    const estTime = formatStringToEstimatedTime(e.target.value);
    if (!estTime) {
      setIsInvalid(true);
      setIsFormInvalid!(true);
      return;
    }
    setIsInvalid(false);
    setIsFormInvalid!(false);
    setTask((task) => {
      return { ...task, [name]: estTime };
    });
  };

  return (
    <div>
      <Input
        type="text"
        name={name}
        value={estValue}
        onChange={handleChange}
        label={label}
        placeholder="e.g. 1d 2h 30m"
        isInvalid={isInvalid}
        errorMessage={isInvalid && "Etc. must match patter: 2d 4h 30m"}
        pattern={estimatedTimeRegex.toString()}
        {...propPack}
      />
    </div>
  );
}

interface AssigneeInputProps
  extends Omit<CustomInputProps<string>, "handleInputChange"> {
  projectMembers: UserDetails[];
}
function AssigneeInput({
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
        value={value ?? ""}
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
function RelatedTaskInput({
  name,
  value,
  handleSelectChange,
  label,
  propPack,
  taskType,
}: RelatedTaskInputProps) {
  const backlogPromise: Promise<BacklogType> = useOutletContext();
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
        <Await resolve={backlogPromise}>
          {(backlog) => (
            <AwaitedRelatedTaskInput
              backlog={backlog}
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
  backlog: BacklogType;
}
function AwaitedRelatedTaskInput({
  name,
  value,
  handleSelectChange,
  label,
  propPack,
  taskType,
  backlog,
}: AwaitedRelatedTaskInputProps) {
  const taskTypeWithColor = (taskId: string) => {
    const task = backlog.tasks.find((task) => task.id === taskId)!;
    return (
      <span
        className={`text-sm ${
          taskTypeToColorClass[task?.taskType as unknown as TaskType]
        }`}
      >
        {task?.taskType}
      </span>
    );
  };

  const getTasksAccordingToType = () => {
    if (taskType === "Story") {
      return backlog.tasks.filter((task) => task.taskType === "Epic");
    }
    return backlog.tasks.filter((task) => task.taskType === "Story");
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
          {value && taskTypeWithColor(value)}
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
