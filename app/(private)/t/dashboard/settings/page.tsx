import { ProfileForm } from "@/components/profile-form"
import { Card, CardContent } from "@/components/ui/card"

export default function SettingsProfilePage() {
  return (
    <Card className={"[--card-spacing:--spacing(8)]"}>
      <CardContent>
        <ProfileForm />
      </CardContent>
    </Card>
  )
}
