import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/nav";
import { getProjectDocumentsCountAction } from "@/server/actions/documents";
import { getProjectItemsCountAction } from "@/server/actions/projects";

const basePath = (id: string) => "/project/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  if (params.id === undefined) return <div>Error: Project ID is undefined</div>;
  const [numberOfDocuments] = await getProjectDocumentsCountAction(Number(params.id));
  const [numberOfItems] = await getProjectItemsCountAction(Number(params.id));

  const sidebarNavItemsGenerator = (id: string) => [
    {
      title: "Project",
      href: basePath(id),
    },
    {
      title: "Edit",
      href: basePath(id) + "/edit",
    },
    {
      title: "Items",
      href: basePath(id) + "/items",
      amount: numberOfItems ?? 0,
    },
    {
      title: "Documents",
      href: basePath(id) + "/documents",
      amount: numberOfDocuments ?? 0,
    },
    {
      title: "New Item",
      href: basePath(id) + "/new-item",
    },
    {
      title: "New Document",
      href: basePath(id) + "/new-document",
    },
  ];
  const sidebarNavItems = sidebarNavItemsGenerator(params.id);
  return (
    // this should be in root layout, but we're doing it here for testing purposes
    <div className="-m-10 h-full min-h-[calc(100vh_-_theme(spacing.16))] bg-background">
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Project</h2>
          <p className="text-muted-foreground">Manage your project.</p>
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
