import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function BookingCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

