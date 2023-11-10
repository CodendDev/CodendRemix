import React from "react";
import type { FocusableProps, PressEvents } from "@react-types/shared";
import type { AriaMenuItemProps } from "@react-aria/menu";

import { MdMoreHoriz } from "react-icons/md/index.js";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import type { ItemProps } from "@nextui-org/aria-utils";
import type { MenuItemVariantProps } from "@nextui-org/theme";

interface OptionsDropdownProps {
  options: OptionsDropdownItem[];
}
export function OptionsDropdown({ options }: OptionsDropdownProps) {
  const iconsStyle: string = "text-sky-500 text-xl";

  return (
    <Dropdown className="min-w-fit">
      <DropdownTrigger>
        <Button variant="light" radius="full" size="sm" isIconOnly>
          <MdMoreHoriz className={iconsStyle} />
        </Button>
      </DropdownTrigger>
      {options.length > 0 && (
        <DropdownMenu aria-label="More">
          {options.map((props, i) => (
            <DropdownItem key={i} {...props}>
              {props.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Dropdown>
  );
}

// 💀
interface OptionProps<T extends object = {}>
  extends Omit<ItemProps<"li", T>, "children" | "title"> {
  label: string;
}
export type OptionsDropdownItem<T extends object = {}> = OptionProps<T> &
  MenuItemVariantProps &
  AriaMenuItemProps &
  FocusableProps &
  PressEvents;
