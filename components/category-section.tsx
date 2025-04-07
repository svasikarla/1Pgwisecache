import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategorySectionProps {
  category: string
  children: React.ReactNode
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technology':
      return 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200'
    case 'science':
      return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200'
    case 'business':
      return 'bg-purple-100 dark:bg-purple-950/30 text-purple-800 dark:text-purple-200'
    case 'health':
      return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-200'
    case 'entertainment':
      return 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200'
    case 'sports':
      return 'bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200'
    case 'politics':
      return 'bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200'
    default:
      return 'bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200'
  }
}

export function CategorySection({ category, children }: CategorySectionProps) {
  return (
    <div className={cn("p-6 rounded-lg transition-colors duration-300", getCategoryColor(category))}>
      <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">{category}</h2>
      {children}
    </div>
  )
}

