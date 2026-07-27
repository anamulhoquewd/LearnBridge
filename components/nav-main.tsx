import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type LucideIcon } from "lucide-react"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton>
                  <item.icon />
                  {item.title}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ) )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
