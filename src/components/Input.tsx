import React, { type ChangeEvent } from "react";
import classNames from "classnames";
import { type FormData } from "../types/trainings";

interface Props {
  className?: string;
  value: string | number | undefined;
  name?: string;
  type: "text" | "number" | "email" | "password";
  placeholder?: string;
  required?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    fieldName?: keyof FormData
  ) => void;
}

function Input({ className, ...rest }: Props) {
  const classes = classNames(
    className,
    "text-white bg-black bg-opacity-0 w-full border rounded py-2 px-3 leading-tight text-center border-cyan ",
    "hover:border-lightWhite focus:border-lightWhite"
  );

  return <input {...rest} className={classes} />;
}

export default Input;
