'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tutorProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal('')),
  hourlyRate: z.coerce.number().min(10, 'Rate must be at least $10'),
  yearsOfExperience: z.coerce.number().min(0, 'Experience cannot be negative'),
  bio: z.string().optional().or(z.literal('')),
});

type TutorProfileFormData = z.infer<typeof tutorProfileSchema>;

interface TutorProfileProps {
  initialData?: {
    name: string;
    email: string;
    phone?: string;
    subjects: string[];
    hourlyRate: number;
    bio?: string;
    yearsOfExperience: number;
    verified: boolean;
    avatar?: string;
    createdAt: Date;
  };
}

const defaultSubjects = ['Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'History'];

export function TutorProfile({ initialData }: TutorProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialData?.subjects || []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TutorProfileFormData>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      name: initialData?.name || 'Dr. Sarah Johnson',
      email: initialData?.email || 'sarah@example.com',
      phone: initialData?.phone || '',
      hourlyRate: initialData?.hourlyRate || 50,
      yearsOfExperience: initialData?.yearsOfExperience || 5,
      bio: initialData?.bio || '',
    },
  });

  const onSubmit = async (data: TutorProfileFormData) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Submitting tutor profile data:', { ...data, subjects: selectedSubjects });
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const createdDate = initialData?.createdAt
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(initialData.createdAt)
    : new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your tutor profile information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {initialData?.verified && (
              <Badge variant="default" className="bg-emerald-600">
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            {/* <div className="flex justify-center">
              <AvatarUpload name={initialData?.name || 'Tutor'} isLoading={isLoading} />
            </div> */}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue={initialData?.email || 'sarah@example.com'}
                  disabled
                  className="w-full px-3 py-2 border border-input rounded-md bg-muted text-foreground placeholder-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
              </div>

              {/* Subjects */}
              <div>
                <label className="block text-sm font-medium mb-3">Subjects You Teach</label>
                <div className="flex flex-wrap gap-2">
                  {defaultSubjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => toggleSubject(subject)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedSubjects.includes(subject)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {selectedSubjects.length > 0 ? selectedSubjects.join(', ') : 'None'}
                </p>
              </div>

              {/* Hourly Rate */}
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium mb-2">
                  Hourly Rate (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    {...register('hourlyRate')}
                    type="number"
                    id="hourlyRate"
                    className="w-full pl-7 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="50"
                    min="10"
                    step="5"
                  />
                </div>
                {errors.hourlyRate && <p className="text-sm text-destructive mt-1">{errors.hourlyRate.message}</p>}
              </div>

              {/* Years of Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium mb-2">
                  Years of Experience
                </label>
                <input
                  {...register('yearsOfExperience')}
                  type="number"
                  id="experience"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="5"
                  min="0"
                />
                {errors.yearsOfExperience && (
                  <p className="text-sm text-destructive mt-1">{errors.yearsOfExperience.message}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  {...register('bio')}
                  id="bio"
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell students about yourself, your teaching approach, and expertise..."
                />
                {errors.bio && <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>}
              </div>

              {/* Account Created Date */}
              <div>
                <label htmlFor="created" className="block text-sm font-medium mb-2">
                  Account Created
                </label>
                <input
                  type="text"
                  id="created"
                  disabled
                  value={createdDate}
                  className="w-full px-3 py-2 border border-input rounded-md bg-muted text-foreground cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
