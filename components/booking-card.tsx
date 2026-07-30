"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookingStatus, PaymentStatus } from "@/interfaces"
import {
  Calendar,
  Clock,
  DollarSign,
  MessageCircle,
  MoreVertical,
  Star,
} from "lucide-react"
import Image from "next/image"
import { ReviewFormButton } from "./review-form-button"

interface BookingCardProps {
  id: string
  subject: string
  dateTime: string
  duration: number
  price: number
  status: BookingStatus
  tutor: {
    name: string
    avatar: string
    email: string
    tutorProfile: { avgRating: number; totalReviews: number; bio: string }
  }
  payment?: { status: PaymentStatus; id?: string; amount?: number }
  onPayment?: (bookingId: string) => void
  onReschedule?: (bookingId: string) => void
  onCancel?: (bookingId: string) => void
  onMessage?: (bookingId: string) => void
  onReview?: (bookingId: string) => void
}
const STATUS_CONFIG = {
  PENDING: {
    bg: "bg-status-pending-bg",
    badge: "bg-status-pending-bg text-status-pending border-status-pending/30",
    border: "border-status-pending/30",
  },
  CONFIRMED: {
    bg: "bg-status-confirmed-bg",
    badge:
      "bg-status-confirmed-bg text-status-confirmed border-status-confirmed/30",
    border: "border-status-confirmed/30",
  },
  REJECTED: {
    bg: "bg-status-rejected-bg",
    badge:
      "bg-status-rejected-bg text-status-rejected border-status-rejected/30",
    border: "border-status-rejected/30",
  },
  COMPLETED: {
    bg: "bg-status-completed-bg",
    badge:
      "bg-status-completed-bg text-status-completed border-status-completed/30",
    border: "border-status-completed/30",
  },
  CANCELLED: {
    bg: "bg-status-cancelled-bg",
    badge:
      "bg-status-cancelled-bg text-status-cancelled border-status-cancelled/30",
    border: "border-status-cancelled/30",
  },
} as const

export function BookingCard({
  id,
  subject,
  dateTime,
  duration,
  price,
  status,
  tutor,
  payment,
  onPayment,
  onReschedule,
  onCancel,
  onMessage,
  onReview,
}: BookingCardProps) {
  const tutorRating = tutor.tutorProfile.avgRating ?? 4.8
  const tutorReviews = tutor.tutorProfile.totalReviews ?? 127
  const config = STATUS_CONFIG[status]
  const date = new Date(dateTime)
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${config.border} ${config.bg}`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
        >
          {status}
        </span>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Tutor Section */}
        <div className="mb-6 flex items-start gap-4">
          {/* Avatar */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-blue-400 to-purple-500">
            {tutor.avatar ? (
              <Image
                src={tutor.avatar}
                alt={tutor.name}
                width={1000}
                height={1000}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold">
                {tutor.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Tutor Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{tutor.name}</h3>
            <div className="flex items-center gap-1 text-sm">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(tutorRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{tutorRating}</span>
              <span className="">({tutorReviews})</span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="mb-6 space-y-3 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2">
              <Calendar size={16} className="" />
            </div>
            <div>
              <p className="text-xs">Date & Time</p>
              <p className="font-semibold">
                {formattedDate} at {formattedTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2">
              <Clock size={16} className="" />
            </div>
            <div>
              <p className="text-xs">Subject & Duration</p>
              <p className="font-semibold">
                {subject} &middot; {duration} min
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2">
              <DollarSign size={16} className="" />
            </div>
            <div>
              <p className="text-xs">Price</p>
              <p className="font-semibold">${price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        {payment?.status && (
          <div className="mb-4 rounded-lg px-3 py-2 text-center text-xs font-medium">
            Payment Status:{" "}
            <span className="font-semibold capitalize">{payment.status}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {status === "CONFIRMED" && payment?.status !== "PAID" && (
            <Button
              onClick={() => onPayment?.(id)}
              className="flex-1"
              size="sm"
            >
              Pay Now
            </Button>
          )}

          <div>
            <Button
              onClick={() => onMessage?.(id)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <MessageCircle size={16} className="mr-2" />
              Message
            </Button>

            {status === "CONFIRMED" && payment?.status === "PAID" && (
              <ReviewFormButton bookingId={id}>
                <Button>
                  <Star size={16} className="mr-2" />
                  Write review
                </Button>
              </ReviewFormButton>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="px-2">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {status === "PENDING" || status === "CONFIRMED" ? (
                <>
                  <DropdownMenuItem onClick={() => onReschedule?.(id)}>
                    <Calendar size={14} className="mr-2" />
                    Reschedule
                  </DropdownMenuItem>
                  {(payment?.status === "PENDING" ||
                    payment?.status === undefined) && (
                    <DropdownMenuItem onClick={() => onCancel?.(id)}>
                      Cancel Booking
                    </DropdownMenuItem>
                  )}
                </>
              ) : (
                <DropdownMenuItem disabled>
                  No actions available
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
