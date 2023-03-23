import React, { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  rest?: string;
}
function ButtonStyleWrapper({ children, ...rest }: Props) {
  return (
    <div
      {...rest}
      className="text-backgroundBlue focus:outline-cyan border-cyan flex items-center justify-center
         rounded bg-gradient-to-r from-darkOcean to-lightCyan px-3 py-1.5
         text-white shadow-2xl outline-none hover:text-bg"
    >
      {children}
    </div>
  );
}

export default ButtonStyleWrapper;
