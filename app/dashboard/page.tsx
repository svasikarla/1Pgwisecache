"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Plus, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UrlCard from "@/components/url-card"
import { getCategoryColor, getCategoryBgClass, getCategoryIcon } from "@/lib/category-utils"
import { getKnowledgeBase, addToKnowledgeBase, deleteFromKnowledgeBase } from "@/lib/supabase/actions"
import type { KnowledgeBase } from "@/lib/supabase/supabase"
import { toast } from "sonner"
import { CategoryPopup } from "@/components/category-popup"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/auth-provider"
import { isGuest, getGuestLinkCount, GUEST_LINK_LIMIT, cleanupGuestUser } from "@/lib/guest-utils"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
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
  const [linkCount, setLinkCount] = useState(0)

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setIsLoadingData(true)
        setError(null)
        const result = await getKnowledgeBase()
        
        if (!result.success) {
          if (result.error === 'User must be authenticated to view knowledge base') {
            router.push("/")
            return
          }
          throw new Error(result.error)
        }

        if (result.data) {
          setKnowledgeBase(result.data)
          const uniqueCategories = Array.from(new Set(result.data.map(item => item.category)))
          setCategories(uniqueCategories)
        }

        // If guest user, fetch link count
        if (user && isGuest(user)) {
          const count = await getGuestLinkCount(user.id)
          setLinkCount(count)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [user, router])

  // Handle sign out with guest user cleanup
  const handleSignOut = async () => {
    try {
      if (user && isGuest(user)) {
        await cleanupGuestUser(user.id)
      }
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out. Please try again.")
    }
  }

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

    // Check guest link limit
    if (user && isGuest(user) && linkCount >= GUEST_LINK_LIMIT) {
      toast.error(`Guest users are limited to ${GUEST_LINK_LIMIT} links. Please create an account to save more.`)
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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze URL')
      }

      const data = await response.json()
      console.log('Analysis data:', data)
      
      if (!data.category || !data.headline || !data.summary) {
        throw new Error('Invalid data received from analysis')
      }

      // Add to Supabase
      const result = await addToKnowledgeBase({
        category: data.category,
        headline: data.headline,
        summary: data.summary,
        original_url: url,
      })

      console.log('Add to knowledge base result:', result)

      if (!result.success) {
        throw new Error(result.error || 'Failed to save to knowledge base')
      }

      if (!result.data) {
        throw new Error('No data returned from knowledge base')
      }

      // Update local state
      setKnowledgeBase(prev => [...prev, result.data])
      if (!categories.includes(data.category)) {
        setCategories(prev => [...prev, data.category])
      }

      // Update link count for guest users
      if (user && isGuest(user)) {
        setLinkCount(prev => prev + 1)
      }

      toast.success('URL added successfully')
      setUrl("")
    } catch (err) {
      console.error('Error in handleAddUrl:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to add URL')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
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

      // Update link count for guest users
      if (user && isGuest(user)) {
        setLinkCount(prev => prev - 1)
      }

      toast.success('URL deleted successfully')
    } catch (error) {
      console.error('Error deleting URL:', error)
      toast.error('Failed to delete URL')
    }
  }

  const handleProcessEmail = async () => {
    setIsProcessingEmail(true)
    try {
      const response = await fetch('/api/process-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.email
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process emails')
      }

      const data = await response.json()
      
      if (data.success) {
        toast.success(`Processed ${data.processedUrls} URLs from ${data.emailsWithUrls} emails`)
        
        // Refresh the knowledge base after processing emails
        const result = await getKnowledgeBase()
        if (result.success && result.data) {
          setKnowledgeBase(result.data)
          const uniqueCategories = Array.from(new Set(result.data.map(item => item.category)))
          setCategories(uniqueCategories)
        }
      } else {
        throw new Error(data.error || 'Failed to process emails')
      }
    } catch (error) {
      console.error('Error in handleProcessEmail:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to refresh from E-Mail')
    } finally {
      setIsProcessingEmail(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">WiseCache</h1>
            {user && (
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Welcome, {user.email}</p>
                <p className="flex gap-4 text-gray-600 dark:text-gray-400">
                  <span>Account created: {new Date(user.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Last login: {new Date(user.last_sign_in_at || user.created_at).toLocaleDateString()}</span>
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="space-y-6">
          {/* Title and Guest Info */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your Knowledge Base</h2>
            {user && isGuest(user) && (
              <p className="text-sm text-muted-foreground">
                Guest Mode: {linkCount} of {GUEST_LINK_LIMIT} links used
              </p>
            )}
          </div>

          {/* URL Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="url"
                placeholder="Paste URL to summarize..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  onClick={handleAddUrl} 
                  disabled={isSubmitting} 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white flex-1"
                >
                  {isSubmitting ? "Processing..." : <><Plus className="h-4 w-4 mr-2" /> Add URL</>}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleProcessEmail} 
                  disabled={isProcessingEmail}
                  size="lg"
                  className="flex items-center gap-2 flex-1"
                >
                  {isProcessingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Refresh From E-Mail
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Categories and Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 className="font-semibold mb-3">Categories</h3>
                {categories.map((category) => {
                  const categoryCount = knowledgeBase.filter(item => item.category === category).length;
                  return (
                    <motion.div
                      key={category}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          selectedCategory === category ? 'ring-2 ring-primary scale-105' : ''
                        } ${getCategoryColor(category)}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2 text-lg">{getCategoryIcon(category)}</span>
                          <span className="truncate">{category}</span>
                        </div>
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/10">
                          {categoryCount}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })}
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
                    <div className="grid gap-4">
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
                    className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                  >
                    <p className="text-muted-foreground">Select a category to view its contents</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 