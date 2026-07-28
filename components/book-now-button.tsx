"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/lib/axios/api"
import { DURATIONS } from "@/lib/constant"
import { CreateBookingInput, createBookingSchema } from "@/lib/zod/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { format } from "date-fns"
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Calendar } from "./ui/calendar"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { toast } from "./ui/toast"

export function BookNowButton({
  tutorId,
  tutorName,
  subjects,
  hourlyRate,
}: {
  tutorId: string
  tutorName: string
  subjects: string[]
  hourlyRate: number
}) {
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), 0, 12 + i)
  )

  const form = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      tutorId: tutorId,
      duration: 30,
    },
  })

  console.log("Form values: ", form.getValues())

  const duration = form.watch("duration")

  const estimatedPrice = ((hourlyRate / 60) * duration).toFixed(2)

  async function onSubmit(data: CreateBookingInput) {
    const [hours, minutes] = data.time.split(":").map(Number)

    const combinedDateTime = new Date(data.date)
    combinedDateTime.setHours(hours, minutes, 0, 0)

    console.log("combined date time: ", combinedDateTime)

    try {
      const response = await toast.promise(
        api.post("/bookings", {
          ...data,
          dateTime: combinedDateTime.toISOString(),
        }),
        {
          loading: "Creating your booking…",
          success: "Session booked successfully!",
          error: (err) => {
            if (axios.isAxiosError(err)) {
              const rawMessage = err.response?.data?.error || "Request failed"
              return rawMessage
            }
            return "Something went wrong. Please try again."
          },
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.error || "Request failed!")
      }

      setOpen(false)
      form.reset({
        tutorId: "",
      })
      router.push("/student/bookings")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const rawMessage = error.response?.data?.error || "Request failed"
        form.setError("root", { type: "manual", message: rawMessage })
      } else {
        form.setError("root", {
          type: "manual",
          message: "Something went wrong. Please try again.",
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Book Now</Button>} />
      <DialogContent className="sm:max-w-sm">
        <form
          className="space-y-4"
          id="booking-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle className={"text-lg"}>
              Book a session with <span className="font-bold">{tutorName}</span>
            </DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="subject"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className="w-full max-w-48"
                >
                  <FieldLabel>Subject</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={!!fieldState.error}>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {subjects.map((subject) => (
                          <SelectItem
                            key={subject}
                            value={subject}
                            className="capitalize"
                          >
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="flex items-center gap-5">
              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="date-picker" className="max-w-fit">
                      Date
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            id="date-picker"
                            className="w-48 justify-between font-normal"
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Select date"}
                            <ChevronDownIcon data-icon="inline-end" />
                          </Button>
                        }
                      />
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          defaultMonth={field.value}
                          selected={field.value}
                          onSelect={(date) => field.onChange(date)} // Date object directly rakho, string convert koro na
                          disabled={bookedDates}
                          modifiers={{ booked: bookedDates }}
                          modifiersClassNames={{
                            booked: "[&>button]:line-through opacity-100",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="time-picker">Time</FieldLabel>
                    <Input
                      type="time"
                      id="time-picker"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="duration"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className="w-full max-w-48"
                >
                  <FieldLabel>Duration (minutes)</FieldLabel>

                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger aria-invalid={!!fieldState.error}>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {DURATIONS.map((duration) => (
                          <SelectItem
                            key={duration.value}
                            value={String(duration.value)}
                          >
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogDescription>
            Estimated price: <strong>${estimatedPrice}</strong>
          </DialogDescription>

          {/* root error message */}
          {form.formState.errors?.root?.message && (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircleIcon />
              <AlertTitle>Request failed</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message ||
                  "Something went wrong. Please try again."}
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              form="booking-form"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
