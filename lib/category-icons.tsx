import {
  Computer,
  FlaskRoundIcon as Flask,
  Lightbulb,
  Briefcase,
  Heart,
  BookOpen,
  Globe,
  type LucideIcon,
} from "lucide-react"

export function getCategoryIcon(category: string): LucideIcon {
  const icons: Record<string, LucideIcon> = {
    Technology: Computer,
    Science: Flask,
    Ideas: Lightbulb,
    Business: Briefcase,
    Health: Heart,
    Education: BookOpen,
    General: Globe,
  }

  return icons[category] || Globe
}

