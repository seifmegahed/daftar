import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/nav";
import { getSupplierDocumentsCountAction } from "@/server/actions/documents";
import { getSupplierItemsCountAction } from "@/server/actions/projects";
import { getSupplierAddressesCountAction } from "@/server/actions/addresses";
import { getSupplierContactsCountAction } from "@/server/actions/contacts";

export const dynamic = "force-dynamic";

const basePath = (id: number) => "/supplier/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const supplierId = Number(params.id);
  if (isNaN(supplierId)) return <p>Error: Supplier ID is not a number</p>;

  const [itemsCount] = await getSupplierItemsCountAction(supplierId);

  const [documentsCount] = await getSupplierDocumentsCountAction(supplierId);

  const [addressesCount] = await getSupplierAddressesCountAction(supplierId);

  const [contactsCount] = await getSupplierContactsCountAction(supplierId);

  const sidebarNavItemsGenerator = (id: number) => [
    {
      title: "Supplier",
      href: basePath(id),
    },
    {
      title: "Items",
      href: basePath(id) + "/items",
      amount: itemsCount ?? 0,
    },
    {
      title: "Documents",
      href: basePath(id) + "/documents",
      amount: documentsCount ?? 0,
    },
    {
      title: "Addresses",
      href: basePath(id) + "/addresses",
      amount: addressesCount ?? 0,
    },
    {
      title: "Contacts",
      href: basePath(id) + "/contacts",
      amount: contactsCount ?? 0,
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
  const sidebarNavItems = sidebarNavItemsGenerator(supplierId);

  return (
    // this should be in root layout, but we're doing it here for testing purposes
    <div className="-m-10 h-full min-h-[calc(100vh_-_theme(spacing.16))] bg-background">
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Supplier</h2>
          <p className="text-muted-foreground">Manage your supplier account.</p>
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
