'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Globe, BookOpen, Award } from 'lucide-react';

export function TutorProfileSidebar() {
  // Sample data - replace with API data
  const tutor = {
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://sarahjohnsontutoring.com',
    subjects: ['Mathematics', 'Physics', 'Calculus', 'Algebra'],
    experience: '8+ years',
    qualifications: ['B.S. Mathematics', 'M.S. Physics', 'Teaching Certification'],
    bio: 'Passionate educator dedicated to helping students master complex concepts. My approach focuses on breaking down difficult topics into manageable, understandable pieces while maintaining student engagement.',
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="size-4 text-primary shrink-0" />
            <span className="break-all">{tutor.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="size-4 text-primary shrink-0" />
            <span>{tutor.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>{tutor.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Globe className="size-4 text-primary shrink-0" />
            <a href={tutor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Visit Website
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
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
          <p className="text-sm font-semibold mb-3">{tutor.experience}</p>
          <p className="text-sm text-muted-foreground">{tutor.bio}</p>
        </CardContent>
      </Card>

      {/* Qualifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="size-4" />
            Qualifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tutor.qualifications.map((qual) => (
              <li key={qual} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-1">✓</span>
                <span>{qual}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
