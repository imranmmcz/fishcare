"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface FishCategory {
  id: number
  name_bn: string
  name_en: string
  description_bn: string
  description_en: string
}

interface FishSpecies {
  id: number
  category_id: number
  name_bn: string
  name_en: string
  scientific_name: string
  description_bn: string
  description_en: string
  image_url: string
  fish_categories: FishCategory
}

export default function FishGuidePage() {
  const [species, setSpecies] = useState<FishSpecies[]>([])
  const [categories, setCategories] = useState<FishCategory[]>([])
  const [filteredSpecies, setFilteredSpecies] = useState<FishSpecies[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all") // Updated default value
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch categories and species
  useEffect(() => {
    Promise.all([fetch("/api/fish/categories"), fetch("/api/fish/species")])
      .then(([categoriesRes, speciesRes]) => Promise.all([categoriesRes.json(), speciesRes.json()]))
      .then(([categoriesData, speciesData]) => {
        setCategories(categoriesData)
        setSpecies(speciesData)
        setFilteredSpecies(speciesData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setLoading(false)
      })
  }, [])

  // Filter species based on category and search term
  useEffect(() => {
    let filtered = species

    if (selectedCategory !== "all") {
      filtered = filtered.filter((fish) => fish.category_id.toString() === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (fish) =>
          fish.name_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fish.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fish.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredSpecies(filtered)
  }, [species, selectedCategory, searchTerm])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>তথ্য লোড হচ্ছে...</p>
        </div>
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
              <Link href="/">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🐟</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">মাছ চাষ গাইড</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">ড্যাশবোর্ডে ফিরুন</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">মাছ চাষ গাইড</h2>
            <p className="text-gray-600">বিভিন্ন প্রজাতির মাছের চাষ পদ্ধতি, খাবার ও পরিচর্যার বিস্তারিত তথ্য</p>
          </div>

          {/* Filters */}
          <div className="mb-8 grid md:grid-cols-3 gap-4">
            <div>
              <Input placeholder="মাছের নাম খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="মাছের ধরন নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব ধরনের মাছ</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name_bn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Link href="/fish-guide/disease-diagnosis" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  রোগ নির্ণয়
                </Button>
              </Link>
              <Link href="/fish-guide/seasonal-advice" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  মৌসুমী পরামর্শ
                </Button>
              </Link>
            </div>
          </div>

          {/* Fish Categories Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">মাছের ধরন</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === category.id.toString() ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category.id.toString() ? "all" : category.id.toString())
                  }
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category.name_bn}</CardTitle>
                    <CardDescription className="text-sm">{category.description_bn}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">
                      {species.filter((fish) => fish.category_id === category.id).length} প্রজাতি
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Fish Species Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">মাছের প্রজাতি ({filteredSpecies.length}টি)</h3>
              {selectedCategory !== "all" && (
                <Button variant="ghost" onClick={() => setSelectedCategory("all")}>
                  সব মাছ দেখুন
                </Button>
              )}
            </div>

            {filteredSpecies.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">কোনো মাছ পাওয়া যায়নি। অন্য শর্ত দিয়ে খুঁজে দেখুন।</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpecies.map((fish) => (
                  <Card key={fish.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{fish.name_bn}</CardTitle>
                          <CardDescription className="text-sm">{fish.name_en}</CardDescription>
                          {fish.scientific_name && (
                            <p className="text-xs text-gray-500 italic mt-1">{fish.scientific_name}</p>
                          )}
                        </div>
                        <Badge variant="outline">{fish.fish_categories.name_bn}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {fish.description_bn && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{fish.description_bn}</p>
                      )}
                      <Link href={`/fish-guide/species/${fish.id}`}>
                        <Button className="w-full">বিস্তারিত দেখুন</Button>
                      </Link>
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
