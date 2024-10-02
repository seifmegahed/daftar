import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/nav"
import { getProjectsCount } from "@/server/db/tables/project/queries"


interface SettingsLayoutProps {
  children: React.ReactNode
} 

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const [numberOfProjects, error] = await getProjectsCount()
  if (error !== null) return <div>Something went wrong. Please try again later.</div>
  
  const sidebarNavItems = [
    {
      title: "All Projects",
      href: "/projects",
      amount: numberOfProjects
    },
    {
      title: "New Project",
      href: "/projects/new-project",
    },
  ]

  return (
    // this should be in root layout, but we're doing it here for testing purposes
    <div className="bg-background -m-10 h-full min-h-[calc(100vh_-_theme(spacing.16))]">
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your projects.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </div>
  )
}