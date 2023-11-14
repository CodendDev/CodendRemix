import { Input, InputProps, Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { EstimatedTime, ProjectTask } from "~/api/types/baseEntitiesTypes";
import {
  formatEstimatedTimeToString,
  formatStringToEstimatedTime,
} from "~/components/utils/EstimatedTimeUtils";

export interface CustomInputProps<T> {
  name: string;
  value?: T;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  propPack?: PropPackType;
  setIsFormInvalid?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PropPackType
  extends Pick<
    InputProps,
    "variant" | "size" | "color" | "classNames" | "className" | "labelPlacement"
  > {}

interface NameInputProps
  extends Omit<CustomInputProps<string>, "handleSelectChange"> {}

export function NameInput({
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

interface DescriptionInputProps
  extends Omit<CustomInputProps<string>, "handleSelectChange"> {
  isTaskOrBugfix: boolean;
}

export function DescriptionInput({
  name,
  value,
  label,
  handleInputChange,
  propPack,
  isTaskOrBugfix,
}: DescriptionInputProps) {
  return (
    <div className="w-full">
      <Textarea
        required={!isTaskOrBugfix}
        name={name}
        value={value ?? ""}
        onChange={handleInputChange}
        label={label}
        isInvalid={!isTaskOrBugfix && (!value || value.trim().length === 0)}
        minRows={10}
        maxRows={10}
        {...propPack}
      />
    </div>
  );
}

interface StoryPointsInputProps
  extends Omit<CustomInputProps<number>, "handleSelectChange"> {}

export function StoryPointsInput({
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
  extends Omit<CustomInputProps<string>, "handleSelectChange"> {
  setTask: React.Dispatch<React.SetStateAction<ProjectTask>>;
}

export function DueDateInput({
  name,
  value,
  setTask,
  label,
  handleInputChange,
  propPack,
}: DueDateInputProps) {
  const [dueDate, setDueDate] = useState(
    value ? new Date(value).toISOString().split("T")[0] : ""
  );

  useEffect(() => {
    if (value?.trim() !== dueDate.trim()) {
      if (value) {
        setDueDate(new Date(value).toISOString().split("T")[0]);
      } else if (dueDate !== "") {
        setDueDate("");
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
    if (e.target.value === "") {
      setTask((task) => {
        return {
          ...task,
          [e.target.name]: null,
        };
      });
    } else {
      handleInputChange(e);
    }
  };

  return (
    <div>
      <Input
        type="date"
        name={name}
        value={dueDate}
        onChange={handleChange}
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

export function EstimatedTimeInput({
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
    const est = formatEstimatedTimeToString(value);
    if (est.trim() !== estValue.trim()) {
      setEstValue(est);
      setIsInvalid(false);
    }
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
      return { ...task, ["estimatedTime"]: estTime };
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
        {...propPack}
      />
    </div>
  );
}
