"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { dataStore, type Product } from "@/lib/data"
import { Navbar } from "@/components/layout/navbar"
import { ProductCard } from "@/components/products/product-card"
import { CategoryFilter } from "@/components/products/category-filter"
import { SearchBar } from "@/components/products/search-bar"
import { Recommendations } from "@/components/products/recommendations"
import { Button } from "@/components/ui/button"
import { PackagePlus } from "lucide-react"
import Link from "next/link"

export default function ExplorePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [imageSearchActive, setImageSearchActive] = useState(false)
  const [imageKeywords, setImageKeywords] = useState<string[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load products from storage
    const allProducts = dataStore.getProducts()
    setProducts(allProducts)
    setFilteredProducts(allProducts)
  }, [])

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filter by image search keywords
    if (imageSearchActive && imageKeywords.length > 0) {
      filtered = filtered.filter((p) =>
        imageKeywords.some(
          (keyword) =>
            p.name.toLowerCase().includes(keyword.toLowerCase()) ||
            p.description.toLowerCase().includes(keyword.toLowerCase()) ||
            p.category.toLowerCase().includes(keyword.toLowerCase()),
        ),
      )
    }
    // Filter by text search query
    else if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products, imageSearchActive, imageKeywords])

  const handleImageSearch = (imageData: string, keywords: string[]) => {
    setImageKeywords(keywords)
    setImageSearchActive(true)
    setSearchQuery("")
    setSelectedCategory("all")
  }

  const handleTextSearch = (value: string) => {
    setSearchQuery(value)
    if (value) {
      setImageSearchActive(false)
      setImageKeywords([])
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setImageSearchActive(false)
    setImageKeywords([])
  }

  if (isLoading) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Explore Products</h1>
            <p className="text-muted-foreground">Discover great deals on preloved items</p>
          </div>
          <Button asChild>
            <Link href="/sell">
              <PackagePlus className="mr-2 h-4 w-4" />
              Sell Item
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <SearchBar value={searchQuery} onChange={handleTextSearch} onImageSearch={handleImageSearch} />
          {imageSearchActive && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Searching by image:</span>
              <div className="flex gap-1">
                {imageKeywords.map((keyword, i) => (
                  <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImageSearchActive(false)
                  setImageKeywords([])
                }}
              >
                Clear
              </Button>
            </div>
          )}
          <CategoryFilter selected={selectedCategory} onSelect={handleCategoryChange} />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        <Recommendations products={products} userId={user.id} />
      </div>
    </div>
  )
}
