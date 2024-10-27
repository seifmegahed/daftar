import PageLayout from "@/components/page-layout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const sidebarNavItems = [
  {
    title: "All Projects",
    href: "/projects",
  },
  {
    title: "New Project",
    href: "/projects/new-project",
  },
];

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <PageLayout
      title="Projects"
      description="Manage your projects"
      navLinks={sidebarNavItems}
    >
      {children}
    </PageLayout>
  );
}
