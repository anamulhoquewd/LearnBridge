"use client"

import { BookingCard } from "@/components/booking-card"
import { BookingStatus, PaymentStatus } from "@/interfaces"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import api from "@/lib/axios/api"
import { ChevronDown, Filter, Search } from "lucide-react"
import { useMemo } from "react"

interface Booking {
  id: string
  tutor: {
    name: string
    avatar: string
    email: string
    tutorProfile: { avgRating: number; totalReviews: number; bio: string }
  }
  student: { name: string; email: string; avatar: string }
  subject: string
  dateTime: string
  duration: number
  price: number
  status: BookingStatus
  payment?: { status: PaymentStatus }
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviewOpen, setReviewOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<BookingStatus[]>([
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "REJECTED",
  ])
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus[]>([
    "PENDING",
    "PAID",
    "FAILED",
  ])

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.tutor.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter.includes(booking.status)
      const matchesPayment = booking.payment
        ? paymentFilter.includes(booking.payment.status)
        : true

      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [bookings, searchQuery, statusFilter, paymentFilter])

  async function handlePayment(bookingId: string) {
    // API call to Stripe checkout
    const res = await api.post("/payments/checkout", { bookingId })
    window.location.href = res.data.data.url
  }

  const toggleFilter = (filter: string, value: string) => {
    if (filter === "status") {
      setStatusFilter((prev) =>
        prev.includes(value as BookingStatus)
          ? prev.filter((s) => s !== value)
          : [...prev, value as BookingStatus]
      )
    } else if (filter === "payment") {
      setPaymentFilter((prev) =>
        prev.includes(value as PaymentStatus)
          ? prev.filter((p) => p !== value)
          : [...prev, value as PaymentStatus]
      )
    }
  }

  const activeFilters = statusFilter.length + paymentFilter.length
  const isFiltered = statusFilter.length < 4 || paymentFilter.length < 3

  useEffect(() => {
    async function fetchBookings() {
      const res = await api.get("/bookings")

      setBookings(res.data.data)
      setLoading(false)
    }
    fetchBookings()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Bookings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage and track all your tutoring sessions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by subject or tutor name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("PENDING")}
                  onCheckedChange={() => toggleFilter("status", "PENDING")}
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("CONFIRMED")}
                  onCheckedChange={() => toggleFilter("status", "CONFIRMED")}
                >
                  Confirmed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("COMPLETED")}
                  onCheckedChange={() => toggleFilter("status", "COMPLETED")}
                >
                  Completed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("REJECTED")}
                  onCheckedChange={() => toggleFilter("status", "REJECTED")}
                >
                  Rejected
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Payment Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Payment
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={paymentFilter.includes("PENDING")}
                  onCheckedChange={() => toggleFilter("payment", "PENDING")}
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={paymentFilter.includes("PAID")}
                  onCheckedChange={() => toggleFilter("payment", "PAID")}
                >
                  Paid
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={paymentFilter.includes("FAILED")}
                  onCheckedChange={() => toggleFilter("payment", "FAILED")}
                >
                  Failed
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter([
                    "PENDING",
                    "CONFIRMED",
                    "COMPLETED",
                    "REJECTED",
                  ])
                  setPaymentFilter(["PENDING", "PAID", "FAILED"])
                  setSearchQuery("")
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              No bookings found.{" "}
              <Link href="/tutors" className="font-bold hover:underline">
                Find a tutor
              </Link>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                tutor={booking.tutor}
                subject={booking.subject}
                dateTime={booking.dateTime}
                duration={booking.duration}
                price={booking.price}
                status={booking.status}
                payment={booking.payment}
                onPayment={handlePayment}
                onReview={() => setReviewOpen(true)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
