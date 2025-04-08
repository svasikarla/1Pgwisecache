"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/auth-provider"
import { createGuestUser } from "@/lib/guest-utils"
import { toast } from "sonner"

export default function GuestPage() {
  const router = useRouter()
  const { user, signIn, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    const handleGuestLogin = async () => {
      if (isLoading || loading) return
      setIsLoading(true)

      try {
        // Create a guest user
        const guestUser = await createGuestUser()
        if (!guestUser) {
          throw new Error("Failed to create guest user")
        }

        // Sign in with the guest user credentials
        await signIn(guestUser.email!, "guestguest")
        router.push("/dashboard")
      } catch (error) {
        console.error("Guest login failed:", error)
        toast.error("Failed to create guest account. Please try again.")
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    handleGuestLogin()
  }, [router, signIn, isLoading, loading])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Entering Guest Mode...</h1>
        <p className="text-muted-foreground">
          {isLoading ? "Setting up your temporary account..." : "Please wait while we set up your temporary account."}
        </p>
      </div>
    </div>
  )
} 