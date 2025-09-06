"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useParams } from "next/navigation"

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

export default function FishSpeciesDetailPage() {
  const params = useParams()
  const [species, setSpecies] = useState<FishSpecies | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/fish/species/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setSpecies(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching species:", error)
          setLoading(false)
        })
    }
  }, [params.id])

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

  if (!species) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">মাছের তথ্য পাওয়া যায়নি।</p>
            <Link href="/fish-guide">
              <Button>মাছ চাষ গাইডে ফিরুন</Button>
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
              <Link href="/fish-guide">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🐟</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">{species.name_bn}</h1>
            </div>
            <Link href="/fish-guide">
              <Button variant="outline">গাইডে ফিরুন</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Species Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{species.name_bn}</h2>
                <p className="text-xl text-gray-600 mb-1">{species.name_en}</p>
                {species.scientific_name && <p className="text-lg text-gray-500 italic">{species.scientific_name}</p>}
              </div>
              <Badge variant="secondary" className="text-sm">
                {species.fish_categories.name_bn}
              </Badge>
            </div>
            {species.description_bn && <p className="text-gray-700 leading-relaxed">{species.description_bn}</p>}
          </div>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="farming" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="farming">চাষ পদ্ধতি</TabsTrigger>
              <TabsTrigger value="feeding">খাবার</TabsTrigger>
              <TabsTrigger value="care">পরিচর্যা</TabsTrigger>
              <TabsTrigger value="diseases">রোগবালাই</TabsTrigger>
            </TabsList>

            <TabsContent value="farming" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>চাষ পদ্ধতি</CardTitle>
                  <CardDescription>{species.name_bn} মাছের চাষ করার সঠিক পদ্ধতি</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">পুকুর প্রস্তুতি:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>পুকুরের গভীরতা ৪-৬ ফুট রাখুন</li>
                      <li>পানির pH ৬.৫-৮.৫ এর মধ্যে রাখুন</li>
                      <li>পুকুর শুকিয়ে তলদেশ পরিষ্কার করুন</li>
                      <li>চুন প্রয়োগ করে জীবাণুমুক্ত করুন</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">পোনা মজুদ:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>প্রতি শতাংশে ৮০-১০০টি পোনা মজুদ করুন</li>
                      <li>পোনার আকার ৩-৪ ইঞ্চি হলে ভালো</li>
                      <li>সকালে বা সন্ধ্যায় পোনা ছাড়ুন</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feeding" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>খাবার ব্যবস্থাপনা</CardTitle>
                  <CardDescription>{species.name_bn} মাছের খাবার ও পুষ্টি ব্যবস্থাপনা</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">প্রাকৃতিক খাবার:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>ফাইটোপ্লাংকটন ও জুপ্লাংকটন</li>
                      <li>জলজ উদ্ভিদ ও শৈবাল</li>
                      <li>কীটপতঙ্গ ও তাদের লার্ভা</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">সম্পূরক খাবার:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>চালের কুঁড়া ও গমের ভুসি</li>
                      <li>সরিষার খৈল ও তিলের খৈল</li>
                      <li>মাছের গুঁড়া ও রক্তের গুঁড়া</li>
                      <li>দৈনিক মাছের ওজনের ৩-৫% খাবার দিন</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>পরিচর্যা ও ব্যবস্থাপনা</CardTitle>
                  <CardDescription>নিয়মিত পরিচর্যার মাধ্যমে সুস্থ মাছ চাষ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">পানির গুণাগুণ:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>নিয়মিত পানির pH, অক্সিজেন ও তাপমাত্রা পরীক্ষা করুন</li>
                      <li>পানিতে অ্যামোনিয়া ও নাইট্রাইটের মাত্রা নিয়ন্ত্রণে রাখুন</li>
                      <li>প্রয়োজনে পানি পরিবর্তন করুন</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">নিয়মিত কাজ:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>প্রতিদিন মাছের আচরণ ও স্বাস্থ্য পর্যবেক্ষণ করুন</li>
                      <li>মৃত মাছ তৎক্ষণাত সরিয়ে ফেলুন</li>
                      <li>পুকুরের পাড় পরিষ্কার রাখুন</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diseases" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>রোগবালাই ও প্রতিকার</CardTitle>
                  <CardDescription>{species.name_bn} মাছের সাধারণ রোগ ও তার চিকিৎসা</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">সাধারণ রোগসমূহ:</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-red-200 pl-4">
                        <h5 className="font-medium">ব্যাকটেরিয়াল ইনফেকশন</h5>
                        <p className="text-sm text-gray-600">লক্ষণ: পাখনা পচা, ক্ষত, লাল দাগ</p>
                        <p className="text-sm text-gray-600">চিকিৎসা: অ্যান্টিবায়োটিক ব্যবহার করুন</p>
                      </div>
                      <div className="border-l-4 border-yellow-200 pl-4">
                        <h5 className="font-medium">ফাংগাল ইনফেকশন</h5>
                        <p className="text-sm text-gray-600">লক্ষণ: সাদা তুলার মতো দাগ</p>
                        <p className="text-sm text-gray-600">চিকিৎসা: ফাংগিসাইড প্রয়োগ করুন</p>
                      </div>
                      <div className="border-l-4 border-blue-200 pl-4">
                        <h5 className="font-medium">পরজীবী আক্রমণ</h5>
                        <p className="text-sm text-gray-600">লক্ষণ: অস্বাভাবিক আচরণ, খাবারে অনীহা</p>
                        <p className="text-sm text-gray-600">চিকিৎসা: লবণ স্নান ও ওষুধ প্রয়োগ</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">প্রতিরোধ:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>পুকুরের পানি পরিষ্কার রাখুন</li>
                      <li>অতিরিক্ত খাবার দেবেন না</li>
                      <li>নিয়মিত চুন প্রয়োগ করুন</li>
                      <li>রোগাক্রান্ত মাছ আলাদা করুন</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Actions */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link href="/fish-guide/disease-diagnosis">
              <Button variant="outline" className="w-full bg-transparent">
                রোগ নির্ণয় করুন
              </Button>
            </Link>
            <Link href={`/market-prices?species=${species.id}`}>
              <Button variant="outline" className="w-full bg-transparent">
                বাজার দর দেখুন
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
