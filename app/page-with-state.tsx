"use client"

import { useState } from "react"
import AddUrlForm from "@/components/add-url-form"
import SearchBox from "@/components/search-box"
import CategorySection from "@/components/category-section"
import { mockData } from "@/lib/mock-data"
import type { UrlCardProps } from "@/components/url-card"

export default function HomeWithState() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter data based on search query
  const filteredData: Record<string, UrlCardProps[]> = {}

  Object.entries(mockData.categories).forEach(([category, items]) => {
    const filteredItems = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.some((point) => point.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    if (filteredItems.length > 0) {
      filteredData[category] = filteredItems
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">WiseCache</h1>
          <div className="mb-8">
            <AddUrlForm />
          </div>
          <div className="mb-6">
            <SearchBox onSearch={setSearchQuery} />
          </div>
        </header>

        <main className="space-y-10">
          {Object.keys(filteredData).length > 0 ? (
            Object.entries(filteredData).map(([category, items]) => (
              <CategorySection key={category} title={category} items={items} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

