"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { dataStore, type Product, type BargainRequest } from "@/lib/data"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: { id: string }
}

export default function BargainPage({ params }: PageProps) {
  const { id } = params
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [offeredPrice, setOfferedPrice] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!id) return
    const products = dataStore.getProducts()
    const foundProduct = products.find((p) => p.id === id)
    setProduct(foundProduct || null)
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !product) return

    setIsSubmitting(true)

    const offered = Number(offeredPrice)
    const maxDiscount = Math.floor(product.price * 0.2)
    const minPrice = product.price - maxDiscount

    // Validate offered price
    if (offered < minPrice) {
      toast({
        title: "Offer too low",
        description: `Maximum discount is 20%. Minimum price: ${formatPrice(minPrice)}`,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (offered >= product.price) {
      toast({
        title: "Invalid offer",
        description: "Your offer should be lower than the original price",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create bargain request
    const bargainRequest: BargainRequest = {
      id: `bargain_${Date.now()}`,
      productId: product.id,
      productName: product.name,
      originalPrice: product.price,
      offeredPrice: offered,
      buyerId: user.id,
      buyerName: user.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      status: "pending",
      message: message || `I would like to purchase this item for ${formatPrice(offered)}`,
      createdAt: new Date().toISOString(),
    }

    // Save bargain request
    const bargains = dataStore.getBargainRequests()
    bargains.push(bargainRequest)
    dataStore.setBargainRequests(bargains)

    toast({
      title: "Bargain request sent!",
      description: "The seller will review your offer shortly",
    })

    setIsSubmitting(false)
    router.push("/explore")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading || !user || !id) {
    return null
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Product not found</p>
        </div>
      </div>
    )
  }

  if (product.category !== "electronics") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Bargaining is only available for electronics</p>
        </div>
      </div>
    )
  }

  const maxDiscount = Math.floor(product.price * 0.2)
  const minPrice = product.price - maxDiscount

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/product/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Link>
        </Button>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-accent" />
                Request Bargain
              </CardTitle>
              <CardDescription>
                Negotiate the price for this electronics item (maximum 20% discount allowed)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Info */}
              <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.condition}</p>
                  <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                </div>
              </div>

              {/* Bargain Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="offeredPrice">Your Offer (Rp)</Label>
                  <Input
                    id="offeredPrice"
                    type="number"
                    placeholder={minPrice.toString()}
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    required
                    min={minPrice}
                    max={product.price - 1}
                  />
                  <p className="text-sm text-muted-foreground">Minimum price: {formatPrice(minPrice)} (20% discount)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message to Seller (optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Explain why you're requesting this price..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Discount Info */}
                {offeredPrice && Number(offeredPrice) >= minPrice && Number(offeredPrice) < product.price && (
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent">
                    <p className="text-sm font-medium text-accent mb-1">Your offer breakdown:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Original price:</span>
                        <span>{formatPrice(product.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your offer:</span>
                        <span className="font-semibold">{formatPrice(Number(offeredPrice))}</span>
                      </div>
                      <div className="flex justify-between text-accent">
                        <span>Discount:</span>
                        <span className="font-semibold">
                          {formatPrice(product.price - Number(offeredPrice))} (
                          {Math.round(((product.price - Number(offeredPrice)) / product.price) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                  {isSubmitting ? "Sending..." : "Send Bargain Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
