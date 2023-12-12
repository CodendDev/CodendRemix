import { AiOutlineClose } from "react-icons/ai/index.js";
import { RxRows } from "react-icons/rx/index.js";
import React, { useContext } from "react";
import CodendLogo from "~/components/utils/CodendLogo";
import { useNavigate } from "@remix-run/react";

export const NavigationBarContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (p: (prev: boolean) => boolean) => void;
}>({
  setIsOpen: () => {},
  isOpen: false,
});

export function NavigationBar() {
  const { isOpen, setIsOpen } = useContext(NavigationBarContext);
  const navigate = useNavigate();

  return (
    <div className="z-50 flex flex-col bg-emerald-800 shadow-[inset_-4px_0_4px] shadow-emerald-900">
      <div className="flex h-full w-12 flex-col justify-between gap-3 px-2 py-3">
        <CodendLogo
          className={"hover: cursor-pointer"}
          onClick={() => navigate("/project")}
        />
        {isOpen ? (
          <AiOutlineClose
            className="w-full cursor-pointer text-lg text-white hover:text-gray-400"
            onClick={() => setIsOpen((prev) => !prev)}
          />
        ) : (
          <RxRows
            className="w-full cursor-pointer text-lg text-white hover:text-gray-400"
            onClick={() => setIsOpen((prev) => !prev)}
          />
        )}
      </div>
    </div>
  );
}
