"use client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios/api"
import { useState } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { createReviewSchema, CreateReviewSchema } from "@/lib/zod/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { AlertCircleIcon, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { toast } from "./ui/toast"

export function ReviewFormButton({
  bookingId,
  children,
}: {
  bookingId: string
  children: React.ReactElement
}) {
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<CreateReviewSchema>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      bookingId,
    },
  })

  async function onSubmit(data: CreateReviewSchema) {
    try {
      const response = await toast.promise(
        api.post("/reviews", { ...data, bookingId }),
        {
          loading: "Written your review",
          success: "Wright review successfully!",
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
        bookingId: "",
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
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-sm">
        <form
          className="space-y-4"
          id="review-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle className={"text-lg"}>
              Booking id is: <span className="font-bold">{bookingId}</span>
            </DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="rating"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={!!fieldState.error}
                  className="w-full max-w-48"
                >
                  <FieldLabel>Rating</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={!!fieldState.error}>
                      <SelectValue placeholder="Select a level">
                        <Star /> {field.value}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <SelectItem key={r} value={r} className="capitalize">
                            <Star /> {r}
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

            <Controller
              name="comment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Comment</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="How was your session?"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

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
              form="review-form"
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
