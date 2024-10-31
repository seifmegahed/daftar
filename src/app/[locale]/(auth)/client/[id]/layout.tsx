import PageLayout from "@/components/page-layout";

const basePath = (id: string) => "/client/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

const sidebarNavItemsGenerator = (id: string) => [
  {
    title: "Client",
    href: basePath(id),
  },
  { title: "Edit", href: basePath(id) + "/edit" },
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

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const sidebarNavItems = sidebarNavItemsGenerator(params.id);

  return (
    <PageLayout
      navLinks={sidebarNavItems}
      title="Client"
      description="Manage your client account"
    >
      {children}
    </PageLayout>
  );
}
