"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { addToKnowledgeBase } from "@/lib/actions"

export default function AddUrlForm() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    setIsLoading(true)

    try {
      // Call the analyze API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze URL')
      }

      const data = await response.json()

      // Add to Supabase
      const result = await addToKnowledgeBase({
        category: data.category,
        headline: data.headline,
        summary: data.summary,
        original_url: url,
      })

      if (!result.success) {
        throw new Error('Failed to save to database')
      }

      toast({
        title: "URL added successfully",
        description: "The content has been summarized and categorized.",
      })

      setUrl("")
    } catch (error) {
      toast({
        title: "Failed to add URL",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter a URL to summarize..."
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : "+ Add URL"}
      </Button>
    </form>
  )
}

