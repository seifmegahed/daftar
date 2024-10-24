import { getProjectDocumentsCountAction } from "@/server/actions/document-relations/read";
import { getPurchaseItemsCountAction } from "@/server/actions/purchase-items/read";
import PageLayout from "@/components/page-layout";
import { hasAccessToPrivateDataAction } from "@/server/actions/users";
import { getProjectCommentsCountAction } from "@/server/actions/project-comments/read";
import { getProjectSaleItemsCountAction } from "@/server/actions/sale-items/read";

const basePath = (id: number) => "/project/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const projectId = Number(params.id);
  if (isNaN(projectId)) return <div>Error: Project ID is invalid</div>;
  const [numberOfDocuments] = await getProjectDocumentsCountAction(projectId);
  const [numberOfItems] = await getPurchaseItemsCountAction(projectId);
  const [numberOfSaleItems] = await getProjectSaleItemsCountAction(projectId);
  const [numberOfComments] = await getProjectCommentsCountAction(projectId);
  const [userAccess] = await hasAccessToPrivateDataAction();

  const sidebarNavItemsGenerator = (id: number) => [
    {
      title: "Project",
      href: basePath(id),
    },
    {
      title: "Edit",
      href: basePath(id) + "/edit",
    },
    {
      title: "Sale Items",
      href: basePath(id) + "/sale-items",
      amount: numberOfSaleItems ?? 0,
      hidden: !userAccess,
    },
    {
      title: "Purchase Items",
      href: basePath(id) + "/purchase-items",
      amount: numberOfItems ?? 0,
      hidden: !userAccess,
    },
    {
      title: "Documents",
      href: basePath(id) + "/documents",
      amount: numberOfDocuments ?? 0,
    },
    {
      title: "New Purchase Item",
      href: basePath(id) + "/new-purchase-item",
    },
    {
      title: "New Sale Item",
      href: basePath(id) + "/new-sale-item",
      hidden: !userAccess,
    },
    {
      title: "New Document",
      href: basePath(id) + "/new-document",
    },
    {
      title: "Comments",
      href: basePath(id) + "/comments",
      amount: numberOfComments ?? 0,
    },
  ];

  const sidebarNavItems = sidebarNavItemsGenerator(projectId);
  return (
    <PageLayout
      title="Project"
      description="Manage your project"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
