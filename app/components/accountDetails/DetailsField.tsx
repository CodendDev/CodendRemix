import React from "react";
import { Button, Input } from "@nextui-org/react";
import { useFetcher, useLocation } from "@remix-run/react";

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

export function DetailsNotifications() {
  const path = useLocation().pathname;
  const fetcher = useFetcher();

  const handleNotifications = (shouldBeEnabled: boolean) => {
    fetcher.submit(
      { notifications: shouldBeEnabled, returnUrl: path },
      { action: "/user/account/edit", method: "post" }
    );
  };

  return (
    <DetailsField
      label="Notifications"
      item={
        <div className="flex w-full flex-row pt-2">
          <div className="flex w-full justify-center">
            <Button
              color="secondary"
              onPress={() => handleNotifications(true)}
              isLoading={fetcher.state !== "idle"}
            >
              Enable all notifications
            </Button>
          </div>
          <div className="flex w-full justify-center">
            <Button
              color="warning"
              onPress={() => handleNotifications(false)}
              isLoading={fetcher.state !== "idle"}
            >
              Disable all notifications
            </Button>
          </div>
        </div>
      }
    />
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
