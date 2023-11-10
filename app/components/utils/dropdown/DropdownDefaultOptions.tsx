import type { OptionsDropdownItem } from "~/components/utils/dropdown/OptionsDropdown";

export const deleteOption = (onDelete: () => void): OptionsDropdownItem => ({
  label: "Delete",
  onPress: onDelete,
  className: "text-danger",
  color: "danger",
});
