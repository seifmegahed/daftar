import { getProjectDocumentsCountAction } from "@/server/actions/document-relations/read";
import { getProjectItemsCountAction } from "@/server/actions/project-items/read";
import PageLayout from "@/components/page-layout";
import { isCurrentUserAdminAction } from "@/server/actions/users";
import { getProjectCommercialOfferItemsCountAction } from "@/server/actions/commercial-offer-items/read";
import { getProjectCommentsCountAction } from "@/server/actions/project-comments/read";

const basePath = (id: number) => "/project/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const projectId = Number(params.id);
  if (isNaN(projectId)) return <div>Error: Project ID is invalid</div>;
  const [numberOfDocuments] = await getProjectDocumentsCountAction(projectId);
  const [numberOfItems] = await getProjectItemsCountAction(projectId);
  const [numberOfSaleItems] =
    await getProjectCommercialOfferItemsCountAction(projectId);
  const [numberOfComments] = await getProjectCommentsCountAction(projectId);
  const [userAccess] = await isCurrentUserAdminAction();

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
      title: "Purchased Items",
      href: basePath(id) + "/purchased-items",
      amount: numberOfItems ?? 0,
    },
    {
      title: "Documents",
      href: basePath(id) + "/documents",
      amount: numberOfDocuments ?? 0,
    },
    {
      title: "New Purchase Item",
      href: basePath(id) + "/new-item",
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
