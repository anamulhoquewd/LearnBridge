import { TutorProfileHeader } from "@/components/tutor-profile-header"
import { TutorProfileSidebar } from "@/components/tutor-profile-sidebar"
import { TutorReviewsSection } from "@/components/tutor-reviews-section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { Clock, Users } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!tutor) return notFound()

  const reviews = await prisma.review.findMany({
    where: { booking: { tutorId: tutor.userId } },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 md:px-6">
          <Image
            width={120}
            height={120}
            alt="LearnBridge"
            src={"/logo/learnbridge_bold_stacked.svg"}
          />
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

      <div className="min-h-screen bg-background">
        <main className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
          {/* Profile Header */}
          <TutorProfileHeader tutor={tutor} />

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Sidebar */}
            <div className="lg:col-span-1">
              <TutorProfileSidebar tutor={tutor} />
            </div>

            {/* Right Column - Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    With over 8 years of tutoring experience, I&apos;ve helped
                    hundreds of students achieve their academic goals and
                    develop a genuine love for learning. My teaching philosophy
                    centers on personalized instruction, patience, and making
                    complex concepts accessible and engaging.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    I specialize in mathematics and physics, working with
                    students from high school through college level. Whether
                    you&apos;re struggling with fundamental concepts or aiming
                    for advanced proficiency, I tailor my approach to your
                    specific learning style and goals.
                  </p>
                </CardContent>
              </Card>

              {/* Teaching Approach */}
              <Card>
                <CardHeader>
                  <CardTitle>My Teaching Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">→</span>
                      <div>
                        <p className="text-sm font-semibold">
                          Personalized Learning Plans
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          I assess your current level and create a customized
                          curriculum tailored to your goals and learning pace.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">→</span>
                      <div>
                        <p className="text-sm font-semibold">
                          Interactive Problem-Solving
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          We work through problems together, building your
                          confidence and mastery step by step.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">→</span>
                      <div>
                        <p className="text-sm font-semibold">
                          Real-World Applications
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          I connect abstract concepts to real-world scenarios to
                          enhance understanding and retention.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">→</span>
                      <div>
                        <p className="text-sm font-semibold">
                          Flexible Scheduling
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Sessions available throughout the week, with options
                          for online or in-person tutoring.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability & Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="size-4 text-primary" />
                        <span className="font-medium">Session Duration</span>
                      </div>
                      <p className="ml-6 text-sm text-muted-foreground">
                        30-120 minutes
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="size-4 text-primary" />
                        <span className="font-medium">Session Type</span>
                      </div>
                      <div className="ml-6 flex gap-2">
                        <Badge variant="secondary">One-on-One</Badge>
                        <Badge variant="secondary">Group</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <p className="mb-3 text-sm font-semibold">
                      Available Times
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Monday - Friday</p>
                        <p className="font-medium">3:00 PM - 9:00 PM</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Saturday - Sunday
                        </p>
                        <p className="font-medium">10:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Flexible scheduling available upon request. Contact me to
                    arrange a time that works best for you.
                  </p>
                </CardContent>
              </Card>

              {/* Reviews */}
              <TutorReviewsSection reviews={reviews} />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
