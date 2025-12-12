"use client"

import { Button } from "@/components/ui/button"
import { Package, Shirt, Book, Dumbbell, Home, MoreHorizontal } from "lucide-react"

const categories = [
  { value: "all", label: "All", icon: Package },
  { value: "electronics", label: "Electronics", icon: Package },
  { value: "fashion", label: "Fashion", icon: Shirt },
  { value: "books", label: "Books", icon: Book },
  { value: "sports", label: "Sports", icon: Dumbbell },
  { value: "home", label: "Home", icon: Home },
  { value: "other", label: "Other", icon: MoreHorizontal },
]

interface CategoryFilterProps {
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Button
            key={category.value}
            variant={selected === category.value ? "default" : "outline"}
            onClick={() => onSelect(category.value)}
            className="shrink-0"
          >
            <Icon className="mr-2 h-4 w-4" />
            {category.label}
          </Button>
        )
      })}
    </div>
  )
}
