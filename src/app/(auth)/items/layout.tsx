import { getItemsCountAction } from "@/server/actions/items/read";
import PageLayout from "@/components/page-layout";

export const dynamic = "force-dynamic";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const [numberOfItems] = await getItemsCountAction();

  const sidebarNavItems = [
    {
      title: "All Items",
      href: "/items",
      amount: numberOfItems ?? 0,
    },
    {
      title: "New Item",
      href: "/items/new-item",
    },
  ];
  return (
    <PageLayout
      title="Items"
      description="Manage your items."
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
