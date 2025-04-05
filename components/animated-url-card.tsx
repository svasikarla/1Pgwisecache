"use client"

import { useRef, useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryIcon } from "@/lib/category-icons"
import { cn } from "@/lib/utils"
import { motion, useAnimation, useInView } from "framer-motion"

export interface UrlCardProps {
  title: string
  url: string
  summary: string[]
  category: string
}

export default function AnimatedUrlCard({ title, url, summary, category }: UrlCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = getCategoryIcon(category)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
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
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {summary.map((point, index) => (
              <motion.li
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.3,
                    },
                  },
                }}
                className={cn("transition-all duration-300", isHovered ? "text-foreground" : "")}
              >
                {point}
              </motion.li>
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
            <ExternalLink
              className={cn("h-3 w-3 transition-transform duration-300", isHovered ? "translate-x-1" : "")}
            />
            <span>View Original</span>
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

