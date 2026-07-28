"use client";
import api from "@/lib/axios/api";
import { useEffect, useState } from "react";

interface Booking {
  id: string;
  subject: string;
  dateTime: string;
  duration: number;
  price: number;
  status: string;
  tutor: { name: string; image: string | null };
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-gray-100 text-gray-700",
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const res = await api.get("/bookings");
      setBookings(res.data.data);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">
          No bookings yet. <a href="/student/tutors" className="underline">Find a tutor</a> to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{b.tutor.name}</p>
                <p className="text-sm text-gray-600">
                  {b.subject} &middot; {new Date(b.dateTime).toLocaleString()} &middot; {b.duration} min
                </p>
                <p className="text-sm text-gray-500">${b.price.toFixed(2)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[b.status]}`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}