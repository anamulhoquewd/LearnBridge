"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Role } from "@prisma/client"
import {
  Calendar,
  DollarSign,
  GraduationCap,
  Home,
  Settings,
  Star,
} from "lucide-react"

export const tutorSidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "/tutor",
      icon: Home,
    },
    {
      title: "Bookings",
      url: "/tutor/bookings",
      icon: Calendar,
    },
    {
      title: "Reviews",
      url: "/tutor/reviews",
      icon: Star,
    },
    {
      title: "Earnings",
      url: "/tutor/earnings",
      icon: DollarSign,
    },
    {
      title: "Settings",
      url: "/tutor/settings",
      icon: Settings,
    },
  ],
}

export const studentSidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "/student",
      icon: Home,
    },
    {
      title: "My Bookings",
      url: "/student/bookings",
      icon: Calendar,
    },
    {
      title: "Find Tutors",
      url: "/tutors",
      icon: GraduationCap,
    },
    {
      title: "Settings",
      url: "/student/settings",
      icon: Settings,
    },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  profile: {
    role: Role
    name: string
    email: string
    avatar: string | null
  }
}

export function AppSidebar({ profile, ...props }: AppSidebarProps) {
  const sidebar = profile.role === "TUTOR" ? tutorSidebar : studentSidebar

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebar.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
