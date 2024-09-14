import PageLayout from "@/components/page-layout";

const parent = "/admin";

const links = [
  { label: "Users", href: parent },
  { label: "Projects Settings", href: `${parent}/projects-settings` },
  { label: "Documents Settings", href: `${parent}/documents-settings` },
  { label: "Suppliers Settings", href: `${parent}/suppliers-settings` },
  { label: "Clients Settings", href: `${parent}/clients-settings` },
  { label: "Items Settings", href: `${parent}/items-settings` },
  { label: "Contacts Settings", href: `${parent}/contacts-settings` },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout title="Admin" sidenavLinks={links}>
      {children}
    </PageLayout>
  );
}

export default AdminLayout;
