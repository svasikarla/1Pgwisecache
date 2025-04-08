"use client"

import { useAuth } from '@/hooks/auth-provider'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HeroSection from '@/components/ui/hero-section'

export default function HomePage() {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && session) {
      router.push('/dashboard')
    }
  }, [session, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
          <p className="text-muted-foreground">
            Please wait while we check your session.
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <HeroSection />
  }

  return null
}


