"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { dataStore, type Product } from "@/lib/data"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PackagePlus, Package, ShoppingBag, TrendingUp } from "lucide-react"
import { ProductCard } from "@/components/products/product-card"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [myProducts, setMyProducts] = useState<Product[]>([])
  const [myOrders, setMyOrders] = useState<number>(0)
  const [stats, setStats] = useState({
    totalListings: 0,
    soldItems: 0,
    activeListings: 0,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return

    // Load user's products
    const products = dataStore.getProducts()
    const userProducts = products.filter((p) => p.sellerId === user.id)
    setMyProducts(userProducts)

    // Calculate stats
    setStats({
      totalListings: userProducts.length,
      soldItems: userProducts.filter((p) => p.soldOut).length,
      activeListings: userProducts.filter((p) => !p.soldOut).length,
    })

    // Load orders count
    const orders = dataStore.getOrders(user.id)
    setMyOrders(orders.length)
  }, [user])

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your listings and track your activity</p>
          </div>
          <Button asChild size="lg">
            <Link href="/sell">
              <PackagePlus className="mr-2 h-5 w-5" />
              List New Item
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">Currently available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold Items</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.soldItems}</div>
              <p className="text-xs text-muted-foreground">Successfully sold</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Purchases</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myOrders}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/orders" className="hover:underline text-primary">
                  View history
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Listings</h2>
            {myProducts.length > 0 && (
              <div className="flex gap-2">
                <Badge variant="outline">{stats.activeListings} Active</Badge>
                <Badge variant="secondary">{stats.soldItems} Sold</Badge>
              </div>
            )}
          </div>

          {myProducts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-6">Start selling by listing your first item</p>
                <Button asChild>
                  <Link href="/sell">
                    <PackagePlus className="mr-2 h-4 w-4" />
                    List Your First Item
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
