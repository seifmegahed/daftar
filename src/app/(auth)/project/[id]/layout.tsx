import { getProjectDocumentsCountAction } from "@/server/actions/document-relations/read";
import { getProjectItemsCountAction } from "@/server/actions/project-items/read";
import PageLayout from "@/components/page-layout";
import { isCurrentUserAdminAction } from "@/server/actions/users";
import { getProjectCommercialOfferItemsCountAction } from "@/server/actions/commercial-offer-items/read";

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
  const [numberOfCommercialOfferItems] =
    await getProjectCommercialOfferItemsCountAction(projectId);
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
      title: "Purchased Items",
      href: basePath(id) + "/items",
      amount: numberOfItems ?? 0,
    },
    {
      title: "Commercial Offer",
      href: basePath(id) + "/commercial-offer",
      amount: numberOfCommercialOfferItems ?? 0,
      hidden: !userAccess,
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
  ];

  const sidebarNavItems = sidebarNavItemsGenerator(projectId);
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
