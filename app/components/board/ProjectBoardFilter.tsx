import { createContext, useContext } from "react";

import type { BoardTask } from "~/api/types/baseEntitiesTypes";

import { Input, Tooltip } from "@nextui-org/react";
import { RiQuestionLine } from "react-icons/ri/index.js";

export interface BoardQueryContextProps {
  query: string;
  setQuery: (_: string) => void;
  filter: (__: BoardQueryContextProps, _: BoardTask[]) => BoardTask[];
}
export const queryFilterBoardTasks = (
  { query }: BoardQueryContextProps,
  tasks: BoardTask[]
) =>
  tasks.filter(
    (t) =>
      query.length === 0 ||
      t.taskType.toLowerCase() === query.toLowerCase() ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.priority?.toLowerCase().includes(query.toLowerCase())
  );
export const BoardQueryContext = createContext<BoardQueryContextProps>({
  query: "",
  setQuery: () => {},
  filter: (_, __) => [],
});

export const ProjectBoardFilter = () => {
  const { setQuery } = useContext(BoardQueryContext);

  return (
    <Input
      classNames={{ mainWrapper: "grow" }}
      labelPlacement="outside-left"
      label="Search:"
      placeholder="Sprint task name"
      endContent={<SearchToolTip />}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const ToolTipHint = `You can also filter sprint tasks by their type (eg. "Story") and priority (eg. "High")`;
const SearchToolTip = () => (
  <Tooltip content={ToolTipHint} placement="bottom-start">
    <div className="cursor-pointer text-xl">
      <RiQuestionLine />
    </div>
  </Tooltip>
);

export default ProjectBoardFilter;
