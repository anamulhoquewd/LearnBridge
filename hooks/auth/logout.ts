import { toast } from "@/components/ui/toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

const useLogout =  () => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      toast.add({
        type: "success",
        description: "You have been logged out.",
      })
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast.add({
        type: "error",
        description: "An error occurred while logging out. Please try again.",
        priority: "high",
      })

      throw new Error("")
    } finally {
      setLoading(false)
    }
  }

  return { handleLogout, loading, setLoading }
}

export { useLogout }

