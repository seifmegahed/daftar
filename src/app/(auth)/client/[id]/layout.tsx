import { getClientAddressesCountAction } from "@/server/actions/addresses";
import { getClientContactsCountAction } from "@/server/actions/contacts";
import { getClientDocumentsCountAction } from "@/server/actions/document-relations/read";
import { getClientProjectsCountAction } from "@/server/actions/projects/read";

import PageLayout from "@/components/page-layout";

const basePath = (id: string) => "/client/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  if (params.id === undefined) return <div>Error: Client ID is undefined</div>;
  const clientId = Number(params.id);
  const [clientDocumentsCount] = await getClientDocumentsCountAction(clientId);
  const [clientAddressesCount] = await getClientAddressesCountAction(clientId);
  const [clientContactsCount] = await getClientContactsCountAction(clientId);
  const [clientProjectsCount] = await getClientProjectsCountAction(clientId);

  const sidebarNavItemsGenerator = (id: string) => [
    {
      title: "Client",
      href: basePath(id),
    },
    { title: "Edit", href: basePath(id) + "/edit" },
    {
      title: "Projects",
      href: basePath(id) + "/projects",
      amount: clientProjectsCount ?? 0,
    },
    {
      title: "Documents",
      href: basePath(id) + "/documents",
      amount: clientDocumentsCount ?? 0,
    },
    {
      title: "Addresses",
      href: basePath(id) + "/addresses",
      amount: clientAddressesCount ?? 0,
    },
    {
      title: "Contacts",
      href: basePath(id) + "/contacts",
      amount: clientContactsCount ?? 0,
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
      navLinks={sidebarNavItems}
      title="Client"
      description="Manage your client account."
    >
      {children}
    </PageLayout>
  );
}
