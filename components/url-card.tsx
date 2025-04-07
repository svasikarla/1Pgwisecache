"use client"

import { motion } from "framer-motion"
import { ExternalLink, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DeleteConfirmation } from "./delete-confirmation"

interface UrlCardProps {
  id: number
  title: string
  url: string
  category: string
  summary: string
  formattedDate: string
  onDelete: (id: number) => void
}

export default function UrlCard({ id, title, url, category, summary, formattedDate, onDelete }: UrlCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
            <CardTitle className="text-lg font-semibold line-clamp-2 dark:text-gray-100">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary.split('\n').map((line, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm dark:text-gray-300"
                >
                  <span className="text-primary mt-1">•</span>
                  <span className="flex-1">{line.replace(/^[•\s]+/, '').trim()}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Visit Source
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive dark:text-red-400 dark:hover:text-red-300"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(id)
          setIsDeleteDialogOpen(false)
        }}
        title={title}
      />
    </>
  )
}

