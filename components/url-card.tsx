"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryIcon } from "@/lib/category-icons"
import { cn } from "@/lib/utils"

export interface UrlCardProps {
  title: string
  url: string
  summary: string
  category: string
}

export default function UrlCard({ title, url, summary, category }: UrlCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = getCategoryIcon(category)

  // Split summary into lines and filter out empty lines
  const summaryLines = summary.split('\n').filter(line => line.trim().length > 0)

  return (
    <Card
      className={cn(
        "h-full flex flex-col border transition-all duration-300",
        isHovered ? "shadow-lg scale-[1.02] bg-card/80" : "shadow",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge
            variant="secondary"
            className={cn("flex items-center gap-1 transition-all duration-300", isHovered ? "scale-110" : "")}
          >
            <Icon className="h-3 w-3" />
            <span>{category}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="list-none pl-0 space-y-1 text-sm text-muted-foreground">
          {summaryLines.map((line, index) => (
            <li
              key={index}
              className={cn(
                "transition-opacity duration-300 ease-in-out flex items-start gap-2",
                isHovered ? "opacity-100" : `opacity-${Math.max(100 - index * 10, 70)}`,
              )}
              style={{
                transitionDelay: isHovered ? `${index * 50}ms` : "0ms",
              }}
            >
              <span className="text-primary">•</span>
              <span>{line.trim().replace(/^[•\s]+/, '')}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-sm flex items-center gap-1 text-primary transition-all duration-300",
            isHovered ? "underline translate-x-1" : "hover:underline",
          )}
        >
          <ExternalLink className={cn("h-3 w-3 transition-transform duration-300", isHovered ? "translate-x-1" : "")} />
          <span>View Original</span>
        </a>
      </CardFooter>
    </Card>
  )
}

