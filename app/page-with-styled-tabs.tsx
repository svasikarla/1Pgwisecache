"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { StyledTabs } from "@/components/styled-tabs"
import UrlCard from "@/components/url-card"
import { mockData } from "@/lib/mock-data"

export default function HomeWithStyledTabs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const categoryTabs = Object.keys(mockData.categories).map((category) => {
    const colorMap: Record<string, string> = {
      Technology: "blue",
      Science: "green",
      Business: "amber",
      Health: "red",
      Ideas: "purple",
    }

    return {
      value: category,
      label: category,
      color: colorMap[category] || "gray",
    }
  })

  // Filter data based on search query
  const getFilteredItems = (category: string) => {
    return mockData.categories[category].filter(
      (item) =>
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.some((point) => point.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setUrl("")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">WiseCache</h1>

          <form onSubmit={handleAddUrl} className="flex gap-2 mb-6">
            <Input
              className="flex-1"
              placeholder="Enter a URL to summarize..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "+ Add URL"}
            </Button>
          </form>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search cached entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <main>
          <StyledTabs tabs={categoryTabs}>
            {categoryTabs.map((tab) => {
              const category = tab.value
              const filteredItems = getFilteredItems(category)
              const bgColorClass = getBgColorClass(tab.color)

              return (
                <Tabs key={category} value={category}>
                  <TabsContent value={category} className="mt-0">
                    <div className={`p-6 rounded-lg ${bgColorClass}`}>
                      {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredItems.map((item, index) => (
                            <UrlCard key={index} {...item} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">
                            {searchQuery
                              ? `No results found for "${searchQuery}" in ${category}`
                              : `No items in ${category}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              )
            })}
          </StyledTabs>
        </main>
      </div>
    </div>
  )
}

function getBgColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950/30",
    green: "bg-green-50 dark:bg-green-950/30",
    amber: "bg-amber-50 dark:bg-amber-950/30",
    red: "bg-red-50 dark:bg-red-950/30",
    purple: "bg-purple-50 dark:bg-purple-950/30",
    gray: "bg-gray-50 dark:bg-gray-900/30",
  }

  return colorMap[color] || colorMap.gray
}

