import { getItemDocumentsCountAction } from "@/server/actions/document-relations/read";
import {
  getItemProjectsCountAction,
  getItemSuppliersCountAction,
} from "@/server/actions/project-items/read";
import PageLayout from "@/components/page-layout";

// export const dynamic = "force-dynamic";

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
  const [suppliersCount] = await getItemSuppliersCountAction(itemId);

  const sidebarNavItemsGenerator = (id: number) => [
    {
      title: "Item",
      href: basePath(id),
    },
    {
      title: "Edit",
      href: basePath(id) + "/edit"
    },
    {
      title: "Projects",
      href: basePath(id) + "/projects",
      amount: projectsCount ?? 0,
    },
    {
      title: "Suppliers",
      href: basePath(id) + "/suppliers",
      amount: suppliersCount ?? 0,
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
    <PageLayout
      title="Item"
      description="Manage your item"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
