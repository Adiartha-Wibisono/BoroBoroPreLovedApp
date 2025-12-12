"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { dataStore, type Product } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [added, setAdded] = useState(false)

  // Redirect kalau belum login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  // Ambil product dari dataStore
  useEffect(() => {
    if (!id) return

    const timer = setTimeout(() => {
      const products = dataStore.getProducts()
      const found = products.find((p) => p.id === id)

      setProduct(found || null)
      setLoadingProduct(false)
    }, 400) // biar ada efek loading

    return () => clearTimeout(timer)
  }, [id])

  // Jika auth masih loading
  if (isLoading) return <div className="p-6">Checking user…</div>

  // Loading product
  if (loadingProduct)
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
          <div className="h-64 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    )

  // Jika produk tidak ditemukan
  if (!product)
    return (
      <div className="p-6">
        <p className="text-red-500">Product not found.</p>
      </div>
    )

  // Tambah ke cart
  const addToCart = () => {
    if (!user) return

    const cart = dataStore.getCart(user.id)
    const exists = cart.find((c) => c.productId === product.id)

    if (exists) {
      exists.quantity += 1
    } else {
      cart.push({
        productId: product.id,
        quantity: 1,
      })
    }

    dataStore.setCart(user.id, cart)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full rounded-lg mb-4 border"
      />

      <p className="text-lg font-bold text-green-700">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      <p className="mt-2 text-gray-700">
        <strong>Condition:</strong> {product.condition}
      </p>

      <p className="text-gray-700">
        <strong>Category:</strong> {product.category}
      </p>

      <p className="mt-4">{product.description}</p>

      <p className="mt-6 text-sm text-gray-500">
        Seller: {product.sellerName}
      </p>

      {/* Sold out badge */}
      {product.soldOut && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg font-medium">
          This product is sold out.
        </div>
      )}

      {/* Add to cart button */}
      {!product.soldOut && (
        <button
          onClick={addToCart}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Add to Cart
        </button>
      )}

      {added && (
        <p className="mt-3 text-green-600 text-center">
          Added to cart ❤️
        </p>
      )}
    </div>
  )
}
