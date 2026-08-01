"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReviewWithAuthor } from "@/interfaces"
import { Star } from "lucide-react"

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`size-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  )
}

export function TutorReviewsSection({
  reviews,
}: {
  reviews: ReviewWithAuthor[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Reviews ({reviews.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="size-10 shrink-0">
                  <AvatarImage
                    src={review.author.avatar || ""}
                    alt={review.author.name}
                  />
                  <AvatarFallback>
                    {review.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {/* Review Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold">
                        {review.author.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toISOString()}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>

                  {/* Subject Badge */}
                  {/* <div className="mb-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {review.subject}
                    </span>
                  </div> */}

                  {/* Review Text */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
