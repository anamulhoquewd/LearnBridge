"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GitBranchPlus, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-16 text-center md:px-6 md:py-24">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Connect with Expert Tutors
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Find qualified tutors for any subject or become a tutor and share
              your expertise with students.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="mt-12 grid w-full max-w-2xl gap-6 md:grid-cols-2">
            {/* Student Card */}
            <Link href="/student">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <BookOpen className="mb-2 size-8 text-primary" />
                  <CardTitle>I&apos;m Looking for a Tutor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Find experienced tutors in your subject, schedule sessions
                    at your convenience, and improve your skills.
                  </p>
                  <Button className="w-full">Get Started as Student</Button>
                </CardContent>
              </Card>
            </Link>

            {/* Tutor Card */}
            <Link href="/tutor">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Users className="mb-2 size-8 text-primary" />
                  <CardTitle>I Want to Be a Tutor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Share your knowledge, build your student base, and earn
                    money on your own schedule.
                  </p>
                  <Button className="w-full">Start as Tutor</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-6 text-center text-sm text-muted-foreground md:px-6">
          <p>&copy; 2026 LearnBridge. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href={"https://github.com/anamulhoquewd/LearnBridge"}>
              <Image
                width={20}
                height={20}
                alt="github"
                src={"/github-logo.svg"}
              />
            </Link>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
