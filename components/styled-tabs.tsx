"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface StyledTabsProps {
  tabs: {
    value: string
    label: string
    color: string
  }[]
  defaultValue?: string
  children: React.ReactNode
  className?: string
}

export function StyledTabs({ tabs, defaultValue, children, className }: StyledTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].value)

  const getTabColor = (color: string, isActive: boolean) => {
    if (!isActive) return ""

    const colorMap: Record<string, string> = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      amber: "bg-amber-500 text-white",
      red: "bg-red-500 text-white",
      purple: "bg-purple-500 text-white",
      gray: "bg-gray-500 text-white",
    }

    return colorMap[color] || colorMap.gray
  }

  return (
    <Tabs defaultValue={defaultValue || tabs[0].value} className={cn("w-full", className)} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn("transition-colors", getTabColor(tab.color, activeTab === tab.value))}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}

