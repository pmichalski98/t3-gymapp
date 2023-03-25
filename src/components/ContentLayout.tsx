import React, { type ReactNode } from "react";

function ContentLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto mt-10 w-3/4 pt-4 text-center">{children}</div>;
}

export default ContentLayout;
