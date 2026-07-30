import { StudentProfileForm } from "@/components/student-profile-form"
import { Card, CardContent } from "@/components/ui/card"

export default function SettingsProfilePage() {
  return (
    <Card className={"[--card-spacing:--spacing(8)]"}>
      <CardContent>
        <StudentProfileForm />
      </CardContent>
    </Card>
  )
}
