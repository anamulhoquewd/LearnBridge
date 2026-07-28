"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tutor } from "@/interfaces"
import { Star } from "lucide-react"
import VerifiedBadge from "./verified-badge"
import { BookNowButton } from "./book-now-button"

export interface TutorGridCardProps extends Tutor {
  onViewProfile: (id: string) => void
}

export function TutorGridCard({
  id,
  user: { name, avatar },
  subjects,
  hourlyRate,
  avgRating,
  totalReviews,
  onViewProfile,
  userId,
}: TutorGridCardProps) {
  const getInitials = (text: string) => {
    return text
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="relative flex flex-col transition-shadow hover:shadow-lg">
      <CardHeader className="flex justify-between">
        <div className="flex items-start gap-4">
          <div className="space-y-2">
            <Avatar className="size-16">
              <AvatarImage src={avatar || ""} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            {avgRating > 0 && (
              <div className="flex items-center justify-center gap-1 text-sm">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{avgRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({totalReviews})</span>
              </div>
            )}
          </div>
          <div className="mt-2.5">
            <h3 className="line-clamp-2 font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">${hourlyRate}/hour</p>
            <p className="mt-2 line-clamp-2 text-sm">
              relative flex flex-col transition-shadow hover:shadow-lg relative
              flex flex-col transition-shadow hover:shadow-lg
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        <div className="flex flex-wrap justify-center gap-1">
          {subjects.slice(0, 2).map((subject) => (
            <Badge key={subject} variant="secondary" className="text-xs">
              {subject}
            </Badge>
          ))}
          {subjects.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{subjects.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button onClick={() => onViewProfile(id)} variant="outline">
            View Profile
          </Button>
          {/* CTA Button */}
          <BookNowButton
            tutorId={userId}
            tutorName={name}
            subjects={subjects}
            hourlyRate={hourlyRate}
          />
        </div>
      </CardContent>
      <VerifiedBadge className="top-1/30 right-1/30" />
    </Card>
  )
}
