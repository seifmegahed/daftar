import PageLayout from "@/components/page-layout";
import { hasAccessToPrivateDataAction } from "@/server/actions/users";

const basePath = (id: string) => "/supplier/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const [access] = await hasAccessToPrivateDataAction();

  const sidebarNavItemsGenerator = (id: string) => [
    {
      title: "Supplier",
      href: basePath(id),
    },
    {
      title: "Edit",
      href: basePath(id) + "/edit",
    },
    {
      title: "Items",
      href: basePath(id) + "/items",
      hidden: !access,
    },
    {
      title: "Projects",
      href: basePath(id) + "/projects",
    },
    {
      title: "Documents",
      href: basePath(id) + "/documents",
    },
    {
      title: "Addresses",
      href: basePath(id) + "/addresses",
    },
    {
      title: "Contacts",
      href: basePath(id) + "/contacts",
    },
    {
      title: "New Address",
      href: basePath(id) + "/new-address",
    },
    {
      title: "New Contact",
      href: basePath(id) + "/new-contact",
    },
    {
      title: "New Document",
      href: basePath(id) + "/new-document",
    },
  ];
  const sidebarNavItems = sidebarNavItemsGenerator(params.id);

  return (
    <PageLayout
      title="Supplier"
      description="Manage your supplier"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
