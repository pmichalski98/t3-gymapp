import React from "react";

const ErrorMsg = (props: { message: string }) => {
  return (
    <div className="mt-2 rounded bg-red-500/70 px-3 py-1.5 font-medium">
      {props.message}
    </div>
  );
};

export default ErrorMsg;
