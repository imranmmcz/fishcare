"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface FishStock {
  id: number
  fish_species_id: number
  pond_name: string
  quantity: number
  size_category: string
  average_weight: number
  stocking_date: string
  expected_harvest_date: string
  notes: string
  created_at: string
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
}

interface FishSpecies {
  id: number
  name_bn: string
  name_en: string
  fish_categories: {
    name_bn: string
  }
}

export default function FishStockPage() {
  const [stock, setStock] = useState<FishStock[]>([])
  const [fishSpecies, setFishSpecies] = useState<FishSpecies[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStock, setEditingStock] = useState<FishStock | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    fish_species_id: "",
    pond_name: "",
    quantity: "",
    size_category: "fry",
    average_weight: "",
    stocking_date: "",
    expected_harvest_date: "",
    notes: "",
  })

  // Fetch data
  useEffect(() => {
    Promise.all([fetch("/api/user/fish-stock"), fetch("/api/fish/species")])
      .then(([stockRes, speciesRes]) => Promise.all([stockRes.json(), speciesRes.json()]))
      .then(([stockData, speciesData]) => {
        setStock(stockData)
        setFishSpecies(speciesData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingStock ? `/api/user/fish-stock/${editingStock.id}` : "/api/user/fish-stock"
    const method = editingStock ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: Number.parseInt(formData.quantity),
          average_weight: formData.average_weight ? Number.parseFloat(formData.average_weight) : null,
        }),
      })

      if (response.ok) {
        // Refresh data
        const stockRes = await fetch("/api/user/fish-stock")
        const stockData = await stockRes.json()
        setStock(stockData)

        // Reset form
        setFormData({
          fish_species_id: "",
          pond_name: "",
          quantity: "",
          size_category: "fry",
          average_weight: "",
          stocking_date: "",
          expected_harvest_date: "",
          notes: "",
        })
        setEditingStock(null)
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error saving stock:", error)
    }
  }

  const handleEdit = (stockItem: FishStock) => {
    setEditingStock(stockItem)
    setFormData({
      fish_species_id: stockItem.fish_species_id.toString(),
      pond_name: stockItem.pond_name,
      quantity: stockItem.quantity.toString(),
      size_category: stockItem.size_category,
      average_weight: stockItem.average_weight?.toString() || "",
      stocking_date: stockItem.stocking_date || "",
      expected_harvest_date: stockItem.expected_harvest_date || "",
      notes: stockItem.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("আপনি কি এই স্টক মুছে ফেলতে চান?")) {
      try {
        const response = await fetch(`/api/user/fish-stock/${id}`, { method: "DELETE" })
        if (response.ok) {
          setStock(stock.filter((item) => item.id !== id))
        }
      } catch (error) {
        console.error("Error deleting stock:", error)
      }
    }
  }

  const getSizeCategoryText = (category: string) => {
    switch (category) {
      case "fry":
        return "পোনা"
      case "fingerling":
        return "আঙুল মাছ"
      case "juvenile":
        return "কিশোর"
      case "adult":
        return "পূর্ণবয়স্ক"
      default:
        return category
    }
  }

  const filteredStock = stock.filter(
    (item) =>
      item.fish_species.name_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pond_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate totals
  const totalPonds = new Set(stock.map((item) => item.pond_name)).size
  const totalFish = stock.reduce((sum, item) => sum + item.quantity, 0)
  const totalSpecies = new Set(stock.map((item) => item.fish_species_id)).size

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
              <Link href="/dashboard">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🐟</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">মাছের স্টক</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingStock(null)
                      setFormData({
                        fish_species_id: "",
                        pond_name: "",
                        quantity: "",
                        size_category: "fry",
                        average_weight: "",
                        stocking_date: "",
                        expected_harvest_date: "",
                        notes: "",
                      })
                    }}
                  >
                    নতুন স্টক যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingStock ? "স্টক সম্পাদনা করুন" : "নতুন মাছের স্টক যোগ করুন"}</DialogTitle>
                    <DialogDescription>আপনার পুকুরের মাছের তথ্য দিয়ে ফর্মটি পূরণ করুন</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="species">মাছের প্রজাতি *</Label>
                        <Select
                          value={formData.fish_species_id}
                          onValueChange={(value) => setFormData({ ...formData, fish_species_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="প্রজাতি নির্বাচন করুন" />
                          </SelectTrigger>
                          <SelectContent>
                            {fishSpecies.map((species) => (
                              <SelectItem key={species.id} value={species.id.toString()}>
                                {species.name_bn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pond">পুকুরের নাম *</Label>
                        <Input
                          id="pond"
                          value={formData.pond_name}
                          onChange={(e) => setFormData({ ...formData, pond_name: e.target.value })}
                          placeholder="যেমন: পুকুর ১"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="quantity">সংখ্যা *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder="যেমন: ১০০০"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="size">আকার</Label>
                        <Select
                          value={formData.size_category}
                          onValueChange={(value) => setFormData({ ...formData, size_category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fry">পোনা</SelectItem>
                            <SelectItem value="fingerling">আঙুল মাছ</SelectItem>
                            <SelectItem value="juvenile">কিশোর</SelectItem>
                            <SelectItem value="adult">পূর্ণবয়স্ক</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="weight">গড় ওজন (গ্রাম)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={formData.average_weight}
                          onChange={(e) => setFormData({ ...formData, average_weight: e.target.value })}
                          placeholder="যেমন: ৫০"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stocking">মজুদের তারিখ</Label>
                        <Input
                          id="stocking"
                          type="date"
                          value={formData.stocking_date}
                          onChange={(e) => setFormData({ ...formData, stocking_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="harvest">আহরণের প্রত্যাশিত তারিখ</Label>
                        <Input
                          id="harvest"
                          type="date"
                          value={formData.expected_harvest_date}
                          onChange={(e) => setFormData({ ...formData, expected_harvest_date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">মন্তব্য</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="অতিরিক্ত তথ্য..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" className="flex-1">
                        {editingStock ? "আপডেট করুন" : "যোগ করুন"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        বাতিল
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">মাছের স্টক ব্যবস্থাপনা</h2>
            <p className="text-gray-600">আপনার পুকুরের সকল মাছের হিসাব রাখুন</p>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">মোট পুকুর</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalPonds}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">মোট মাছ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalFish.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">প্রজাতি</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{totalSpecies}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">স্টক এন্ট্রি</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stock.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="মাছের নাম বা পুকুরের নাম খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Stock List */}
          {filteredStock.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">কোনো মাছের স্টক পাওয়া যায়নি।</p>
                <Button onClick={() => setIsDialogOpen(true)}>প্রথম স্টক যোগ করুন</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredStock.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{item.fish_species.name_bn}</h4>
                            <p className="text-sm text-gray-600">{item.fish_species.name_en}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary">{item.fish_species.fish_categories.name_bn}</Badge>
                              <Badge variant="outline">{getSizeCategoryText(item.size_category)}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{item.quantity.toLocaleString()}</div>
                            <p className="text-sm text-gray-500">টি মাছ</p>
                            {item.average_weight && (
                              <p className="text-sm text-gray-500">গড় ওজন: {item.average_weight}গ্রাম</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>🏊 পুকুর: {item.pond_name}</span>
                            {item.stocking_date && (
                              <span>📅 মজুদ: {new Date(item.stocking_date).toLocaleDateString("bn-BD")}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                              সম্পাদনা
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                              মুছুন
                            </Button>
                          </div>
                        </div>
                        {item.notes && <p className="mt-2 text-sm text-gray-600 italic">{item.notes}</p>}
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
  )
}
