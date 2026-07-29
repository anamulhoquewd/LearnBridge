"use client"

import { Button } from "@/components/ui/button";
import api from "@/lib/axios/api";
import { useEffect, useState } from "react";

interface Booking {
  id: string
  subject: string
  dateTime: string
  duration: number
  price: number
  status: string
  student: { name: string; avatar: string | null }
}

// @TODO: components modify korte hobe.
// @TODO: api call modify korte hobe.
// @TODO: booking card a thaka student name a click korle studetn profile view kora jabe. ans same for tutro

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

  async function updateStatus(id: string, status: "CONFIRMED" | "REJECTED") {
    await api.patch(`/bookings/${id}`, { status })
    fetchBookings() // refresh list after update
  }

  if (loading) return <p>Loading...</p>

  const pending = bookings.filter((b) => b.status === "PENDING")
  const others = bookings.filter((b) => b.status !== "PENDING")

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div>
        <h2 className="mb-4 text-xl font-bold">Pending Requests</h2>
        {pending.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-semibold">{b.student.name}</p>
                  <p className="text-sm text-gray-600">
                    {b.subject} &middot; {new Date(b.dateTime).toLocaleString()}{" "}
                    &middot; {b.duration} min
                  </p>
                  <p className="text-sm text-gray-500">${b.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => updateStatus(b.id, "CONFIRMED")}>
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateStatus(b.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Booking History</h2>
        {others.length === 0 ? (
          <p className="text-gray-500">No past bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {others.map((b) => (
              <div key={b.id} className="rounded-lg border p-4">
                <p className="font-semibold">{b.student.name}</p>
                <p className="text-sm text-gray-600">
                  {b.subject} &middot; {new Date(b.dateTime).toLocaleString()}
                </p>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    b.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : b.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
