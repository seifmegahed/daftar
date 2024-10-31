import PageLayout from "@/components/page-layout";

const basePath = (id: string) => "/item/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

const sidebarNavItemsGenerator = (id: string) => [
  {
    title: "Item",
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
    title: "Suppliers",
    href: basePath(id) + "/suppliers",
  },
  {
    title: "Documents",
    href: basePath(id) + "/documents",
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
      title="Item"
      description="Manage your item"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
