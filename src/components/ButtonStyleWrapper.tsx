import React, { type ComponentProps } from "react";
import classNames from "classnames";
const Button = (
  props: ComponentProps<"div"> & {
    variant?: "primary" | "secondary";
  }
) => {
  const variant =
    props.variant === "secondary"
      ? "bg-neutral-600 hover:bg-neutral-700 disabled:bg-neutral-700 hover:text-slate-200"
      : " bg-pink-700 hover:bg-pink-800 hover:text-slate-200 disabled:bg-pink-950";
  const classes = classNames(
    "shadow-lg transition w-fit flex h-fit self-center py-2 px-1.5  rounded ",
    variant,
    props.className
  );
  return (
    <div {...props} className={classes}>
      {props.children}
    </div>
  );
};

export default Button;
