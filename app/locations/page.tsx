"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LocationSelector } from "@/components/location-selector"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Division {
  id: number
  name_bn: string
  name_en: string
}

interface District {
  id: number
  division_id: number
  name_bn: string
  name_en: string
}

interface Upazila {
  id: number
  district_id: number
  name_bn: string
  name_en: string
}

export default function LocationsPage() {
  const [selectedLocation, setSelectedLocation] = useState<{
    divisionId?: number
    districtId?: number
    upazilaId?: number
  }>({})

  const [divisions, setDivisions] = useState<Division[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [upazilas, setUpazilas] = useState<Upazila[]>([])

  // Fetch all divisions for display
  useEffect(() => {
    fetch("/api/locations/divisions")
      .then((res) => res.json())
      .then((data) => setDivisions(data))
      .catch((error) => console.error("Error fetching divisions:", error))
  }, [])

  // Fetch districts when division is selected
  useEffect(() => {
    if (selectedLocation.divisionId) {
      fetch(`/api/locations/districts/${selectedLocation.divisionId}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .catch((error) => console.error("Error fetching districts:", error))
    } else {
      setDistricts([])
    }
  }, [selectedLocation.divisionId])

  // Fetch upazilas when district is selected
  useEffect(() => {
    if (selectedLocation.districtId) {
      fetch(`/api/locations/upazilas/${selectedLocation.districtId}`)
        .then((res) => res.json())
        .then((data) => setUpazilas(data))
        .catch((error) => console.error("Error fetching upazilas:", error))
    } else {
      setUpazilas([])
    }
  }, [selectedLocation.districtId])

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
              <h1 className="text-xl font-bold text-gray-900">এলাকা নির্বাচন</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">ড্যাশবোর্ডে ফিরুন</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">এলাকা নির্বাচন করুন</h2>
            <p className="text-gray-600">বিভাগ, জেলা এবং উপজেলা নির্বাচন করে আপনার এলাকার তথ্য দেখুন</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Location Selector */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>এলাকা নির্বাচন</CardTitle>
                  <CardDescription>ধাপে ধাপে আপনার এলাকা নির্বাচন করুন</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocationSelector onLocationChange={setSelectedLocation} />
                </CardContent>
              </Card>
            </div>

            {/* Location Information Display */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Location Summary */}
              {(selectedLocation.divisionId || selectedLocation.districtId || selectedLocation.upazilaId) && (
                <Card>
                  <CardHeader>
                    <CardTitle>নির্বাচিত এলাকা</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.divisionId && (
                        <Badge variant="secondary">
                          বিভাগ: {divisions.find((d) => d.id === selectedLocation.divisionId)?.name_bn}
                        </Badge>
                      )}
                      {selectedLocation.districtId && (
                        <Badge variant="secondary">
                          জেলা: {districts.find((d) => d.id === selectedLocation.districtId)?.name_bn}
                        </Badge>
                      )}
                      {selectedLocation.upazilaId && (
                        <Badge variant="secondary">
                          উপজেলা: {upazilas.find((u) => u.id === selectedLocation.upazilaId)?.name_bn}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Available Districts */}
              {selectedLocation.divisionId && districts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>উপলব্ধ জেলাসমূহ</CardTitle>
                    <CardDescription>
                      {divisions.find((d) => d.id === selectedLocation.divisionId)?.name_bn} বিভাগের জেলাসমূহ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {districts.map((district) => (
                        <div
                          key={district.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedLocation.districtId === district.id
                              ? "bg-blue-50 border-blue-200"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-medium">{district.name_bn}</div>
                          <div className="text-sm text-gray-500">{district.name_en}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Available Upazilas */}
              {selectedLocation.districtId && upazilas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>উপলব্ধ উপজেলাসমূহ</CardTitle>
                    <CardDescription>
                      {districts.find((d) => d.id === selectedLocation.districtId)?.name_bn} জেলার উপজেলাসমূহ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {upazilas.map((upazila) => (
                        <div
                          key={upazila.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedLocation.upazilaId === upazila.id
                              ? "bg-blue-50 border-blue-200"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-medium">{upazila.name_bn}</div>
                          <div className="text-sm text-gray-500">{upazila.name_en}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              {selectedLocation.upazilaId && (
                <Card>
                  <CardHeader>
                    <CardTitle>এই এলাকার তথ্য</CardTitle>
                    <CardDescription>নির্বাচিত এলাকার জন্য উপলব্ধ সেবাসমূহ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Link href={`/market-prices?upazila=${selectedLocation.upazilaId}`}>
                        <Button className="w-full bg-transparent" variant="outline">
                          এই এলাকার বাজার দর
                        </Button>
                      </Link>
                      <Link href={`/fish-farmers?upazila=${selectedLocation.upazilaId}`}>
                        <Button className="w-full bg-transparent" variant="outline">
                          স্থানীয় মৎস্য চাষীরা
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
