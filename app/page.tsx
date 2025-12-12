import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Search, ShoppingCart, MessageSquare, Sparkles, Shield, Users } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-accent/5 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Trusted by Binusian Community
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-balance">
                Discover Amazing Deals on{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Preloved Items
                </span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-xl">
                Buy and sell secondhand electronics, fashion, books, and more within the trusted Binusian community.
                Safe, easy, and sustainable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
                  <Link href="/explore">Browse Products</Link>
                </Button>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
                  <Image src="/modern-laptop-desk.png" alt="Electronics" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-semibold text-sm">Electronics</p>
                  </div>
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
                  <Image src="/fashion-clothing-on-rack.jpg" alt="Fashion" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-semibold text-sm">Fashion</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
                  <Image src="/stack-of-textbooks.png" alt="Books" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-semibold text-sm">Books & Study</p>
                  </div>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
                  <Image src="/assorted-sports-gear.png" alt="Sports" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-semibold text-sm">Sports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose BoroBoro?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The best platform for Binusian community to buy and sell preloved items safely and conveniently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Smart Search</h3>
            <p className="text-muted-foreground">
              Find exactly what you need with our powerful search and filter system across all categories
            </p>
          </div>

          <div className="p-8 rounded-2xl border bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Bargaining System</h3>
            <p className="text-muted-foreground">
              Negotiate prices on electronics with sellers through our built-in chat system
            </p>
          </div>

          <div className="p-8 rounded-2xl border bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Secure & Trusted</h3>
            <p className="text-muted-foreground">
              Trade safely within the verified Binusian community with secure transactions
            </p>
          </div>

          <div className="p-8 rounded-2xl border bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Wide Selection</h3>
            <p className="text-muted-foreground">
              Browse electronics, fashion, books, sports equipment, and home items all in one place
            </p>
          </div>

          <div className="p-8 rounded-2xl border bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <ShoppingCart className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Easy Checkout</h3>
            <p className="text-muted-foreground">
              Simple and fast checkout process with cart management and order tracking
            </p>
          </div>

          <div className="p-8 rounded-2xl border bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Community First</h3>
            <p className="text-muted-foreground">
              Built by Binusians, for Binusians - a marketplace that understands your needs
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Get started in just 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-xl mb-2">Sign Up</h3>
              <p className="text-muted-foreground">Create your free account with your Binusian email in seconds</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-xl mb-2">Browse or List</h3>
              <p className="text-muted-foreground">Search for items you need or list your own preloved items to sell</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-xl mb-2">Buy or Sell</h3>
              <p className="text-muted-foreground">Complete transactions securely and enjoy your preloved finds</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
              Ready to Start Your Sustainable Shopping Journey?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Join hundreds of Binusians already buying and selling on BoroBoro. Create your free account today and
              discover amazing deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link href="/signup">Create Free Account</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/explore">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
