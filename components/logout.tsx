"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLogout } from "@/hooks/auth/logout"
import { LogOut } from "lucide-react"
import { Spinner } from "./ui/spinner"

export function LogoutButton({ children }: { children: React.ReactElement }) {
  const { handleLogout, loading } = useLogout()

  return (
    <AlertDialog>
      <AlertDialogTrigger render={children} />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <LogOut size={"icon-xs"} />
          </AlertDialogMedia>
          <AlertDialogTitle>Log out?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out of your account?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={handleLogout}
            variant="destructive"
          >
            {loading && <Spinner />}
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
