"use client"

import { useState } from "react"
import { ExternalLink, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { getCategoryColor, getCategoryIcon } from "@/lib/category-utils"

interface UrlCardProps {
  id: number
  title: string
  url: string
  category: string
  summary: string
  formattedDate: string
  onDelete: (id: number) => void
}

export default function UrlCard({
  id,
  title,
  url,
  category,
  summary,
  formattedDate,
  onDelete,
}: UrlCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="overflow-hidden border bg-card">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`text-sm px-2 py-0.5 ${getCategoryColor(category)}`}
              >
                <span className="mr-1">{getCategoryIcon(category)}</span>
                {category}
              </Badge>
              <span className="text-sm text-muted-foreground">{formattedDate}</span>
            </div>
            <h3 className="font-medium leading-tight">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-destructive hover:text-destructive"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-sm text-muted-foreground">{summary}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}

