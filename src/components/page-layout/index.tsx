import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/nav";
import type { NavLink } from "@/components/nav/sidebar-nav";

function PageLayout({
  children,
  title,
  description,
  navLinks,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  navLinks: NavLink[];
}) {
  return (
    <div className="h-fit min-h-[calc(100vh_-_theme(spacing.16))]">
      <div className="space-y-6 p-0 pb-16 md:px-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:gap-x-12 lg:space-y-0">
          <aside className="w-full max-w-full lg:-ms-4 lg:w-1/5">
            <SidebarNav links={navLinks} />
          </aside>
          <div className="flex-1 lg:max-w-2xl sm:mx-0 -mx-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
