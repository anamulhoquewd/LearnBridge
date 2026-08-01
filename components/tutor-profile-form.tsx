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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { TutorProfileWithUser } from "@/interfaces"
import api from "@/lib/axios/api"
import { SUBJECT_OPTIONS } from "@/lib/constant"
import { TutorProfileFormValues, tutorProfileSchema } from "@/lib/zod/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircleIcon, CloudUpload } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Skeleton } from "./ui/skeleton"
import VerifiedBadge from "./verified-badge"

export function TutorProfileForm() {
  const [profile, setProfile] = useState<TutorProfileWithUser>()
  const [loading, setLoading] = useState<boolean>(false)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)

  const form = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      email: "",
      name: "",
      bio: "",
      experience: 0,
      hourlyRate: 0,
      subjects: [],
    },
  })

  const handleSubmit = async (data: TutorProfileFormValues) => {
    try {
      const response = await toast.promise(api.put("/tutor-profile", data), {
        loading: "Updating...",
        success: "Profile updated successfully!",
        error: (err) => err?.message || "Update failed",
      })

      if (response.data.success) {
        setProfile(response.data.data)
        form.reset({
          ...response.data.data,
          name: response.data.data.user.name,
          email: response.data.data.user.email,
        })
      }
    } catch (error: any) {
      throw error
    }
  }

  const onSubmit: SubmitHandler<TutorProfileFormValues> = async (
    data: TutorProfileFormValues
  ) => {
    await handleSubmit(data)
  }

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await api.get("/tutor-profile")

      toast.add({
        type: "success",
        description: response.data?.message || "Event has been created.",
      })

      if (response.data.success) {
        setProfile(response.data.data)
        form.reset({
          ...response.data.data,
          name: response.data.data.user.name,
          email: response.data.data.user.email,
        })
      }
    } catch (error: any) {
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
                  src={profile?.user.avatar || ""}
                  alt={profile?.user.name || "@pranathip"}
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
                  <Label className="text-xl">{profile?.user.name}</Label>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {profile?.bio}
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
                    placeholder="anamulhoquewd@gmail.com"
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
                    placeholder="Anamul Hoque"
                    autoComplete="off"
                  />
                )}

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="bio"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                {loading ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Hi, this is Anam, a Softwere developer"
                    autoComplete="off"
                  />
                )}

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="hourlyRate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Hourly rate</FieldLabel>
                  {loading ? (
                    <Skeleton className="h-10 w-full rounded-md" />
                  ) : (
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="How much do you want to charge per hour for your services?"
                        autoComplete="off"
                        type="number"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>USD</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="experience"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Years of Experience
                  </FieldLabel>
                  {loading ? (
                    <Skeleton className="h-10 w-full rounded-md" />
                  ) : (
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="How many years of experience do you have in the service you want to offer?"
                        autoComplete="off"
                        type="number"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>years</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="subjects"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Subjects you teach</FieldLabel>

                <div className="flex flex-wrap gap-2">
                  {SUBJECT_OPTIONS.map((subject) => (
                    <Button
                      type="button"
                      size="sm"
                      key={subject}
                      variant={
                        field.value?.includes(subject) ? "default" : "secondary"
                      }
                      onClick={() => {
                        const selectedSubjects = field.value ?? []
                        field.onChange(
                          selectedSubjects.includes(subject)
                            ? selectedSubjects.filter((s) => s !== subject)
                            : [...selectedSubjects, subject]
                        )
                      }}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Selected:{" "}
                  {field.value.length > 0 ? field.value.join(", ") : "None"}
                </p>

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
              user: {
                ...prev.user,
                avatar: data.url,
              },
            }
          })
        }}
      />
    </>
  )
}
