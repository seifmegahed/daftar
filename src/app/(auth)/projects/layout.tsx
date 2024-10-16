import { getProjectsCount } from "@/server/db/tables/project/queries";
import PageLayout from "@/components/page-layout";

export const dynamic = "force-dynamic";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const [numberOfProjects, error] = await getProjectsCount();
  if (error !== null)
    return <div>Something went wrong. Please try again later.</div>;

  const sidebarNavItems = [
    {
      title: "All Projects",
      href: "/projects",
      amount: numberOfProjects,
    },
    {
      title: "New Project",
      href: "/projects/new-project",
    },
  ];

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
