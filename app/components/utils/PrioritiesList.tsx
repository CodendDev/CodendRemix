import { Priority } from "~/api/types/baseEntitiesTypes";
import React from "react";
import {
  HiChevronDoubleDown,
  HiChevronDoubleUp,
  HiChevronDown,
  HiChevronUp,
  HiMinus,
} from "react-icons/hi/index.js";

export const prioritiesList: { value: Priority; icon: React.ReactNode }[] = [
  { value: "VeryHigh", icon: <HiChevronDoubleUp /> },
  { value: "High", icon: <HiChevronUp /> },
  { value: "Normal", icon: <HiMinus /> },
  { value: "Low", icon: <HiChevronDown /> },
  { value: "VeryLow", icon: <HiChevronDoubleDown /> },
];
