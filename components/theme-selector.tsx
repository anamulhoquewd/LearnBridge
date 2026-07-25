"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

type Theme = "light" | "dark" | "system"

export function ThemeSelector() {
  const { setTheme, theme } = useTheme()

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  // Apply theme to document
  const applyTheme = (selectedTheme: Theme) => {
    const htmlElement = document.documentElement
    let themeToApply = selectedTheme

    if (selectedTheme === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }

    htmlElement.classList.remove("light", "dark")
    htmlElement.classList.add(themeToApply)
  }

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-5 w-5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-5 w-5" /> },
    {
      value: "system",
      label: "System",
      icon: <Monitor className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Select the theme for the dashboard.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => handleThemeChange(t.value)}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 px-6 py-8 transition-all ${
              theme === t.value
                ? "border-primary bg-primary/5"
                : "border-transparent bg-muted hover:bg-muted/80"
            }`}
          >
            <div className="text-muted-foreground">{t.icon}</div>
            <span className="text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
