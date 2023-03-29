import classNames from "classnames";
import React, { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant: "primary" | "secondary" | "success";
  outlined?: boolean;
  rounded?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  hidden?: boolean;
}

function Button({
  children,
  outlined,
  rounded,
  className,
  variant,
  hidden,
  ...rest
}: Props) {
  const classes = classNames(
    "flex justify-center items-center text-white",
    "shadow-2xl text-backgroundBlue ",
    "focus:outline-cyan outline-none px-3 py-1.5 rounded",
    {
      "border-cyan bg-gradient-to-r from-darkOcean to-lightCyan hover:text-bg hover:outline-slate-400":
        variant === "primary",
      "border-2 border-lightCyan bg-backgroundBlue text-white hover:text-lightCyan hover:border-black":
        variant === "secondary",
      "border-cyanLight bg-darkCyan text-black hover:outline-white hover:text-bg":
        variant === "success",
      "border-2": outlined,
      "rounded-full": rounded,
      hidden: hidden,
    },
    className
  );

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}

export default Button;
