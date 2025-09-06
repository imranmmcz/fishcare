"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface SeasonalAdvice {
  season: string
  month: string
  activities: string[]
  precautions: string[]
  fishSpecies: string[]
  tips: string[]
}

const seasonalData: SeasonalAdvice[] = [
  {
    season: "গ্রীষ্মকাল",
    month: "এপ্রিল - জুন",
    activities: ["পুকুর প্রস্তুতি ও পরিষ্কার করুন", "নতুন পোনা মজুদের উপযুক্ত সময়", "পানির গভীরতা বাড়ান", "ছায়ার ব্যবস্থা করুন"],
    precautions: [
      "পানির তাপমাত্রা নিয়ন্ত্রণে রাখুন",
      "অক্সিজেনের অভাব এড়াতে বায়ু সরবরাহ বাড়ান",
      "বেশি খাবার দেবেন না",
      "নিয়মিত পানি পরিবর্তন করুন",
    ],
    fishSpecies: ["রুই", "কাতলা", "মৃগেল", "সিলভার কার্প"],
    tips: ["সকাল ও সন্ধ্যায় খাবার দিন", "পুকুরে জলজ উদ্ভিদ লাগান", "পানির pH ৭-৮ এর মধ্যে রাখুন"],
  },
  {
    season: "বর্ষাকাল",
    month: "জুলাই - সেপ্টেম্বর",
    activities: [
      "পুকুরের পাড় মজবুত করুন",
      "অতিরিক্ত পানি নিষ্কাশনের ব্যবস্থা করুন",
      "মাছের বৃদ্ধি পর্যবেক্ষণ করুন",
      "জাল দিয়ে পুকুর ঢেকে রাখুন",
    ],
    precautions: ["বন্যার পানি থেকে রক্ষা করুন", "রোগবালাই থেকে সাবধান থাকুন", "পানিতে লবণাক্ততা পরীক্ষা করুন", "মাছ পালানো রোধ করুন"],
    fishSpecies: ["শিং", "মাগুর", "কৈ", "শোল"],
    tips: ["বৃষ্টির পানি সরাসরি পুকুরে পড়তে দেবেন না", "নিয়মিত চুন প্রয়োগ করুন", "অসুস্থ মাছ আলাদা করুন"],
  },
  {
    season: "শীতকাল",
    month: "অক্টোবর - মার্চ",
    activities: ["মাছ আহরণের প্রধান সময়", "পুকুর সংস্কার ও মেরামত", "নতুন পুকুর খনন", "বীজ মাছ সংরক্ষণ"],
    precautions: ["ঠান্ডায় মাছের বৃদ্ধি কমে যায়", "খাবারের পরিমাণ কমান", "পানির গভীরতা বজায় রাখুন", "হঠাৎ তাপমাত্রা পরিবর্তন এড়ান"],
    fishSpecies: ["গ্রাস কার্প", "কমন কার্প", "টেংরা", "পাবদা"],
    tips: ["দুপুরের সময় খাবার দিন", "পানিতে ভিটামিন সি মিশান", "মাছের স্বাস্থ্য নিয়মিত পরীক্ষা করুন"],
  },
]

export default function SeasonalAdvicePage() {
  const [selectedSeason, setSelectedSeason] = useState("গ্রীষ্মকাল")

  const currentSeason = seasonalData.find((data) => data.season === selectedSeason)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/fish-guide">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌱</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">মৌসুমী পরামর্শ</h1>
            </div>
            <Link href="/fish-guide">
              <Button variant="outline">গাইডে ফিরুন</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">মৌসুমী মৎস্য চাষ পরামর্শ</h2>
            <p className="text-gray-600">বিভিন্ন ঋতুতে মাছ চাষের জন্য বিশেষ পরামর্শ ও নির্দেশনা</p>
          </div>

          {/* Season Selection */}
          <div className="mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              {seasonalData.map((season) => (
                <Card
                  key={season.season}
                  className={`cursor-pointer transition-colors ${
                    selectedSeason === season.season ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedSeason(season.season)}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">{season.season}</CardTitle>
                    <CardDescription>{season.month}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Seasonal Details */}
          {currentSeason && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{currentSeason.season}</h3>
                <Badge variant="secondary" className="mt-2">
                  {currentSeason.month}
                </Badge>
              </div>

              <Tabs defaultValue="activities" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="activities">কার্যক্রম</TabsTrigger>
                  <TabsTrigger value="precautions">সতর্কতা</TabsTrigger>
                  <TabsTrigger value="species">উপযুক্ত মাছ</TabsTrigger>
                  <TabsTrigger value="tips">পরামর্শ</TabsTrigger>
                </TabsList>

                <TabsContent value="activities" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>এই মৌসুমের প্রধান কার্যক্রম</CardTitle>
                      <CardDescription>{currentSeason.season} এ যে কাজগুলো করতে হবে</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {currentSeason.activities.map((activity, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="precautions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>সতর্কতা ও সাবধানতা</CardTitle>
                      <CardDescription>{currentSeason.season} এ যে বিষয়গুলোতে সতর্ক থাকতে হবে</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {currentSeason.precautions.map((precaution, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="h-2 w-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{precaution}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="species" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>উপযুক্ত মাছের প্রজাতি</CardTitle>
                      <CardDescription>{currentSeason.season} এ চাষের জন্য উপযুক্ত মাছ</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {currentSeason.fishSpecies.map((species, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="h-3 w-3 bg-green-600 rounded-full flex-shrink-0"></div>
                            <span className="font-medium text-gray-800">{species}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tips" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>বিশেষ পরামর্শ</CardTitle>
                      <CardDescription>{currentSeason.season} এর জন্য বিশেষ টিপস ও কৌশল</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {currentSeason.tips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="h-2 w-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Monthly Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>মাসিক কার্যক্রম ক্যালেন্ডার</CardTitle>
                  <CardDescription>প্রতি মাসে করণীয় কাজের তালিকা</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">১ম সপ্তাহ</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• পানির গুণাগুণ পরীক্ষা</li>
                        <li>• মাছের স্বাস্থ্য পর্যবেক্ষণ</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">২য় সপ্তাহ</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• খাবারের পরিমাণ সমন্বয়</li>
                        <li>• পুকুর পরিষ্কার</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">৩য় সপ্তাহ</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• চুন প্রয়োগ</li>
                        <li>• মাছের বৃদ্ধি পরিমাপ</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
