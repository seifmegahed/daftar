import {
  getDocumentProjectsCountAction,
  getDocumentClientsCountAction,
  getDocumentSuppliersCountAction,
  getDocumentItemsCountAction,
} from "@/server/actions/document-relations/read";
import PageLayout from "@/components/page-layout";

;

const basePath = (id: number) => "/document/" + id;

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [numberOfProjects] = await getDocumentProjectsCountAction(documentId);
  const [numberOfClients] = await getDocumentClientsCountAction(documentId);
  const [numberOfSuppliers] = await getDocumentSuppliersCountAction(documentId);
  const [numberOfItems] = await getDocumentItemsCountAction(documentId);

  const sidebarNavItemsGenerator = (id: number) => [
    {
      title: "Document",
      href: basePath(id),
    },
    {
      title: "Edit",
      href: basePath(id) + "/edit",
    },
    {
      title: "Projects",
      href: basePath(id) + "/projects",
      amount: numberOfProjects ?? 0,
    },
    {
      title: "Clients",
      href: basePath(id) + "/clients",
      amount: numberOfClients ?? 0,
    },
    {
      title: "Suppliers",
      href: basePath(id) + "/suppliers",
      amount: numberOfSuppliers ?? 0,
    },
    {
      title: "Items",
      href: basePath(id) + "/items",
      amount: numberOfItems ?? 0,
    },
  ];
  const sidebarNavItems = sidebarNavItemsGenerator(documentId);

  return (
    <PageLayout
      title="Document"
      description="Manage your document"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
