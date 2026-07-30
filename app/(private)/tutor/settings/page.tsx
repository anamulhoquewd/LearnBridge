import { TutorProfileForm } from "@/components/tutor-profile-form"
import { Card, CardContent } from "@/components/ui/card"

export default function SettingsProfilePage() {
  return (
    <Card className={"[--card-spacing:--spacing(8)]"}>
      <CardContent>
        <TutorProfileForm />
      </CardContent>
    </Card>
  )
}
