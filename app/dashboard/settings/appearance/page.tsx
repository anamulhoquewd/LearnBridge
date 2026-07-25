import { ThemeSelector } from "@/components/theme-selector"
import { Card, CardContent } from "@/components/ui/card"

export default function SettingsAppearancePage() {

  return (
    <Card className={"[--card-spacing:--spacing(8)]"}>
      <CardContent>
        <ThemeSelector />
      </CardContent>
    </Card>
  )
}
