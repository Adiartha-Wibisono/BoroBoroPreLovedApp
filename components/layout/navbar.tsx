"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, Moon, Sun, Package, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/data"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [cartCount, setCartCount] = useState(0)
  const [bargainCount, setBargainCount] = useState(0)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Get cart count
    if (user) {
      const cart = dataStore.getCart(user.id)
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0))

      const bargains = dataStore.getBargainRequests()
      const pendingBargains = bargains.filter((b) => b.sellerId === user.id && b.status === "pending")
      setBargainCount(pendingBargains.length)
    }

    // Get theme preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark"
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [user, pathname])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Don't show navbar on auth pages
  if (pathname === "/signin" || pathname === "/signup" || pathname === "/") {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/explore"
            className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            BoroBoro
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Button asChild variant={pathname === "/explore" ? "secondary" : "ghost"}>
              <Link href="/explore">Explore</Link>
            </Button>
            <Button asChild variant={pathname === "/dashboard" ? "secondary" : "ghost"}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant={pathname === "/bargains" ? "secondary" : "ghost"}>
              <Link href="/bargains">Bargains</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {user && (
            <>
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/bargains">
                  <MessageSquare className="h-5 w-5" />
                  {bargainCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {bargainCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Package className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bargains">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Bargains
                      {bargainCount > 0 && (
                        <Badge className="ml-auto" variant="secondary">
                          {bargainCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
