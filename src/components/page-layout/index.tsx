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
    <div className="grid w-full grid-cols-1 items-start gap-6 md:mx-auto md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <div className="flex flex-col gap-4 px-4 sm:px-0">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {sidenavLinks.length && <SideNav links={sidenavLinks} />}
      </div>
      <div className="flex w-full flex-col items-center">{children}</div>
    </div>
  );
}

export default PageLayout;
