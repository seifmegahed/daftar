import PageLayout from "@/components/page-layout";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Edit",
    href: "/settings/edit",
  },
  {
    title: "Preferences",
    href: "/settings/preferences",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <PageLayout
      title="Settings"
      description="Manage your settings."
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
