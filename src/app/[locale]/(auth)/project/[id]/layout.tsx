import PageLayout from "@/components/page-layout";
import { hasAccessToPrivateDataAction } from "@/server/actions/users";

const basePath = (id: string) => "/project/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const [userAccess] = await hasAccessToPrivateDataAction();

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
      title: "Sale Items",
      href: basePath(id) + "/sale-items",
      hidden: !userAccess,
    },
    {
      title: "Purchase Items",
      href: basePath(id) + "/purchase-items",
      hidden: !userAccess,
    },
    {
      title: "Documents",
      href: basePath(id) + "/documents",
    },
    {
      title: "Commercial Offer",
      href: basePath(id) + "/commercial-offer",
      hidden: !userAccess,
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
    },
  ];

  const sidebarNavItems = sidebarNavItemsGenerator(params.id);
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
