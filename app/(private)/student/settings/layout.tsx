import { Card, CardContent } from "@/components/ui/card"
import { generateMeta } from "@/lib/utils"
import { Metadata } from "next"
import { SidebarNav } from "@/components/settings-sidebar-nav"

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Settings Page",
    description:
      "Manage your account settings, update your profile, and customize your preferences easily.",
  })
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/student/settings",
  },
  {
    title: "Socials",
    href: "/student/settings/socials",
  },
  {
    title: "Appearance",
    href: "/student/settings/appearance",
  },
  {
    title: "Change Password",
    href: "#",
  },
  {
    title: "Notifications",
    href: "#",
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="m-auto mb-8 space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="max-w-2/3 text-muted-foreground">
          Configure your system preferences, manage team permissions, set up
          integrations, and view API keys directly from your dashboard settings.
        </p>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="lg:w-1/5">
          <Card className={"[--card-spacing:--spacing(4)]"}>
            <CardContent>
              <SidebarNav items={sidebarNavItems} />
            </CardContent>
          </Card>
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </>
  )
}
