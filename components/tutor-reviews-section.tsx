'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  date: string;
  subject: string;
  text: string;
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    studentName: 'Alex Chen',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    rating: 5,
    date: '2 weeks ago',
    subject: 'Calculus',
    text: 'Sarah is an amazing tutor! She explained derivatives in a way that finally made sense to me. Her teaching style is clear and patient. Highly recommend!',
  },
  {
    id: '2',
    studentName: 'Emma Rodriguez',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    rating: 5,
    date: '1 month ago',
    subject: 'Physics',
    text: 'Excellent tutoring sessions. Sarah has a unique ability to break down complex physics concepts. She\'s responsive and always prepared. Worth every penny!',
  },
  {
    id: '3',
    studentName: 'Michael Thompson',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    rating: 4,
    date: '1 month ago',
    subject: 'Algebra',
    text: 'Great tutor with lots of patience. Really helped me improve my algebra skills. My only note is that scheduling could be more flexible, but overall very satisfied.',
  },
  {
    id: '4',
    studentName: 'Jessica Lee',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    rating: 5,
    date: '2 months ago',
    subject: 'Mathematics',
    text: 'Sarah made math enjoyable! She uses real-world examples and interactive problem-solving. I went from failing to getting an A. Truly life-changing!',
  },
  {
    id: '5',
    studentName: 'David Patel',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    rating: 5,
    date: '2 months ago',
    subject: 'Calculus',
    text: 'Outstanding tutor! Sarah is knowledgeable, patient, and encouraging. She helped me understand calculus concepts I\'d been struggling with for months.',
  },
  {
    id: '6',
    studentName: 'Sophie Martin',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    rating: 4,
    date: '3 months ago',
    subject: 'Physics',
    text: 'Very good tutor! Explains things clearly and follows up with practice problems. Sessions are productive and well-structured. Would recommend!',
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`size-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );
}

export function TutorReviewsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Reviews ({SAMPLE_REVIEWS.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {SAMPLE_REVIEWS.map((review) => (
            <div key={review.id} className="pb-6 border-b last:pb-0 last:border-0">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                  <AvatarFallback>{review.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <div>
                      <h4 className="font-semibold text-sm">{review.studentName}</h4>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>

                  {/* Subject Badge */}
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {review.subject}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
