"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type User, dataStore } from "./data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, nim: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const currentUser = dataStore.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const users = dataStore.getUsers()
    const foundUser = users.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      setUser(foundUser)
      dataStore.setCurrentUser(foundUser)
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }

  const signup = async (name: string, nim: string, email: string, password: string) => {
    const users = dataStore.getUsers()

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return { success: false, error: "Email already registered" }
    }

    // Validate Binusian email
    if (!email.endsWith("@binus.ac.id") && !email.endsWith("@binus.edu")) {
      return { success: false, error: "Please use a valid Binusian email address" }
    }

    // Validate password
    if (password.length < 5) {
      return { success: false, error: "Password must be at least 5 characters" }
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      nim,
      email,
      password,
      role: "both", // Users can be both buyers and sellers
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    dataStore.setUsers(users)
    setUser(newUser)
    dataStore.setCurrentUser(newUser)

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    dataStore.setCurrentUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
