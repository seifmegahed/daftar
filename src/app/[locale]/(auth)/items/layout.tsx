import PageLayout from "@/components/page-layout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const sidebarNavItems = [
  {
    title: "All Items",
    href: "/items",
  },
  {
    title: "New Item",
    href: "/items/new-item",
  },
];

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <PageLayout
      title="Items"
      description="Manage your items"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
