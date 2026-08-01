"use client"

import { BookingCardSkeleton } from "@/components/booking-card-sekeleton"
import { BookingCard } from "@/components/student/booking-card"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/lib/axios/api"
import { BookingStatus } from "@prisma/client"
import { useEffect, useState } from "react"

interface Booking {
  id: string
  subject: string
  dateTime: string
  duration: number
  price: number
  status: BookingStatus
  student: { name: string; avatar: string | null }
}
export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    setLoading(true)
    const res = await api.get("/bookings")
    setBookings(res.data.data)
    setLoading(false)
  }

  async function updateStatus(id: string, status: BookingStatus) {
    try {
      await api.patch(`/bookings/${id}`, { status })
      fetchBookings()
    } catch (error: any) {
      console.error("Error: ", error)
      throw new Error(error)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Booking Requests</h2>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Sessions</h2>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const requests = bookings.filter((b) => b.status === "PENDING")
  const others = bookings.filter((b) => b.status !== "PENDING")

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Pending Requests */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Booking Requests</h2>
        {requests.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                id={booking.id}
                key={booking.id}
                name={booking.student.name}
                subject={booking.subject}
                date={new Date(booking.dateTime)}
                time={new Date(booking.dateTime)}
                status={booking.status}
                actionLabel={"Accept"}

                secondaryActionLabel={"Decline"}
                onAction={updateStatus}
                onSecondaryAction={() =>
                  console.log("Secondary action clicked for", booking.id)
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
        {others.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const actionLabel =
                booking.status === "CONFIRMED"
                  ? "Start Session"
                  : booking.status === "REJECTED" ||
                      booking.status === "CANCELLED"
                    ? "View Details"
                    : undefined

              return (
                <BookingCard
                  id={booking.id}
                  key={booking.id}
                  name={booking.student.name}
                  subject={booking.subject}
                  date={new Date(booking.dateTime)}
                  time={new Date(booking.dateTime)}
                  status={booking.status}
                  actionLabel={actionLabel}
                  onAction={() => console.log("Cooming soon!")}
                  onSecondaryAction={() =>
                    console.log("Secondary action clicked for", booking.id)
                  }
                />
              )
            })}
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
  )
}
