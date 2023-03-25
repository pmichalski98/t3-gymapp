import React, { type ReactNode } from "react";
import classNames from "classnames";

interface Props {
  children: ReactNode;
  rest?: string;
  className?: string;
}
function ButtonStyleWrapper({ children, className, ...rest }: Props) {
  const classes = classNames(
    "text-backgroundBlue focus:outline-cyan border-cyan flex items-center justify-center",
    "rounded bg-gradient-to-r from-darkOcean to-lightCyan px-3 py-1.5",
    "text-white shadow-2xl outline-none hover:text-bg hover:outline-slate-400",
    "cursor-pointer",
    className
  );
  return (
    <div {...rest} className={classes}>
      {children}
    </div>
  );
}

export default ButtonStyleWrapper;
