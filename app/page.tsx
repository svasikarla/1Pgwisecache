"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Plus, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UrlCard from "@/components/url-card"
import { getCategoryColor, getCategoryBgClass, getCategoryIcon } from "@/lib/category-utils"
import { getKnowledgeBase, addToKnowledgeBase, deleteFromKnowledgeBase } from "@/lib/actions"
import type { KnowledgeBase } from "@/lib/supabase"
import { toast } from "sonner"
import { CategoryPopup } from "@/components/category-popup"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isProcessingEmail, setIsProcessingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    if (!url || isSubmitting) return

    // Check if URL already exists
    const existingUrl = knowledgeBase.some(item => item.original_url === url)
    if (existingUrl) {
      toast.error('This URL has already been added')
      setUrl("")
      return
    }

    setIsSubmitting(true)
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
      setIsSubmitting(false)
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

  const handleDeleteUrl = async (id: number) => {
    try {
      const result = await deleteFromKnowledgeBase(id)
      
      if (!result.success) {
        throw new Error('Failed to delete URL')
      }

      // Update local state
      setKnowledgeBase(prev => prev.filter(item => item.id !== id))
      
      // Update categories if needed
      const remainingCategories = new Set(knowledgeBase
        .filter(item => item.id !== id)
        .map(item => item.category))
      
      if (remainingCategories.size !== categories.length) {
        setCategories(Array.from(remainingCategories))
      }

      toast.success('URL deleted successfully!')
    } catch (error) {
      console.error('Error deleting URL:', error)
      toast.error('Failed to delete URL')
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
                  disabled={isLoading || isSubmitting}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || isSubmitting} 
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

        <main className="space-y-8">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No categories found. Add a URL to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-2">
                  {categories.map((category) => (
                    <motion.div
                      key={category}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          selectedCategory === category ? 'ring-2 ring-primary scale-105' : ''
                        } ${getCategoryColor(category)}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <span className="mr-2 text-lg">{getCategoryIcon(category)}</span>
                        <span className="truncate">{category}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {selectedCategory ? (
                    <motion.div
                      key={selectedCategory}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`p-6 rounded-lg ${getCategoryBgClass(selectedCategory)}`}
                    >
                      <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100 flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(selectedCategory)}</span>
                        {selectedCategory}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({getFilteredItems(selectedCategory).length} items)
                        </span>
                      </h2>
                      <div className="space-y-4">
                        {getFilteredItems(selectedCategory).map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <UrlCard
                              id={item.id}
                              title={item.headline}
                              url={item.original_url}
                              category={item.category}
                              summary={item.summary}
                              formattedDate={new Date(item.created_at).toLocaleDateString()}
                              onDelete={handleDeleteUrl}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <p className="text-muted-foreground">Select a category to view its contents</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

