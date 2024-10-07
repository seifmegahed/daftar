import PageLayout from "@/components/page-layout";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Account",
    href: "/settings/account",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
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
