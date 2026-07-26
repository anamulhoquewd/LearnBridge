import { AppSidebar } from "@/components/app-sidebar"
import { HeaderComponent } from "@/components/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import { Suspense } from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <HeaderComponent />
          <main className="flex-1 flex-col p-4 overflow-auto">
            <Suspense>{children}</Suspense>
          </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
