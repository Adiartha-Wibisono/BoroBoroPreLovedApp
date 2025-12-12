// Local data storage for BoroBoro marketplace
export interface User {
  id: string
  name: string
  nim: string
  email: string
  password: string
  role: "buyer" | "seller" | "both"
  createdAt: string
}

export interface Product {
  id: string
  name: string
  price: number
  category: "electronics" | "fashion" | "books" | "sports" | "home" | "other"
  description: string
  condition: string
  imageUrl: string
  sellerId: string
  sellerName: string
  soldOut: boolean
  createdAt: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: { productId: string; quantity: number; price: number; productName: string }[]
  total: number
  status: "completed" | "pending"
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  message: string
  type: "soldout" | "newproduct" | "discount" | "order"
  read: boolean
  createdAt: string
}

export interface BargainRequest {
  id: string
  productId: string
  productName: string
  originalPrice: number
  offeredPrice: number
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  status: "pending" | "accepted" | "rejected"
  message: string
  createdAt: string
}

// Initialize data from localStorage or use defaults
const getStorageData = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const setStorageData = <T,>(key: string, value: T): void => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

// Sample products data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "MacBook Air M1",
    price: 8500000,
    category: "electronics",
    description: "Like new, barely used. 8GB RAM, 256GB SSD",
    condition: "Excellent",
    imageUrl: "/macbook-air-laptop.jpg",
    sellerId: "seller1",
    sellerName: "Ahmad Budi",
    soldOut: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sony WH-1000XM4",
    price: 3200000,
    category: "electronics",
    description: "Premium noise cancelling headphones",
    condition: "Good",
    imageUrl: "/wireless-headphones.png",
    sellerId: "seller1",
    sellerName: "Ahmad Budi",
    soldOut: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Uniqlo Jacket",
    price: 250000,
    category: "fashion",
    description: "Navy blue jacket, size M",
    condition: "Very Good",
    imageUrl: "/navy-jacket.jpg",
    sellerId: "seller2",
    sellerName: "Siti Rahayu",
    soldOut: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Introduction to Algorithms",
    price: 450000,
    category: "books",
    description: "Classic CS textbook, 3rd edition",
    condition: "Good",
    imageUrl: "/algorithms-textbook.jpg",
    sellerId: "seller2",
    sellerName: "Siti Rahayu",
    soldOut: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Canon EOS M50",
    price: 6500000,
    category: "electronics",
    description: "Mirrorless camera with kit lens",
    condition: "Excellent",
    imageUrl: "/canon-camera.jpg",
    sellerId: "seller1",
    sellerName: "Ahmad Budi",
    soldOut: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Nike Air Max",
    price: 850000,
    category: "sports",
    description: "Size 42, white colorway",
    condition: "Good",
    imageUrl: "/nike-air-max-white.jpg",
    sellerId: "seller2",
    sellerName: "Siti Rahayu",
    soldOut: false,
    createdAt: new Date().toISOString(),
  },
]

// Data management functions
export const dataStore = {
  // Users
  getUsers: (): User[] => getStorageData("boroboro_users", []),
  setUsers: (users: User[]) => setStorageData("boroboro_users", users),

  // Products
  getProducts: (): Product[] => {
    const products = getStorageData("boroboro_products", initialProducts)
    // Initialize if empty
    if (products.length === 0) {
      setStorageData("boroboro_products", initialProducts)
      return initialProducts
    }
    return products
  },
  setProducts: (products: Product[]) => setStorageData("boroboro_products", products),

  // Cart
  getCart: (userId: string): CartItem[] => getStorageData(`boroboro_cart_${userId}`, []),
  setCart: (userId: string, cart: CartItem[]) => setStorageData(`boroboro_cart_${userId}`, cart),

  // Orders
  getOrders: (userId: string): Order[] => getStorageData(`boroboro_orders_${userId}`, []),
  setOrders: (userId: string, orders: Order[]) => setStorageData(`boroboro_orders_${userId}`, orders),

  // Notifications
  getNotifications: (userId: string): Notification[] => getStorageData(`boroboro_notifications_${userId}`, []),
  setNotifications: (userId: string, notifications: Notification[]) =>
    setStorageData(`boroboro_notifications_${userId}`, notifications),

  // Current user
  getCurrentUser: (): User | null => getStorageData("boroboro_current_user", null),
  setCurrentUser: (user: User | null) => setStorageData("boroboro_current_user", user),

  // Bargain requests
  getBargainRequests: (): BargainRequest[] => getStorageData("boroboro_bargains", []),
  setBargainRequests: (bargains: BargainRequest[]) => setStorageData("boroboro_bargains", bargains),
}

// Validation helpers
export const validateBinusianEmail = (email: string): boolean => {
  return email.endsWith("@binus.ac.id") || email.endsWith("@binus.edu")
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 5
}
