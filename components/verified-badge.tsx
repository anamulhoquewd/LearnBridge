import { cn } from "@/lib/utils"
import { BadgeCheck } from "lucide-react"
import { Badge } from "./ui/badge"

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        "absolute top-0 right-0 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
        className
      )}
      variant="secondary"
    >
      <BadgeCheck data-icon="inline-start" />
      Verified
    </Badge>
  )
}

export default VerifiedBadge
