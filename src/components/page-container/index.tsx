import type { ReactNode } from "react";

function PageBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col overflow-y-scroll">
      <main className="max-w-screen flex h-full min-h-[calc(100vh_-_theme(spacing.16))] w-full flex-1 flex-col gap-4 p-4 md:gap-8 md:px-10 md:py-4">
        {children}
      </main>
    </div>
  );
}

export default PageBody;
