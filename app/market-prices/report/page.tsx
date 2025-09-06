"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationSelector } from "@/components/location-selector"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FishSpecies {
  id: number
  name_bn: string
  name_en: string
  fish_categories: {
    name_bn: string
  }
}

export default function ReportPricePage() {
  const router = useRouter()
  const [fishSpecies, setFishSpecies] = useState<FishSpecies[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fish_species_id: "",
    price_per_kg: "",
    size_category: "medium",
    market_name: "",
    price_date: new Date().toISOString().split("T")[0],
  })

  const [selectedLocation, setSelectedLocation] = useState<{
    divisionId?: number
    districtId?: number
    upazilaId?: number
  }>({})

  // Fetch fish species
  useEffect(() => {
    fetch("/api/fish/species")
      .then((res) => res.json())
      .then((data) => setFishSpecies(data))
      .catch((error) => console.error("Error fetching fish species:", error))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!selectedLocation.upazilaId) {
      setError("দয়া করে উপজেলা নির্বাচন করুন")
      setLoading(false)
      return
    }

    if (!formData.fish_species_id || !formData.price_per_kg) {
      setError("সব প্রয়োজনীয় তথ্য পূরণ করুন")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/market-prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          upazila_id: selectedLocation.upazilaId,
          price_per_kg: Number.parseFloat(formData.price_per_kg),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "দর রিপোর্ট করতে সমস্যা হয়েছে")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/market-prices")
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "একটি ত্রুটি ঘটেছে")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">দর সফলভাবে রিপোর্ট হয়েছে!</h3>
            <p className="text-gray-600 mb-4">আপনার রিপোর্ট করা দর যাচাই করে প্রকাশ করা হবে।</p>
            <Link href="/market-prices">
              <Button>বাজার দর দেখুন</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/market-prices">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">দর রিপোর্ট করুন</h1>
            </div>
            <Link href="/market-prices">
              <Button variant="outline">বাজার দরে ফিরুন</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">নতুন বাজার দর রিপোর্ট করুন</h2>
            <p className="text-gray-600">আপনার এলাকার সর্বশেষ মাছের দর রিপোর্ট করে অন্যদের সাহায্য করুন</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>দর রিপোর্ট ফর্ম</CardTitle>
              <CardDescription>সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Selection */}
                <div>
                  <Label className="text-base font-semibold">এলাকা নির্বাচন করুন *</Label>
                  <div className="mt-2">
                    <LocationSelector onLocationChange={setSelectedLocation} />
                  </div>
                </div>

                {/* Fish Species Selection */}
                <div>
                  <Label htmlFor="fish_species">মাছের প্রজাতি *</Label>
                  <Select
                    value={formData.fish_species_id}
                    onValueChange={(value) => handleInputChange("fish_species_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="মাছের প্রজাতি নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {fishSpecies.map((species) => (
                        <SelectItem key={species.id} value={species.id.toString()}>
                          {species.name_bn} ({species.fish_categories.name_bn})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="price">দর (টাকা/কেজি) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="যেমন: ২৫০"
                    value={formData.price_per_kg}
                    onChange={(e) => handleInputChange("price_per_kg", e.target.value)}
                    required
                  />
                </div>

                {/* Size Category */}
                <div>
                  <Label htmlFor="size">মাছের আকার</Label>
                  <Select
                    value={formData.size_category}
                    onValueChange={(value) => handleInputChange("size_category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">ছোট</SelectItem>
                      <SelectItem value="medium">মাঝারি</SelectItem>
                      <SelectItem value="large">বড়</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Market Name */}
                <div>
                  <Label htmlFor="market">বাজারের নাম (ঐচ্ছিক)</Label>
                  <Input
                    id="market"
                    placeholder="যেমন: কাওরান বাজার"
                    value={formData.market_name}
                    onChange={(e) => handleInputChange("market_name", e.target.value)}
                  />
                </div>

                {/* Price Date */}
                <div>
                  <Label htmlFor="date">দরের তারিখ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.price_date}
                    onChange={(e) => handleInputChange("price_date", e.target.value)}
                  />
                </div>

                {error && (
                  <Alert>
                    <AlertDescription className="text-red-600">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "রিপোর্ট করা হচ্ছে..." : "দর রিপোর্ট করুন"}
                  </Button>
                  <Link href="/market-prices">
                    <Button type="button" variant="outline">
                      বাতিল
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>দর রিপোর্ট করার নির্দেশনা</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>সঠিক ও বর্তমান দর রিপোর্ট করুন</li>
                <li>দর প্রতি কেজি হিসেবে দিন</li>
                <li>মাছের আকার অনুযায়ী সঠিক ক্যাটেগরি নির্বাচন করুন</li>
                <li>বাজারের নাম দিলে অন্যদের সুবিধা হবে</li>
                <li>ভুল তথ্য দিলে আপনার অ্যাকাউন্ট বন্ধ হতে পারে</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
