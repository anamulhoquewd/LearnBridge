"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign, Users } from "lucide-react"
import { StatCard } from "../stat-card"
import { BookingCard } from "../student/booking-card"

const mockStats = [
  {
    icon: <DollarSign className="size-5 text-primary" />,
    label: "Monthly Earnings",
    value: "$1,240",
    description: "From 12 sessions",
  },
  {
    icon: <Clock className="size-5 text-primary" />,
    label: "Hours This Month",
    value: 18,
    description: "Hours tutored",
  },
  {
    icon: <Users className="size-5 text-primary" />,
    label: "Active Students",
    value: 5,
    description: "Currently tutoring",
  },
]

const mockRequests = [
  {
    id: "1",
    name: "James Wilson",
    avatar: undefined,
    subject: "Mathematics - Calculus",
    date: new Date(2026, 6, 28),
    time: new Date(),
    status: "PENDING" as const,
    actionLabel: "Accept",
    secondaryActionLabel: "Decline",
  },
  {
    id: "2",
    name: "Lisa Anderson",
    avatar: undefined,
    subject: "Physics - Mechanics",
    date: new Date(2026, 6, 30),
    time: new Date(),
    status: "PENDING" as const,
    actionLabel: "Accept",
    secondaryActionLabel: "Decline",
  },
]

const mockUpcoming = [
  {
    id: "3",
    name: "Marcus Brown",
    avatar: undefined,
    subject: "English Literature",
    date: new Date(2026, 7, 2),
    time: new Date(),
    status: "CONFIRMED" as const,
    actionLabel: "Start Session",
  },
  {
    id: "4",
    name: "Sofia Garcia",
    avatar: undefined,
    subject: "Spanish Conversation",
    date: new Date(2026, 7, 3),
    time: new Date(),
    status: "CONFIRMED" as const,
    actionLabel: "Start Session",
  },
]

export function TutorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, Dr. Sarah!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's your tutoring dashboard
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Requests */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Booking Requests</h2>
          {mockRequests.length > 0 ? (
            <div className="space-y-4">
              {mockRequests.map((request) => (
                <BookingCard
                  id={request.id}
                  key={request.id}
                  name={request.name}
                  subject={request.subject}
                  date={request.date}
                  time={request.time}
                  status={request.status}
                  actionLabel={request.actionLabel}
                  secondaryActionLabel={request.secondaryActionLabel}
                  onAction={() => console.log("Accept clicked for", request.id)}
                  onSecondaryAction={() =>
                    console.log("Decline clicked for", request.id)
                  }
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No pending requests</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Sessions</h2>
          {mockUpcoming.length > 0 ? (
            <div className="space-y-4">
              {mockUpcoming.map((session) => (
                <BookingCard
                id = {session.id}
                  key={session.id}
                  name={session.name}
                  subject={session.subject}
                  date={session.date}
                  time={session.time}
                  status={session.status}
                  actionLabel={session.actionLabel}
                  onAction={() =>
                    console.log("Start session clicked for", session.id)
                  }
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No upcoming sessions</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rating</span>
            <Badge variant="default">4.9 / 5.0</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Response Rate</span>
            <Badge variant="outline">95%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total Sessions
            </span>
            <span className="font-semibold">127</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
