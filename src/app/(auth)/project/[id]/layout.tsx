import { getProjectDocumentsCountAction } from "@/server/actions/document-relations/read";
import { getProjectItemsCountAction } from "@/server/actions/project-items/read";
import PageLayout from "@/components/page-layout";

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
  const [numberOfDocuments] = await getProjectDocumentsCountAction(
    Number(params.id),
  );
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
    <PageLayout
      title="Project"
      description="Manage your project."
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
