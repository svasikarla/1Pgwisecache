"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/auth-provider"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()

  const error = searchParams.get("error")
  const description = searchParams.get("description")

  useEffect(() => {
    // If the error is due to an expired link, automatically redirect to sign in
    if (error === "access_denied" && description?.includes("expired")) {
      router.push("/signin")
    }
  }, [error, description, router])

  const getErrorMessage = () => {
    switch (error) {
      case "no-code":
        return "No authentication code was provided."
      case "access_denied":
        return "The authentication link has expired or is invalid."
      case "unexpected":
        return "An unexpected error occurred during authentication."
      default:
        return description || "An authentication error occurred."
    }
  }

  const handleRetry = () => {
    if (error === "access_denied" && description?.includes("expired")) {
      router.push("/signin")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Error</h1>
          <p className="text-muted-foreground mb-8">{getErrorMessage()}</p>
          <div className="space-y-4">
            <Button
              onClick={handleRetry}
              className="w-full"
            >
              {error === "access_denied" && description?.includes("expired")
                ? "Sign In Again"
                : "Return to Home"}
            </Button>
            {error === "access_denied" && description?.includes("expired") && (
              <Button
                variant="outline"
                onClick={() => router.push("/signup")}
                className="w-full"
              >
                Create New Account
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 