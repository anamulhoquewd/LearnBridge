import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingStatus } from "@prisma/client"
import { format } from "date-fns"
import { Calendar, Clock } from "lucide-react"
import { StatusBadge } from "../status-badge"

interface BookingCardProps {
  id: string
  name: string
  avatar?: string
  subject: string
  date: Date
  time: Date
  status: BookingStatus
  actionLabel?: string
  onAction: (id: string, status: BookingStatus) => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

export function BookingCard({
  name,
  id,
  avatar,
  subject,
  date,
  time,
  status,
  actionLabel,
  onAction,
  secondaryActionLabel,
}: BookingCardProps) {
  const getInitials = (text: string) => {
    return text
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{subject}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>{format(date, "PP")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4" />
            <span>{format(time, "hh:mm")}</span>
          </div>
        </div>
        {(actionLabel || secondaryActionLabel) && (
          <div className="flex gap-2 pt-2">
            {actionLabel && (
              <Button
                size="sm"
                onClick={() => onAction(id, status)}
                className="flex-1"
              >
                {actionLabel}
              </Button>
            )}
            {secondaryActionLabel && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction(id, status)}
                className="flex-1"
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
