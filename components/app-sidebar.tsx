"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// lib/sidebar-config.ts

import { loggedInUserProfile } from "@/lib/auth"
import {
  Calendar,
  DollarSign,
  GraduationCap,
  Home,
  Settings,
  Star,
  User
} from "lucide-react"

export const tutorSidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "/t/dashboard",
      icon: Home,
    },
    {
      title: "Bookings",
      url: "/t/dashboard/bookings",
      icon: Calendar,
    },
    {
      title: "Reviews",
      url: "/t/dashboard/reviews",
      icon: Star,
    },
    {
      title: "Earnings",
      url: "/t/dashboard/earnings",
      icon: DollarSign,
    },
    {
      title: "Settings",
      url: "/t/dashboard/settings",
      icon: Settings,
    },
  ],
}

export const studentSidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "/s/dashboard",
      icon: Home,
    },
    {
      title: "My Bookings",
      url: "/s/dashboard/bookings",
      icon: Calendar,
    },
    {
      title: "Find Tutors",
      url: "/tutors",
      icon: GraduationCap,
    },
    {
      title: "Settings",
      url: "/s/dashboard/settings",
      icon: Settings,
    },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  profile: {
    role: "TUTOR" | "STUDENT"
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
