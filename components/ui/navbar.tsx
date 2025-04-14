"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavbarProps {
  userEmail?: string | null
  onSignOut: () => void
}

export function Navbar({ userEmail, onSignOut }: NavbarProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">WiseCache</h1>
            {userEmail && (
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                ({userEmail})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}