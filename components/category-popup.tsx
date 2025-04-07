import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import UrlCard from "@/components/url-card"
import type { KnowledgeBase } from "@/lib/supabase"

interface CategoryPopupProps {
  category: string
  items: KnowledgeBase[]
  isOpen: boolean
  onClose: () => void
}

export function CategoryPopup({ category, items, isOpen, onClose }: CategoryPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold">{category}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {items.map((item) => (
            <UrlCard
              key={item.id}
              title={item.headline}
              url={item.original_url}
              category={item.category}
              summary={item.summary}
              formattedDate={new Date(item.created_at).toLocaleDateString()}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 