"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationSelector } from "@/components/location-selector"
import Link from "next/link"

interface MarketPrice {
  id: number
  fish_species_id: number
  upazila_id: number
  price_per_kg: number
  size_category: string
  market_name: string
  price_date: string
  is_verified: boolean
  fish_species: {
    id: number
    name_bn: string
    name_en: string
    scientific_name: string
    fish_categories: {
      name_bn: string
      name_en: string
    }
  }
  upazilas: {
    id: number
    name_bn: string
    name_en: string
    districts: {
      id: number
      name_bn: string
      name_en: string
      divisions: {
        id: number
        name_bn: string
        name_en: string
      }
    }
  }
}

interface FishSpecies {
  id: number
  name_bn: string
  name_en: string
}

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [fishSpecies, setFishSpecies] = useState<FishSpecies[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecies, setSelectedSpecies] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{
    divisionId?: number
    districtId?: number
    upazilaId?: number
  }>({})

  // Fetch fish species for filter
  useEffect(() => {
    fetch("/api/fish/species")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFishSpecies(data)
        } else {
          console.error("Fish species data is not an array:", data)
          setFishSpecies([])
        }
      })
      .catch((error) => {
        console.error("Error fetching fish species:", error)
        setFishSpecies([])
      })
  }, [])

  // Fetch market prices based on filters
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()

    if (selectedLocation.divisionId) params.append("division", selectedLocation.divisionId.toString())
    if (selectedLocation.districtId) params.append("district", selectedLocation.districtId.toString())
    if (selectedLocation.upazilaId) params.append("upazila", selectedLocation.upazilaId.toString())
    if (selectedSpecies) params.append("species", selectedSpecies)

    fetch(`/api/market-prices?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPrices(data)
        } else {
          console.error("Market prices data is not an array:", data)
          setPrices([])
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching market prices:", error)
        setPrices([])
        setLoading(false)
      })
  }, [selectedLocation, selectedSpecies])

  // Filter prices by search term
  const filteredPrices = Array.isArray(prices)
    ? prices.filter(
        (price) =>
          price.fish_species?.name_bn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.fish_species?.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.market_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const getSizeCategoryText = (category: string) => {
    switch (category) {
      case "small":
        return "ছোট"
      case "medium":
        return "মাঝারি"
      case "large":
        return "বড়"
      default:
        return "মাঝারি"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("bn-BD")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">বাজার দর</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/market-prices/report">
                <Button>দর রিপোর্ট করুন</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">ড্যাশবোর্ড</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">মাছের বাজার দর</h2>
            <p className="text-gray-600">সারাদেশের সর্বশেষ মাছের বাজার দর জানুন বিভাগ, জেলা ও উপজেলা অনুযায়ী</p>
          </div>

          {/* Filters */}
          <div className="mb-8 grid lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="মাছের নাম বা বাজার খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger>
                  <SelectValue placeholder="মাছের প্রজাতি নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব প্রজাতি</SelectItem>
                  {fishSpecies.map((species) => (
                    <SelectItem key={species.id} value={species.id.toString()}>
                      {species.name_bn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2">
              <LocationSelector onLocationChange={setSelectedLocation} showLabels={false} />
            </div>
          </div>

          {/* Price Statistics */}
          <div className="mb-8 grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">মোট দর</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{filteredPrices.length}</div>
                <p className="text-sm text-gray-500">টি দর পাওয়া গেছে</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">গড় দর</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {filteredPrices.length > 0
                    ? Math.round(
                        filteredPrices.reduce((sum, price) => sum + price.price_per_kg, 0) / filteredPrices.length,
                      )
                    : 0}
                </div>
                <p className="text-sm text-gray-500">টাকা/কেজি</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">সর্বোচ্চ দর</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {filteredPrices.length > 0 ? Math.max(...filteredPrices.map((p) => p.price_per_kg)) : 0}
                </div>
                <p className="text-sm text-gray-500">টাকা/কেজি</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">সর্বনিম্ন দর</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {filteredPrices.length > 0 ? Math.min(...filteredPrices.map((p) => p.price_per_kg)) : 0}
                </div>
                <p className="text-sm text-gray-500">টাকা/কেজি</p>
              </CardContent>
            </Card>
          </div>

          {/* Price List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">সর্বশেষ বাজার দর</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{filteredPrices.length} টি দর</Badge>
                {(selectedLocation.divisionId || selectedLocation.districtId || selectedLocation.upazilaId) && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLocation({})}>
                    সব এলাকা দেখুন
                  </Button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>দর লোড হচ্ছে...</p>
              </div>
            ) : filteredPrices.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500 mb-4">কোনো বাজার দর পাওয়া যায়নি।</p>
                  <Link href="/market-prices/report">
                    <Button>প্রথম দর রিপোর্ট করুন</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredPrices.map((price) => (
                  <Card key={price.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900">{price.fish_species?.name_bn}</h4>
                              <p className="text-sm text-gray-600">{price.fish_species?.name_en}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="secondary">{price.fish_species?.fish_categories?.name_bn}</Badge>
                                <Badge variant="outline">{getSizeCategoryText(price.size_category)}</Badge>
                                {price.is_verified && <Badge className="bg-green-100 text-green-800">যাচাইকৃত</Badge>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">৳{price.price_per_kg}</div>
                              <p className="text-sm text-gray-500">প্রতি কেজি</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                              <span>
                                📍 {price.upazilas?.name_bn}, {price.upazilas?.districts?.name_bn},{" "}
                                {price.upazilas?.districts?.divisions?.name_bn}
                              </span>
                              {price.market_name && <span>🏪 {price.market_name}</span>}
                            </div>
                            <span>📅 {formatDate(price.price_date)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
