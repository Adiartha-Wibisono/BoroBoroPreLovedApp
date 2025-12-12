"use client"

import type { Product } from "@/lib/data"
import { ProductCard } from "@/components/products/product-card"
import { Sparkles } from "lucide-react"

interface RecommendationsProps {
  products: Product[]
  currentProductId?: string
  userId?: string
}

export function Recommendations({ products, currentProductId, userId }: RecommendationsProps) {
  // Get recommendations based on various factors
  const getRecommendations = (): Product[] => {
    // Filter out current product if viewing product detail
    const available = products.filter((p) => !p.soldOut && p.id !== currentProductId)

    // Get user's browsing history from localStorage
    const viewHistory = userId ? getViewHistory(userId) : []

    // Calculate scores for each product
    const scored = available.map((product) => {
      let score = 0

      // Recently viewed category gets higher score
      const viewedCategories = viewHistory.map((id) => products.find((p) => p.id === id)?.category).filter(Boolean)
      if (viewedCategories.includes(product.category)) {
        score += 3
      }

      // Popular items (lower id = earlier/more popular)
      score += (100 - Number.parseInt(product.id)) / 10

      // Randomize a bit for variety
      score += Math.random() * 2

      return { product, score }
    })

    // Sort by score and return top 4
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.product)
  }

  const recommendations = getRecommendations()

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">You May Like</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

// Helper to manage view history
function getViewHistory(userId: string): string[] {
  if (typeof window === "undefined") return []
  try {
    const history = window.localStorage.getItem(`boroboro_view_history_${userId}`)
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

export function addToViewHistory(userId: string, productId: string) {
  if (typeof window === "undefined") return
  try {
    const history = getViewHistory(userId)
    // Add to front, remove duplicates, keep last 20
    const updated = [productId, ...history.filter((id) => id !== productId)].slice(0, 20)
    window.localStorage.setItem(`boroboro_view_history_${userId}`, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving view history:", error)
  }
}
