import React, { type ReactNode } from "react";

function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-3/4 max-w-4xl pt-20 pt-4 text-center">
      {children}
    </div>
  );
}

export default ContentLayout;
