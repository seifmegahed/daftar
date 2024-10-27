import PageLayout from "@/components/page-layout";

const basePath = (id: string) => "/document/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}
const sidebarNavItemsGenerator = (id: string) => [
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
  },
  {
    title: "Clients",
    href: basePath(id) + "/clients",
  },
  {
    title: "Suppliers",
    href: basePath(id) + "/suppliers",
  },
  {
    title: "Items",
    href: basePath(id) + "/items",
  },
];

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const sidebarNavItems = sidebarNavItemsGenerator(params.id);

  return (
    <PageLayout
      title="Document"
      description="Manage your document"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
