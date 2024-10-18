import { getDocumentsCountAction } from "@/server/actions/documents/read";
import PageLayout from "@/components/page-layout";

;

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const [numberOfDocuments] = await getDocumentsCountAction();

  const sidebarNavItems = [
    {
      title: "All Documents",
      href: "/documents",
      amount: numberOfDocuments ?? 0,
    },
    {
      title: "New Document",
      href: "/documents/new-document",
    },
  ];

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
