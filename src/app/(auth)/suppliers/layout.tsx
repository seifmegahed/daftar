import PageLayout from "@/components/page-layout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const sidebarNavItems = [
  {
    title: "All Suppliers",
    href: "/suppliers",
  },
  {
    title: "New Supplier",
    href: "/suppliers/new-supplier",
  },
];

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <PageLayout
      title="Suppliers"
      description="Manage your suppliers"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
