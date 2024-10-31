import PageLayout from "@/components/page-layout";

const parent = "/admin";

const links = [
  { title: "Users", href: parent },
  { title: "New User", href: `${parent}/new-user` },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout
      title="Admin"
      description="Manage your admin account"
      navLinks={links}
    >
      {children}
    </PageLayout>
  );
}

export default AdminLayout;
