"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"
import { TutorGridCardProps } from "./tutor-grid-card"

export function TutorListCard({
  id,
  user: { name, avatar },
  subjects,
  hourlyRate,
  avgRating,
  totalReviews,
  onViewProfile,
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
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div>
              <Avatar className="size-12">
                <AvatarImage
                  src={avatar || "https://i.pravatar.cc/150?img=10"}
                  alt={name}
                />
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
              {avgRating > 0 && (
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({totalReviews})
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold">{name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                ${hourlyRate}/hour
              </p>
            </div>
          </div>
          {avgRating > 0 && (
            <div className="flex items-center justify-center gap-1 text-sm">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({totalReviews})</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <Badge key={subject} variant="secondary">
              {subject}
            </Badge>
          ))}
        </div>
        <Button onClick={() => onViewProfile(id)} className="w-full">
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}
