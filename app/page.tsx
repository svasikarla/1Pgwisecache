"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Plus, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UrlCard from "@/components/url-card"
import { getCategoryColor, getCategoryBgClass } from "@/lib/category-utils"
import { getKnowledgeBase, addToKnowledgeBase } from "@/lib/actions"
import type { KnowledgeBase } from "@/lib/supabase"
import { toast } from "sonner"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isProcessingEmail, setIsProcessingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase[]>([])
  const [categories, setCategories] = useState<string[]>([])

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        setError(null)
        console.log('Fetching data from Supabase...')
        const result = await getKnowledgeBase()
        
        if (!result.success) {
          throw new Error('Failed to fetch data from Supabase')
        }

        if (result.data) {
          console.log('Setting knowledge base data:', result.data.length, 'items')
          setKnowledgeBase(result.data)
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(result.data.map(item => item.category)))
          console.log('Setting categories:', uniqueCategories)
          setCategories(uniqueCategories)
        }
      } catch (err) {
        console.error('Error in fetchData:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setIsLoadingData(false)
      }
    }
    fetchData()
  }, [])

  // Filter data based on search query
  const getFilteredItems = (category: string) => {
    return knowledgeBase
      .filter(item => item.category === category)
      .filter(item =>
        searchQuery === "" ||
        item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    // Check if URL already exists
    const existingUrl = knowledgeBase.some(item => item.original_url === url)
    if (existingUrl) {
      toast.error('This URL has already been added')
      setUrl("")
      return
    }

    setIsLoading(true)
    try {
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

      // Update local state directly instead of fetching again
      const newItem: KnowledgeBase = {
        id: result.data?.id || Number(Date.now()),
        category: data.category,
        headline: data.headline,
        summary: data.summary,
        original_url: url,
        created_at: new Date().toISOString()
      }
      
      setKnowledgeBase(prev => [...prev, newItem])
      
      // Update categories if needed
      if (!categories.includes(data.category)) {
        setCategories(prev => [...prev, data.category])
      }

      setUrl("")
      toast.success('URL added successfully!')
    } catch (error) {
      console.error('Error adding URL:', error)
      toast.error('Failed to add URL')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProcessEmail = async () => {
    setIsProcessingEmail(true)
    try {
      const response = await fetch('/api/process-email', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to process emails')
      }

      const data = await response.json()
      
      if (data.success) {
        // Refresh the data
        const refreshResult = await getKnowledgeBase()
        if (refreshResult.success && refreshResult.data) {
          setKnowledgeBase(refreshResult.data)
          const uniqueCategories = Array.from(new Set(refreshResult.data.map(item => item.category)))
          setCategories(uniqueCategories)
        }
        
        toast.success(`Processed ${data.processed} URLs from email`)
      } else {
        throw new Error(data.error || 'Failed to process emails')
      }
    } catch (error) {
      console.error('Error processing emails:', error)
      toast.error('Failed to process emails')
    } finally {
      setIsProcessingEmail(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-8 text-center md:text-left">WiseCache</h1>

          <div className="max-w-3xl mx-auto md:mx-0 mb-8">
            <div className="flex gap-2 mb-6">
              <form
                onSubmit={handleAddUrl}
                className="flex-1 flex gap-2 shadow-lg rounded-lg overflow-hidden p-1 bg-card border"
                noValidate
              >
                <Input
                  className="flex-1 border-0 shadow-none text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Enter a URL to summarize..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="gap-1 transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isLoading ? "Processing..." : "Add URL"}</span>
                </Button>
              </form>
              <Button
                onClick={handleProcessEmail}
                disabled={isProcessingEmail}
                variant="outline"
                className="gap-1 transition-all duration-300"
              >
                <Mail className="h-4 w-4" />
                <span>{isProcessingEmail ? "Processing..." : "Refresh from EMAIL"}</span>
              </Button>
            </div>

            <div className="relative shadow-md rounded-lg overflow-hidden">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Search cached entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main>
          {isLoadingData ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No categories found. Add a URL to get started!</p>
            </div>
          ) : (
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="w-full justify-start mb-6 overflow-x-auto flex-wrap sm:flex-nowrap bg-transparent p-0 h-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className={`rounded-md px-4 py-2 m-1 transition-all duration-300 data-[state=active]:shadow-md ${getCategoryColor(category)}`}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => {
                const filteredItems = getFilteredItems(category)

                return (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className={`p-6 rounded-lg ${getCategoryBgClass(category)}`}>
                      {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredItems.map((item) => (
                            <UrlCard
                              key={item.id}
                              title={item.headline}
                              url={item.original_url}
                              category={item.category}
                              summary={item.summary}
                            />
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
                )
              })}
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}

