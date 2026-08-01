"use client"

import { AvatarUploadModal } from "@/components/avatar-upload-modal"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import api from "@/lib/axios/api"
import {
  StudentProfileFormValues,
  studentProfileSchema,
} from "@/lib/zod/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircleIcon, CloudUpload } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Skeleton } from "./ui/skeleton"
import VerifiedBadge from "./verified-badge"
import { Profile } from "@prisma/client"

export function StudentProfileForm() {
  const [profile, setProfile] = useState<Profile>()
  const [loading, setLoading] = useState<boolean>(false)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)

  const form = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  })

  const handleSubmit = async (data: StudentProfileFormValues) => {
    try {
      const response = await toast.promise(api.put("/student-profile", data), {
        loading: "Updating...",
        success: "Profile updated successfully!",
        error: (err) => err?.message || "Update failed",
      })

      if (response.data.success) {
        setProfile(response.data.data)
        form.reset({
          ...response.data.data,
          name: response.data.data.name,
          email: response.data.data.email,
        })
      }
    } catch (error: any) {
      throw error
    }
  }

  const onSubmit: SubmitHandler<StudentProfileFormValues> = async (
    data: StudentProfileFormValues
  ) => {
    await handleSubmit(data)
  }

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await api.get("/student-profile")

      toast.add({
        type: "success",
        description: response.data?.message || "Event has been created.",
      })

      if (response.data.success) {
        setProfile(response.data.data)
        form.reset({
          ...response.data.data,
          name: response.data.data.name,
          email: response.data.data.email,
        })
      }
    } catch (error: any) {
      console.error("Error: ", error)
      toast.add({
        type: "error",
        description: "The profile fetching failed.",
        priority: "high",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          <div className="relative flex flex-col items-center gap-2 text-center">
            {loading ? (
              <Skeleton className="h-28 w-28 rounded-full" />
            ) : (
              <Avatar className="h-28 w-28 grayscale">
                <AvatarImage
                  src={profile?.avatar || ""}
                  alt={profile?.name || "@pranathip"}
                />
                <AvatarFallback>ZI</AvatarFallback>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setAvatarModalOpen(true)
                  }}
                  size={"icon-sm"}
                  className="absolute right-0 bottom-0 z-10 rounded-full"
                >
                  <CloudUpload className="pointer-events-none h-5 w-5 cursor-pointer" />
                </Button>
              </Avatar>
            )}

            <div className="flex flex-col items-center gap-2">
              {loading ? (
                <>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-28" />
                </>
              ) : (
                <>
                  <Label className="text-xl">{profile?.name}</Label>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    I am fast Learner
                  </p>
                </>
              )}
            </div>
            <VerifiedBadge />
          </div>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                {loading ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="bridge@gmail.com"
                    autoComplete="off"
                    disabled
                  />
                )}
                <FieldDescription>
                  This field is currently disabled.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                {loading ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Bridge"
                    autoComplete="off"
                  />
                )}

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* root error message */}
          {form.formState.errors?.root?.message && (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircleIcon />
              <AlertTitle>Sign Up failed</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message ||
                  "Something went wrong. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <Field className="w-fit">
            <Button
              disabled={
                (form.formState.errors?.root &&
                  Object.keys(form.formState.errors.root).length !== 0 &&
                  form.formState.errors.constructor === Object) ||
                form.formState.isSubmitting
              }
              type="submit"
            >
              {form.formState.isSubmitting && (
                <Spinner data-icon="inline-start" />
              )}
              Update profile
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <AvatarUploadModal
        open={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
        apiEndpoint="/uploads"
        onUploadComplete={({ data }) => {
          setProfile((prev) => {
            if (!prev) return prev

            return {
              ...prev,
              avatar: data.url,
            }
          })
        }}
      />
    </>
  )
}
