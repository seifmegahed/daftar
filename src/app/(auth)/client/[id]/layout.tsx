import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/nav";
import { getClientAddressesCountAction } from "@/server/actions/addresses";
import { getClientContactsCountAction } from "@/server/actions/contacts";
import { getClientDocumentsCountAction } from "@/server/actions/document-relations/read";
import { getClientProjectsCountAction } from "@/server/actions/projects/read";

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
    // this should be in root layout, but we're doing it here for testing purposes
    <div className="-m-10 h-full min-h-[calc(100vh_-_theme(spacing.16))] bg-background">
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Client</h2>
          <p className="text-muted-foreground">Manage your client account.</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
