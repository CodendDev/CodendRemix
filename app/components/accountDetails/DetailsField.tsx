import React from "react";
import { Input } from "@nextui-org/react";

export function DetailsField({
  label,
  item,
}: {
  label: string;
  item: React.ReactElement;
}) {
  return (
    <>
      <div className="text-md px-2 py-1 text-emerald-800">{label}</div>
      {item}
    </>
  );
}

interface DetailsInputProps {
  label: string;
  name: string;
  value: string;
  editable: boolean;
  readOnly?: boolean;
}
export function DetailsInput({
  label,
  name,
  value,
  editable,
  readOnly = false,
}: DetailsInputProps) {
  return (
    <DetailsField
      label={label}
      item={
        <Input
          name={name}
          aria-label={label}
          required
          variant="bordered"
          defaultValue={value}
          minLength={1}
          maxLength={30}
          isReadOnly={readOnly || !editable}
          classNames={{ input: "text-lg" }}
        />
      }
    />
  );
}
