"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { dataStore, type Product } from "@/lib/data"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Recommendations, addToViewHistory } from "@/components/products/recommendations"

interface PageProps {
  params: { id: string }
}

export default function ProductPage({ params }: PageProps) {
  const { id } = params
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])

  // Redirect ke signin kalau belum login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  // Load product data dengan debug logs
  useEffect(() => {
    if (!id) return

    const products = dataStore.getProducts()
    console.log("All products:", products) // lihat semua produk

    const foundProduct = products.find((p) => p.id === String(id))
    console.log("Product ID from URL:", id)
    console.log("Found product:", foundProduct)

    setProduct(foundProduct || null)
    setAllProducts(products)

    if (user && foundProduct) {
      addToViewHistory(user.id, foundProduct.id)
    }
  }, [id, user])

  const handleAddToCart = () => {
    if (!user || !product) return

    const cart = dataStore.getCart(user.id)
    const existingItem = cart.find((item) => item.productId === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ productId: product.id, quantity: 1 })
    }

    dataStore.setCart(user.id, cart)

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })

    router.push("/cart")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading || !user || !id) {
    return <div className="min-h-screen bg-background" />
  }

  if (!product) {
    console.log("Product not found for id:", id)
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/explore">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Explore
            </Link>
          </Button>
          <p className="text-center text-muted-foreground text-lg">Product not found</p>
        </div>
      </div>
    )
  }

  const canBargain = product.category === "electronics" && !product.soldOut
  const maxDiscount = Math.floor(product.price * 0.2)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/explore">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
            {product.soldOut && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="secondary" className="text-2xl px-6 py-3">
                  Sold Out
                </Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium">{product.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{product.category}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-medium">{product.sellerName}</p>
                </div>
              </CardContent>
            </Card>

            {canBargain && (
              <Card className="border-accent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-accent">Bargaining Available</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Electronics are eligible for price negotiation. You can request up to {formatPrice(maxDiscount)} ({20}%)
                        discount.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <Button onClick={handleAddToCart} disabled={product.soldOut} className="w-full" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.soldOut ? "Sold Out" : "Add to Cart"}
              </Button>

              {canBargain && (
                <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
                  <Link href={`/bargain/${product.id}`}>
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Request Bargain
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <Recommendations products={allProducts} currentProductId={product.id} userId={user.id} />
      </div>
    </div>
  )
}
