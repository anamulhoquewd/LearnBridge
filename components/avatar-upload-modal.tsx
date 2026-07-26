"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import api from "@/lib/axios/api"
import { FileUploadConfig } from "@/lib/file-upload-utils"
import { useState } from "react"
import { FileUploader } from "./file-uploader"
import { toast } from "./ui/toast"

interface AvatarUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: ({ files, data }: { files: File[]; data: any }) => void
  apiEndpoint: string // e.g., '/api/upload/avatar'
}

const AVATAR_CONFIG: FileUploadConfig = {
  maxFiles: 1,
  maxFileSize: 1024 * 1024, // 1MB
  allowedTypes: ["image/png", "image/jpeg"],
}

export function AvatarUploadModal({
  open,
  onOpenChange,
  onUploadComplete,
  apiEndpoint,
}: AvatarUploadModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (files: File[]) => {
    setIsLoading(true)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("file", file)
      })
      for (const [key, value] of formData.entries()) {
        console.log(key, value)
      }
      const response = await toast.promise(
        api.post(apiEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          loading: "Uploading...",
          success: "Uploaded successfully!",
          error: (err) => err?.message || "Upload failed",
        }
      )

      if (response.status === 401) {
        throw new Error(response.data.error)
      }
      if (response.status === 400) {
        throw new Error(response.data.error)
      }

      const { data, message, success } = response.data
      console.log("Data: ", data)

      // Call callback if provided
      if (onUploadComplete) {
        onUploadComplete({ files, data })
      }

      // Close modal on success
      onOpenChange(false)
    } catch (error) {
      console.error("Upload error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
          <DialogDescription>
            Upload a new profile picture. PNG or JPEG, up to 1MB.
          </DialogDescription>
        </DialogHeader>

        <FileUploader
          config={AVATAR_CONFIG}
          onUpload={handleUpload}
          isLoading={isLoading}
          allowedTypesLabel="Supported formats: PNG, JPEG"
        />
      </DialogContent>
    </Dialog>
  )
}
