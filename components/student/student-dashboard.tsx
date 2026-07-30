"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, User } from "lucide-react"
import { StatCard } from "../stat-card"
import { BookingCard } from "./booking-card"

const mockStats = [
  {
    icon: <BookOpen className="size-5 text-primary" />,
    label: "Active Sessions",
    value: 3,
    description: "Sessions this month",
  },
  {
    icon: <Clock className="size-5 text-primary" />,
    label: "Total Hours",
    value: 24,
    description: "Hours completed",
  },
  {
    icon: <User className="size-5 text-primary" />,
    label: "Tutors",
    value: 2,
    description: "Active tutors",
  },
]

const mockBookings = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: undefined,
    subject: "Mathematics",
    date: new Date(2026, 6, 30),
    time: new Date(),
    status: "CONFIRMED" as const,
    actionLabel: "Start Session",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: undefined,
    subject: "Physics",
    date: new Date(2026, 7, 2),
    time: new Date(),
    status: "PENDING" as const,
    actionLabel: "Confirm",
    secondaryActionLabel: "Cancel",
  },
  {
    id: "3",
    name: "Emma Davis",
    avatar: undefined,
    subject: "English",
    date: new Date(2026, 7, 5),
    time: new Date(),
    status: "REJECTED" as const,
    actionLabel: "View Details",
  },
]

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, Alex!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's your tutoring overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {mockStats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>

      {/* Bookings Section */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Your Sessions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockBookings.map((booking) => (
            <BookingCard
            id={booking.id}
              key={booking.id}
              name={booking.name}
              subject={booking.subject}
              date={booking.date}
              time={booking.time}
              status={booking.status}
              actionLabel={booking.actionLabel}
              secondaryActionLabel={booking.secondaryActionLabel}
              onAction={() => console.log("Action clicked for", booking.id)}
              onSecondaryAction={() =>
                console.log("Secondary action clicked for", booking.id)
              }
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Explore nearby tutors and book sessions
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
