import PageLayout from "@/components/page-layout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const sidebarNavItems = [
  {
    title: "All Documents",
    href: "/documents",
  },
  {
    title: "New Document",
    href: "/documents/new-document",
  },
];

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <PageLayout
      title="Documents"
      description="Manage your documents"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
