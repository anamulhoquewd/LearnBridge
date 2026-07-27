"use client"

import { TutorFilterBar } from "@/components/tutor-filter-bar"
import { TutorGridCard } from "@/components/tutor-grid-card"
import { TutorListCard } from "@/components/tutor-list-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tutor } from "@/interfaces"
import api from "@/lib/axios/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"

export default function TutorsPage() {
  const [loading, setLoading] = useState(true)
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [query, setQuery] = useState("")
  const [subjects, setSubjects] = useState<string[]>([])
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")

  const router = useRouter()

  const [debouncedQuery] = useDebounce(query, 500)

  async function fetchTutors(query = "", subjects: string[] = []) {
    setLoading(true)

    const params = new URLSearchParams()

    if (query.trim()) {
      params.set("q", query)
    }

    subjects.forEach((subject) => {
      params.append("subject", subject)
    })

    try {
      const res = await api.get(`/tutors?${params.toString()}`)

      setTutors(res.data.data)
    } finally {
      setLoading(false)
    }
  }
  const handleViewProfile = (id: string) => {
    // TODO: Navigate to tutor profile page
    console.log("View profile:", id)
    router.push(`/tutors/${id}`)
  }

  useEffect(() => {
    fetchTutors(debouncedQuery, subjects)
  }, [debouncedQuery, subjects])

  return (
    <>
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-6 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
              T
            </div>
            <span className="text-xl font-bold">TutorHub</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto my-4 mt-6">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Find a Tutor</h1>
            <p className="mt-2 text-muted-foreground">
              Browse and connect with experienced tutors in your subject
            </p>
          </div>

          {/* Filter Bar */}
          <TutorFilterBar
            onSearchChange={setQuery}
            onSubjectsChange={setSubjects}
            onViewChange={setCurrentView}
            currentView={currentView}
            currentSubjects={subjects}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Found {tutors.length} tutor
            {tutors.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Tutors Grid/List */}
        {loading ? (
          <div
            className={
              currentView === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={currentView === "list" ? "space-y-3" : ""}
              >
                <Skeleton
                  className={
                    currentView === "grid"
                      ? "h-60 w-full rounded-lg"
                      : "h-24 w-full"
                  }
                />
              </div>
            ))}
          </div>
        ) : tutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium">No tutors found</p>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filters to find a tutor
            </p>
          </div>
        ) : currentView === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <TutorGridCard
                key={tutor.id}
                {...tutor}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tutors.map((tutor) => (
              <TutorListCard
                key={tutor.id}
                {...tutor}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
