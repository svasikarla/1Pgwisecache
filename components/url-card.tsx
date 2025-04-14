"use client"

import { ExternalLink, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  return (
    <Card className="overflow-hidden border bg-card hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="p-3 flex flex-col flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className={`text-xs px-2 py-0.5 ${getCategoryColor(category)}`}
            >
              <span className="mr-1">{getCategoryIcon(category)}</span>
              {category}
            </Badge>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium leading-tight flex-1">{title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => window.open(url, '_blank')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <ul className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1 list-disc pl-4 space-y-1">
          {summary.split('\n').map((point, index) => (
            <li key={index}>{point.trim()}</li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

