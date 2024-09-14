import type { ReactNode } from "react";
import { SideNav } from "@/components/nav";

function PageLayout({
  children,
  title,
  sidenavLinks,
}: {
  children: ReactNode;
  title: string;
  sidenavLinks: { href: string; label: string }[];
}) {
  if (!sidenavLinks[0]) return null;
  return (
    <div className="grid w-full max-w-6xl grid-cols-1 items-start gap-6 md:mx-auto md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <div className="px-4 sm:px-0 flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {sidenavLinks.length && <SideNav links={sidenavLinks} />}
      </div>
      {children}
    </div>
  );
}

export default PageLayout;
