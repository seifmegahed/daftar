import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/nav"

const sidebarNavItems = [
  {
    title: "All Items",
    href: "/items",
  },
  {
    title: "New Item",
    href: "/items/new-item",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    // this should be in root layout, but we're doing it here for testing purposes
    <div className="bg-background -m-10 h-full min-h-[calc(100vh_-_theme(spacing.16))]">
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Items</h2>
          <p className="text-muted-foreground">
            Manage your items.
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