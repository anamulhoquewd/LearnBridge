import { SocialMediaConnections } from "@/components/social-media-connections"
import { Card, CardContent } from "@/components/ui/card"

export default function SettingsSocialsePage() {

  return (
    <Card className={"[--card-spacing:--spacing(8)]"}>
      <CardContent>
        <SocialMediaConnections />
      </CardContent>
    </Card>
  )
}
