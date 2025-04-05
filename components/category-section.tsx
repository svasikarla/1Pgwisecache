import type { UrlCardProps } from "@/components/url-card"
import UrlCard from "@/components/url-card"

interface CategorySectionProps {
  title: string
  items: UrlCardProps[]
}

export default function CategorySection({ title, items }: CategorySectionProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-50 dark:bg-blue-950",
      Science: "bg-green-50 dark:bg-green-950",
      Business: "bg-amber-50 dark:bg-amber-950",
      Health: "bg-red-50 dark:bg-red-950",
      Ideas: "bg-purple-50 dark:bg-purple-950",
    }

    return colors[category] || "bg-gray-50 dark:bg-gray-900"
  }

  return (
    <section className={`p-6 rounded-lg ${getCategoryColor(title)}`}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <UrlCard key={index} {...item} />
        ))}
      </div>
    </section>
  )
}

