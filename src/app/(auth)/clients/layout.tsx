import { getClientsCountAction } from "@/server/actions/clients/read";
import PageLayout from "@/components/page-layout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

;

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const [numberOfClients] = await getClientsCountAction();
  const sidebarNavItems = [
    {
      title: "All Clients",
      href: "/clients",
      amount: numberOfClients ?? 0,
    },
    {
      title: "New Client",
      href: "/clients/new-client",
    },
  ];
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
