import type { ReactNode } from "react";

function PageBody({ children }: { children: ReactNode }) {
  return (
    <main className="max-w-screen flex h-full w-full flex-col gap-4 p-4 md:gap-8 md:px-10">
      {children}
    </main>
  );
}

export default PageBody;
