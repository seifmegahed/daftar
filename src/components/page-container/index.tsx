import type { ReactNode } from "react";

function PageBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col overflow-y-scroll">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] h-full flex-1 flex-col gap-4 bg-muted/40 w-full sm:px-4 md:gap-8 md:px-8">
        {children}
      </main>
    </div>
  );
}

export default PageBody;
