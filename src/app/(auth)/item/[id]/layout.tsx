import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/nav";
import { getItemDocumentsCountAction } from "@/server/actions/document-relations/read";
import { getItemProjectsCountAction } from "@/server/actions/project-items/read";

export const dynamic = "force-dynamic";

const basePath = (id: number) => "/item/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const itemId = Number(params.id);

  const [documentsCount] = await getItemDocumentsCountAction(itemId);
  const [projectsCount] = await getItemProjectsCountAction(itemId);

  const sidebarNavItemsGenerator = (id: number) => [
    {
      title: "Item",
      href: basePath(id),
    },
    {
      title: "Projects",
      href: basePath(id) + "/projects",
      amount: projectsCount ?? 0,
    },
    {
      title: "Documents",
      href: basePath(id) + "/documents",
      amount: documentsCount ?? 0,
    },
    {
      title: "New Document",
      href: basePath(id) + "/new-document",
    },
  ];
  const sidebarNavItems = sidebarNavItemsGenerator(itemId);

  return (
    // this should be in root layout, but we're doing it here for testing purposes
    <div className="-m-10 h-full min-h-[calc(100vh_-_theme(spacing.16))] bg-background">
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Item</h2>
          <p className="text-muted-foreground">Manage your item.</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
