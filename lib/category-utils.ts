export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Technology:
      "data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/30",
    Science:
      "data-[state=active]:bg-green-500 data-[state=active]:text-white hover:bg-green-100 dark:hover:bg-green-900/30",
    Business:
      "data-[state=active]:bg-amber-500 data-[state=active]:text-white hover:bg-amber-100 dark:hover:bg-amber-900/30",
    Health: "data-[state=active]:bg-red-500 data-[state=active]:text-white hover:bg-red-100 dark:hover:bg-red-900/30",
    Ideas:
      "data-[state=active]:bg-purple-500 data-[state=active]:text-white hover:bg-purple-100 dark:hover:bg-purple-900/30",
  }

  return (
    colors[category] ||
    "data-[state=active]:bg-gray-500 data-[state=active]:text-white hover:bg-gray-100 dark:hover:bg-gray-900/30"
  )
}

export function getCategoryBgClass(category: string): string {
  const colors: Record<string, string> = {
    Technology: "bg-blue-50 dark:bg-blue-950/30",
    Science: "bg-green-50 dark:bg-green-950/30",
    Business: "bg-amber-50 dark:bg-amber-950/30",
    Health: "bg-red-50 dark:bg-red-950/30",
    Ideas: "bg-purple-50 dark:bg-purple-950/30",
  }

  return colors[category] || "bg-gray-50 dark:bg-gray-900/30"
}

