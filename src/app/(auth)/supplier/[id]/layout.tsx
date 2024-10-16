import { getSupplierDocumentsCountAction } from "@/server/actions/document-relations/read";
import { getSupplierItemsCountAction } from "@/server/actions/project-items/read";
import { getSupplierAddressesCountAction } from "@/server/actions/addresses";
import { getSupplierContactsCountAction } from "@/server/actions/contacts";
import { getSupplierProjectsCountAction } from "@/server/actions/project-items/read";
import PageLayout from "@/components/page-layout";

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

  const [projectsCount] = await getSupplierProjectsCountAction(supplierId);

  const [documentsCount] = await getSupplierDocumentsCountAction(supplierId);

  const [addressesCount] = await getSupplierAddressesCountAction(supplierId);

  const [contactsCount] = await getSupplierContactsCountAction(supplierId);

  const sidebarNavItemsGenerator = (id: number) => [
    {
      title: "Supplier",
      href: basePath(id),
    },
    {
      title: "Edit",
      href: basePath(id) + "/edit",
    },
    {
      title: "Items",
      href: basePath(id) + "/items",
      amount: itemsCount ?? 0,
    },
    {
      title: "Projects",
      href: basePath(id) + "/projects",
      amount: projectsCount ?? 0,
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
    <PageLayout
      title="Supplier"
      description="Manage your supplier"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
