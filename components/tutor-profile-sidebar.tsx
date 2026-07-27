'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Globe, BookOpen, Award } from 'lucide-react';
import { Tutor } from "@/app/dashboard/tutors/page"

export function TutorProfileSidebar({ tutor }: { tutor: Tutor }) {
  // Sample data - replace with API data
  const qualifications = [
    "B.S. Mathematics",
    "M.S. Physics",
    "Teaching Certification",
  ]

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="size-4 shrink-0 text-primary" />
            <span className="break-all">{tutor?.user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="size-4 shrink-0 text-primary" />
            <span>"+1 (555) 123-4567"</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span>"San Francisco, CA"</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Globe className="size-4 shrink-0 text-primary" />
            Visit Website
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="size-4" />
            Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects.map((subject) => (
              <Badge key={subject} variant="secondary">
                {subject}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm font-semibold">{tutor.experience}</p>
          <p className="text-sm text-muted-foreground">{tutor.bio}</p>
        </CardContent>
      </Card>

      {/* Qualifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="size-4" />
            Qualifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {qualifications.map((qual) => (
              <li key={qual} className="flex items-start gap-2 text-sm">
                <span className="mt-1 text-primary">✓</span>
                <span>{qual}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
