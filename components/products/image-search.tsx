"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageSearchProps {
  onSearch: (imageData: string, keywords: string[]) => void
}

export function ImageSearch({ onSearch }: ImageSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const analyzeImage = async (imageUrl: string) => {
    setIsAnalyzing(true)

    // Simulate AI image analysis
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Extract mock keywords based on image characteristics
    // In a real app, this would use AI vision API
    const mockKeywords = ["electronics", "laptop", "computer", "tech"]

    setIsAnalyzing(false)
    onSearch(imageUrl, mockKeywords)
    setIsOpen(false)
    setPreviewUrl(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
        analyzeImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setPreviewUrl(null)
    setIsAnalyzing(false)
  }

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setIsOpen(true)} className="shrink-0">
        <Camera className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 relative">
            <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>

            <h3 className="text-lg font-semibold mb-4">Search by Image</h3>
            <p className="text-sm text-muted-foreground mb-6">Upload an image to find similar products</p>

            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
                  "hover:border-primary transition-colors",
                )}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Click to upload</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
                </div>
                {isAnalyzing && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm text-muted-foreground">Analyzing image...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
