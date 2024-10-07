import { getSuppliersCountAction } from "@/server/actions/suppliers/read";
import PageLayout from "@/components/page-layout";

export const dynamic = "force-dynamic";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const [numberOfSuppliers] = await getSuppliersCountAction();

  const sidebarNavItems = [
    {
      title: "All Suppliers",
      href: "/suppliers",
      amount: numberOfSuppliers ?? 0,
    },
    {
      title: "New Supplier",
      href: "/suppliers/new-supplier",
    },
  ];
  return (
    
            <PageLayout
              title="Suppliers"
              description="Manage your suppliers."
              navLinks={sidebarNavItems}
            >
              {children}
            </PageLayout>
    
  );
}
