"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { dataStore, type BargainRequest } from "@/lib/data"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Check, X, Clock } from "lucide-react"

export default function BargainsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [receivedBargains, setReceivedBargains] = useState<BargainRequest[]>([])
  const [sentBargains, setSentBargains] = useState<BargainRequest[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return

    const bargains = dataStore.getBargainRequests()

    // Received bargains (where user is seller)
    const received = bargains.filter((b) => b.sellerId === user.id)
    setReceivedBargains(received.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

    // Sent bargains (where user is buyer)
    const sent = bargains.filter((b) => b.buyerId === user.id)
    setSentBargains(sent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }, [user])

  const handleResponse = (bargainId: string, accept: boolean) => {
    if (!user) return

    const bargains = dataStore.getBargainRequests()
    const bargain = bargains.find((b) => b.id === bargainId)

    if (bargain) {
      bargain.status = accept ? "accepted" : "rejected"
      dataStore.setBargainRequests(bargains)

      if (accept) {
        // Update product price
        const products = dataStore.getProducts()
        const product = products.find((p) => p.id === bargain.productId)
        if (product) {
          product.price = bargain.offeredPrice
          dataStore.setProducts(products)
        }

        toast({
          title: "Bargain accepted",
          description: `Price updated to ${formatPrice(bargain.offeredPrice)}`,
        })
      } else {
        toast({
          title: "Bargain rejected",
          description: "The buyer has been notified",
        })
      }

      // Refresh data
      setReceivedBargains((prev) => prev.map((b) => (b.id === bargainId ? { ...b, status: bargain.status } : b)))
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Bargain Requests</h1>
            <p className="text-muted-foreground">Manage price negotiations for electronics</p>
          </div>
        </div>

        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="received">
              Received ({receivedBargains.filter((b) => b.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="sent">Sent ({sentBargains.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-6">
            {receivedBargains.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No bargain requests</h2>
                  <p className="text-muted-foreground">Buyers can negotiate prices on your electronics listings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {receivedBargains.map((bargain) => (
                  <Card key={bargain.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{bargain.productName}</h3>
                          <p className="text-sm text-muted-foreground">From: {bargain.buyerName}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(bargain.createdAt)}</p>
                        </div>
                        <Badge
                          variant={
                            bargain.status === "accepted"
                              ? "default"
                              : bargain.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {bargain.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                          {bargain.status === "accepted" && <Check className="mr-1 h-3 w-3" />}
                          {bargain.status === "rejected" && <X className="mr-1 h-3 w-3" />}
                          {bargain.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Original Price</p>
                          <p className="font-semibold">{formatPrice(bargain.originalPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Offered Price</p>
                          <p className="font-semibold text-accent">{formatPrice(bargain.offeredPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Discount</p>
                          <p className="font-semibold text-accent">
                            {Math.round(((bargain.originalPrice - bargain.offeredPrice) / bargain.originalPrice) * 100)}
                            %
                          </p>
                        </div>
                      </div>

                      {bargain.message && (
                        <div className="mb-4 p-3 rounded-lg bg-muted">
                          <p className="text-sm">{bargain.message}</p>
                        </div>
                      )}

                      {bargain.status === "pending" && (
                        <div className="flex gap-2">
                          <Button onClick={() => handleResponse(bargain.id, true)} className="flex-1">
                            <Check className="mr-2 h-4 w-4" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleResponse(bargain.id, false)}
                            variant="outline"
                            className="flex-1 bg-transparent"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {bargain.status !== "pending" && (
                        <Button asChild variant="outline" className="w-full bg-transparent">
                          <Link href={`/product/${bargain.productId}`}>View Product</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            {sentBargains.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No sent requests</h2>
                  <p className="text-muted-foreground">You can negotiate prices on electronics when browsing</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sentBargains.map((bargain) => (
                  <Card key={bargain.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{bargain.productName}</h3>
                          <p className="text-sm text-muted-foreground">To: {bargain.sellerName}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(bargain.createdAt)}</p>
                        </div>
                        <Badge
                          variant={
                            bargain.status === "accepted"
                              ? "default"
                              : bargain.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {bargain.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                          {bargain.status === "accepted" && <Check className="mr-1 h-3 w-3" />}
                          {bargain.status === "rejected" && <X className="mr-1 h-3 w-3" />}
                          {bargain.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Original Price</p>
                          <p className="font-semibold">{formatPrice(bargain.originalPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Your Offer</p>
                          <p className="font-semibold text-accent">{formatPrice(bargain.offeredPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Discount</p>
                          <p className="font-semibold text-accent">
                            {Math.round(((bargain.originalPrice - bargain.offeredPrice) / bargain.originalPrice) * 100)}
                            %
                          </p>
                        </div>
                      </div>

                      {bargain.message && (
                        <div className="mb-4 p-3 rounded-lg bg-muted">
                          <p className="text-sm">{bargain.message}</p>
                        </div>
                      )}

                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href={`/product/${bargain.productId}`}>View Product</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
