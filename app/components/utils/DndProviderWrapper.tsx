import React, { useEffect, useMemo, useRef, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export const DndProviderWrapper: React.FC<any> = ({ className, children }) => {
  const context = useRef(null);
  const [dndArea, setDnDArea] = useState(context.current);
  useEffect(() => {
    setDnDArea(context?.current);
  }, [context]);
  const html5Options = useMemo(() => ({ rootElement: dndArea }), [dndArea]);
  return (
    <div className={className} ref={context}>
      {dndArea && (
        <DndProvider backend={HTML5Backend} options={html5Options}>
          {children}
        </DndProvider>
      )}
    </div>
  );
};
