import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { r2 } from "./config"

const R2_BUCKET = process.env.R2_BUCKET || "tutor-platform"
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

console.log("bucket: ", R2_BUCKET)
console.log("public url: ", R2_PUBLIC_URL)

export async function fileToBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export async function uploadSingleFile(
  file: File,
  folder: string | undefined = "tutor-marketplace"
) {
  try {
    if (!file) {
      return { error: { message: "No file provided" } }
    }

    const buffer = await fileToBuffer(file)

    if (!buffer || buffer.length === 0) {
      return { error: { message: "Failed to process file buffer" } }
    }

    const fileName = `tutor-${new Date().getTime().toString()}.webp`
    const key = `${folder}/${fileName}`

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET as string,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })

    await r2.send(command)

    const url = `${R2_PUBLIC_URL}/${key}`

    return {
      success: {
        success: true,
        message: "File uploaded successfully",
        data: {
          url,
          key,
        },
      },
    }
  } catch (error: any) {
    console.error("Upload error →", error.message || error)
    return {
      serverError: {
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
      },
    }
  }
}

// upload.ts — uploadMultipleFiles fix
export async function uploadMultipleFiles(
  images: { file: File; position: number }[],
  folder: string | undefined
) {
  try {
    if (!Array.isArray(images) || images.length === 0) {
      return { error: { message: "files must be a non-empty array" } }
    }

    const results: { url: string; key: string; position: number }[] = []

    for (const image of images) {
      const uploaded = await uploadSingleFile(image.file, folder)

      if (!uploaded.success) {
        // Fixed: consistent error shape
        return {
          error: uploaded.error || {
            message: "Failed to upload one of the files",
          },
        }
      }

      results.push({ ...uploaded.success.data, position: image.position })
    }

    return {
      success: {
        success: true,
        message: "Multiple files uploaded successfully",
        data: results,
      },
    }
  } catch (error: any) {
    return {
      serverError: {
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
      },
    }
  }
}

export async function deleteSingleFile(key: string) {
  try {
    if (!key) {
      return { error: { message: "key is required" } }
    }

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET as string,
      Key: key,
    })

    await r2.send(command)

    return {
      success: true,
      message: "File deleted successfully",
    }
  } catch (error: any) {
    return {
      serverError: {
        success: false,
        message: error.message,
      },
    }
  }
}

export async function deleteMultipleFiles(keys: string[]) {
  try {
    if (!Array.isArray(keys) || keys.length === 0) {
      return { error: { message: "keys must be a non-empty array" } }
    }

    const command = new DeleteObjectsCommand({
      Bucket: R2_BUCKET!,
      Delete: {
        Objects: keys.map((id) => ({
          Key: id, // same as key (your stored key)
        })),
        Quiet: false, // return deleted results
      },
    })

    const result = await r2.send(command)

    console.log("R2 delete multiple result:", result)

    return {
      success: true,
      message: "Multiple files deleted successfully",
      data: {
        deleted: result.Deleted || [],
        errors: result.Errors || [],
      },
    }
  } catch (error: any) {
    return {
      serverError: {
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
      },
    }
  }
}
