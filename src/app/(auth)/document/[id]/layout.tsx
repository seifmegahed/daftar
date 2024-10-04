import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/nav";

import {
  getDocumentProjectsCountAction,
  getDocumentClientsCountAction,
  getDocumentSuppliersCountAction,
  getDocumentItemsCountAction,
} from "@/server/actions/document-relations/read";

export const dynamic = "force-dynamic";

const basePath = (id: number) => "/document/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [numberOfProjects] = await getDocumentProjectsCountAction(documentId);
  const [numberOfClients] = await getDocumentClientsCountAction(documentId);
  const [numberOfSuppliers] = await getDocumentSuppliersCountAction(documentId);
  const [numberOfItems] = await getDocumentItemsCountAction(documentId);

  const sidebarNavItemsGenerator = (id: number) => [
    {
      title: "Document",
      href: basePath(id),
    },
    {
      title: "Edit",
      href: basePath(id) + "/edit",
    },
    {
      title: "Projects",
      href: basePath(id) + "/projects",
      amount: numberOfProjects ?? 0,
    },
    {
      title: "Clients",
      href: basePath(id) + "/clients",
      amount: numberOfClients ?? 0,
    },
    {
      title: "Suppliers",
      href: basePath(id) + "/suppliers",
      amount: numberOfSuppliers ?? 0,
    },
    {
      title: "Items",
      href: basePath(id) + "/items",
      amount: numberOfItems ?? 0,
    },
  ];
  const sidebarNavItems = sidebarNavItemsGenerator(documentId);

  return (
    // this should be in root layout, but we're doing it here for testing purposes
    <div className="-m-10 h-full min-h-[calc(100vh_-_theme(spacing.16))] bg-background">
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Document</h2>
          <p className="text-muted-foreground">Manage your document.</p>
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
