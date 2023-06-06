import React, { type ChangeEvent } from "react";
import classNames from "classnames";
import { type Exercise } from "@prisma/client";

interface Props {
  className?: string;
  value: string | number;
  name?: string;
  type: "text" | "number" | "email" | "password";
  placeholder?: string;
  required?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    fieldName?: keyof Partial<Exercise>
  ) => void;
}

function Input({ className, ...rest }: Props) {
  const classes = classNames(
    className,
    "text-white bg-black bg-opacity-0 w-full border rounded py-2 px-3 leading-tight text-center  ",
    "hover:border-lightWhite focus:border-lightWhite"
  );

  return <input {...rest} className={classes} />;
}

export default Input;
