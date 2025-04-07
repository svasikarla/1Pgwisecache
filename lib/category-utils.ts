export const getCategoryColor = (category: string) => {
  const colors = {
    Technology: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-200",
    Science: "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200",
    Business: "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-200",
    Health: "bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-800 dark:text-red-200",
    Entertainment: "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200",
    Sports: "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-800 dark:text-orange-200",
    Politics: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-900/30 dark:hover:bg-gray-900/50 text-gray-800 dark:text-gray-200",
    Education: "bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200",
    Environment: "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200",
    default: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-900/30 dark:hover:bg-gray-900/50 text-gray-800 dark:text-gray-200"
  }

  return colors[category as keyof typeof colors] || colors.default
}

export const getCategoryBgClass = (category: string) => {
  const colors = {
    Technology: "bg-blue-50 dark:bg-blue-950/30",
    Science: "bg-green-50 dark:bg-green-950/30",
    Business: "bg-purple-50 dark:bg-purple-950/30",
    Health: "bg-red-50 dark:bg-red-950/30",
    Entertainment: "bg-yellow-50 dark:bg-yellow-950/30",
    Sports: "bg-orange-50 dark:bg-orange-950/30",
    Politics: "bg-gray-50 dark:bg-gray-950/30",
    Education: "bg-indigo-50 dark:bg-indigo-950/30",
    Environment: "bg-emerald-50 dark:bg-emerald-950/30",
    default: "bg-gray-50 dark:bg-gray-950/30"
  }

  return colors[category as keyof typeof colors] || colors.default
}

export const getCategoryIcon = (category: string) => {
  const icons = {
    Technology: "💻",
    Science: "🔬",
    Business: "💼",
    Health: "🏥",
    Entertainment: "🎭",
    Sports: "⚽",
    Politics: "🏛️",
    Education: "📚",
    Environment: "🌱",
    default: "📄"
  }

  return icons[category as keyof typeof icons] || icons.default
}

