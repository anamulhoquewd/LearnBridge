'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Users, Clock } from 'lucide-react';

interface TutorProfileHeaderProps {
  tutorId?: string;
}

export function TutorProfileHeader({ tutorId = '1' }: TutorProfileHeaderProps) {
  // Sample tutor data - replace with API data
  const tutor = {
    id: tutorId,
    name: 'Sarah Johnson',
    title: 'Mathematics & Physics Expert',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    isVerified: true,
    rating: 4.9,
    reviewCount: 156,
    studentsCount: 342,
    totalHours: 2840,
    hourlyRate: 45,
    bio: 'Passionate educator with 8+ years of experience teaching mathematics and physics to students from high school through college level. I specialize in making complex concepts simple and engaging.',
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-liner-to-r from-primary/5 to-primary/10 -mx-6 -mt-6 mb-8 px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="size-28 border-4 border-background shadow-lg">
              <AvatarImage src={tutor.avatar} alt={tutor.name} />
              <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            {tutor.isVerified && (
              <div className="absolute bottom-0 right-0 bg-background rounded-full p-1">
                <CheckCircle className="size-6 text-primary fill-primary" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{tutor.name}</h1>
              {tutor.isVerified && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="size-3" />
                  Verified
                </Badge>
              )}
            </div>

            <p className="text-lg text-muted-foreground mb-3">{tutor.title}</p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.floor(tutor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold ml-1">{tutor.rating}</span>
                <span className="text-sm text-muted-foreground">({tutor.reviewCount} reviews)</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button size="lg" className="gap-2">
              Book a Session
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">${tutor.hourlyRate}</div>
                <div className="text-xs text-muted-foreground mt-1">per hour</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  <Users className="size-5" />
                  {tutor.studentsCount}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  <Clock className="size-5" />
                  {tutor.totalHours}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Hours</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
