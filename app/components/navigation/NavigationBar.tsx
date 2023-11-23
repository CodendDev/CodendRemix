import { AiOutlineClose } from "react-icons/ai/index.js";
import { RxRows } from "react-icons/rx/index.js";
import React, { useContext } from "react";

export const NavigationBarContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (p: (prev: boolean) => boolean) => void;
}>({
  setIsOpen: () => {},
  isOpen: false,
});

export function NavigationBar() {
  const { isOpen, setIsOpen } = useContext(NavigationBarContext);

  return (
    <div
      className="z-10 flex flex-col bg-emerald-800 p-3 shadow-[inset_-4px_0_4px] shadow-emerald-900"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      {isOpen ? (
        <AiOutlineClose className="text-white" />
      ) : (
        <RxRows className="text-gray-100" />
      )}
    </div>
  );
}
