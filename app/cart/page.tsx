"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { dataStore, type Product, type CartItem, type Order } from "@/lib/data"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CartItemWithProduct extends CartItem {
  product: Product
}

export default function CartPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return

    // Load cart items with product details
    const cart = dataStore.getCart(user.id)
    const products = dataStore.getProducts()

    const itemsWithProducts = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (!product) return null
        return { ...item, product }
      })
      .filter((item): item is CartItemWithProduct => item !== null)

    setCartItems(itemsWithProducts)
  }, [user])

  const updateQuantity = (productId: string, change: number) => {
    if (!user) return

    const cart = dataStore.getCart(user.id)
    const item = cart.find((i) => i.productId === productId)

    if (item) {
      item.quantity = Math.max(1, item.quantity + change)
      dataStore.setCart(user.id, cart)

      // Update local state
      setCartItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: item.quantity } : i)))
    }
  }

  const removeItem = (productId: string) => {
    if (!user) return

    const cart = dataStore.getCart(user.id).filter((i) => i.productId !== productId)
    dataStore.setCart(user.id, cart)
    setCartItems((prev) => prev.filter((i) => i.productId !== productId))

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    })
  }

  const handleCheckout = () => {
    if (!user || cartItems.length === 0) return

    setIsCheckingOut(true)

    // Create order
    const order: Order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        productName: item.product.name,
      })),
      total: calculateTotal(),
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    // Save order
    const orders = dataStore.getOrders(user.id)
    orders.push(order)
    dataStore.setOrders(user.id, orders)

    // Mark products as sold out
    const products = dataStore.getProducts()
    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.product.id)
      if (product) {
        product.soldOut = true
      }
    })
    dataStore.setProducts(products)

    // Clear cart
    dataStore.setCart(user.id, [])

    // Create notification
    const notification = {
      id: `notif_${Date.now()}`,
      userId: user.id,
      message: `Order completed! ${cartItems.length} item(s) purchased.`,
      type: "order" as const,
      read: false,
      createdAt: new Date().toISOString(),
    }
    const notifications = dataStore.getNotifications(user.id)
    notifications.push(notification)
    dataStore.setNotifications(user.id, notifications)

    toast({
      title: "Order completed!",
      description: "Your purchase has been completed successfully",
    })

    setIsCheckingOut(false)
    router.push("/orders")
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/explore">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some items to get started</p>
              <Button asChild>
                <Link href="/explore">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.productId}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.product.imageUrl || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.product.condition}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.productId, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.productId, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <p className="font-bold text-lg">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Order Summary</h2>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items ({cartItems.length})</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-accent">Free</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">{formatPrice(calculateTotal())}</span>
                    </div>

                    <Button onClick={handleCheckout} disabled={isCheckingOut} className="w-full" size="lg">
                      {isCheckingOut ? "Processing..." : "Complete Purchase"}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By completing this purchase, you agree to the BoroBoro terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
