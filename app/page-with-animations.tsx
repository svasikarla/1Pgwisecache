"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnimatedUrlCard from "@/components/animated-url-card"
import { mockData } from "@/lib/mock-data"
import { getCategoryColor, getCategoryBgClass } from "@/lib/category-utils"
import { motion } from "framer-motion"

export default function HomeWithAnimations() {
  const [searchQuery, setSearchQuery] = useState("")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const categories = Object.keys(mockData.categories)
  const [activeTab, setActiveTab] = useState(categories[0])

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

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-8 text-center md:text-left">WiseCache</h1>

          <div className="max-w-3xl mx-auto md:mx-0 mb-8">
            <form
              onSubmit={handleAddUrl}
              className="flex gap-2 mb-6 shadow-lg rounded-lg overflow-hidden p-1 bg-card border"
            >
              <Input
                className="flex-1 border-0 shadow-none text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Enter a URL to summarize..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="gap-1 transition-all duration-300">
                <Plus className="h-4 w-4" />
                <span>{isLoading ? "Processing..." : "Add URL"}</span>
              </Button>
            </form>

            <motion.div
              className="relative shadow-md rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Search cached entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </motion.header>

        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
          <Tabs defaultValue={categories[0]} className="w-full" onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start mb-6 overflow-x-auto flex-wrap sm:flex-nowrap bg-transparent p-0 h-auto">
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <TabsTrigger
                    value={category}
                    className={`rounded-md px-4 py-2 m-1 transition-all duration-300 data-[state=active]:shadow-md ${getCategoryColor(category)}`}
                  >
                    {category}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>

            {categories.map((category) => {
              const filteredItems = getFilteredItems(category)

              return (
                <TabsContent key={category} value={category} className="mt-0">
                  <motion.div
                    className={`p-6 rounded-lg ${getCategoryBgClass(category)}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: activeTab === category ? 1 : 0,
                      scale: activeTab === category ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {filteredItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item, index) => (
                          <AnimatedUrlCard key={index} {...item} />
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
                  </motion.div>
                </TabsContent>
              )
            })}
          </Tabs>
        </motion.main>
      </div>
    </div>
  )
}

