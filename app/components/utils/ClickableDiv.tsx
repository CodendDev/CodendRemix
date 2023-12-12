import React from "react";

interface ClickableDivProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onClick?: (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => void;
}

const ClickableDiv: React.FC<ClickableDivProps> = (props) => {
  const { children, ...otherProps } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      props.onClick?.(e);
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={props["aria-label"]}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default ClickableDiv;
