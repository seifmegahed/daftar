import PageLayout from "@/components/page-layout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const sidebarNavItems = [
  {
    title: "All Clients",
    href: "/clients",
  },
  {
    title: "New Client",
    href: "/clients/new-client",
  },
];

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <PageLayout
      title="Clients"
      description="Manage your client accounts"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
