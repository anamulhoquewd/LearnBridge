import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateMeta({
  title,
  description,
}: {
  title: string
  description: string
}): Metadata {
  return {
    title: `${title} — Tutor Platform`,
    description: description,
    openGraph: {
      images: [`/seo.jpg`],
    },
  }
}