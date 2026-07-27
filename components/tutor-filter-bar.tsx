"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SUBJECT_OPTIONS } from "@/lib/constant"
import { Grid3x3, List, Search, Settings2 } from "lucide-react"
import { useCallback, useState } from "react"

interface TutorFilterBarProps {
  onSearchChange: (query: string) => void
  onSubjectsChange: (subjects: string[]) => void
  onViewChange: (view: "grid" | "list") => void
  currentView: "grid" | "list"
  currentSubjects: string[]
}

export function TutorFilterBar({
  onSearchChange,
  onSubjectsChange,
  onViewChange,
  currentView,
  currentSubjects,
}: TutorFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Debounced search handler
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      onSearchChange(value)
    },
    [onSearchChange]
  )

  const handleSubjectToggle = (subject: string) => {
    const updated = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject]
    onSubjectsChange(updated)
  }

  const isGrid = currentView === "grid"

  return (
    <div className="w-full space-y-4">
      {/* Top Filter Row */}
      <div className="flex flex-col items-end gap-3">
        {/* Search */}
        <div className="relative w-full flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tutors..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          {/* Subject Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-7 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted">
              <Filter className="size-4" />
              Subjects
              {currentSubjects.length > 0 && (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {currentSubjects.length}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Select Subjects</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  {SUBJECT_OPTIONS.map((subject) => (
                    <DropdownMenuCheckboxItem
                      key={subject}
                      checked={currentSubjects.includes(subject)}
                      onCheckedChange={() => handleSubjectToggle(subject)}
                    >
                      {subject}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Advanced Filter Button (UI only) */}
          <Button variant="ghost" size="icon" title="Advanced filters">
            <Settings2 className="size-4" />
          </Button>

          {/* View Toggle */}
          <div className="flex gap-1 rounded-lg border border-border p-1">
            <Button
              variant={isGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(isGrid ? "list" : "grid")}
              title={isGrid ? "List view" : "Grid view"}
            >
              {isGrid ? (
                <Grid3x3 className="size-4" />
              ) : (
                <List className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {currentSubjects.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {currentSubjects.map((subject) => (
            <Badge
              key={subject}
              variant="secondary"
              className="cursor-pointer gap-1 hover:opacity-80"
              onClick={() => handleSubjectToggle(subject)}
            >
              {subject}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// Helper component for Filter icon
function Filter({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
