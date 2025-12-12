"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { dataStore } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const [product, setProduct] = useState(null)

  // Redirect ke login kalau belum login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  // Load product dari local storage
  useEffect(() => {
    if (!id) return

    const products = dataStore.getProducts()
    const found = products.find((p) => p.id === id)

    setProduct(found || null)
  }, [id])

  // Loading auth  
  if (isLoading) return <p>Checking user…</p>

  // Kalau product belum ketemu
  if (!product) return <p>Product not found.</p>

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>

      <img
        src={product.imageUrl}
        alt={product.name}
        style={{
          width: "300px",
          borderRadius: "10px",
          marginTop: "15px"
        }}
      />

      <p style={{ marginTop: "10px" }}><strong>Price:</strong> Rp {product.price.toLocaleString()}</p>
      <p><strong>Condition:</strong> {product.condition}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p style={{ marginTop: "10px" }}>{product.description}</p>

      <p style={{ marginTop: "20px", opacity: 0.6 }}>
        Sold by: {product.sellerName}
      </p>
    </div>
  )
}
