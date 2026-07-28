import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tutor } from "@/interfaces"
import { Clock, Star, Users } from "lucide-react"
import VerifiedBadge from "./verified-badge"
import { BookNowButton } from "./book-now-button"

export function TutorProfileHeader({ tutor }: { tutor: Tutor }) {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-liner-to-r relative -mx-6 -mt-6 mb-8 from-primary/5 to-primary/10 px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          {/* Avatar */}
          <Avatar className="size-28 border-4 border-background shadow-lg">
            <AvatarImage
              src={tutor?.user?.avatar || ""}
              alt={tutor?.user.name}
            />
            <AvatarFallback>
              {tutor?.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 pt-2">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold md:text-4xl">
                {tutor?.user.name}
              </h1>
              {true && <VerifiedBadge className="static" />}
            </div>

            <p className="mb-3 text-lg text-muted-foreground">{tutor?.bio}</p>

            {/* Rating */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.floor(tutor?.avgRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="ml-1 font-semibold">{tutor?.avgRating}</span>
                <span className="text-sm text-muted-foreground">
                  ({tutor?.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <BookNowButton
              tutorId={tutor.userId}
              tutorName={tutor.user.name}
              subjects={tutor.subjects}
              hourlyRate={tutor.hourlyRate}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid w-full grid-cols-3 gap-4 md:w-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">${tutor?.hourlyRate}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  per hour
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <Users className="size-5" />
                  {98}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Students
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <Clock className="size-5" />
                  {148}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Hours</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
