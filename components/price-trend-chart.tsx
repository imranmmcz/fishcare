"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PriceTrend {
  date: string
  price: number
  market_name?: string
}

interface PriceTrendChartProps {
  fishSpeciesId: number
  upazilaId?: number
  title?: string
}

export function PriceTrendChart({ fishSpeciesId, upazilaId, title = "দরের প্রবণতা" }: PriceTrendChartProps) {
  const [trends, setTrends] = useState<PriceTrend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    params.append("species", fishSpeciesId.toString())
    if (upazilaId) params.append("upazila", upazilaId.toString())
    params.append("limit", "30")

    fetch(`/api/market-prices?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const trendData = data
          .map((price: any) => ({
            date: price.price_date,
            price: price.price_per_kg,
            market_name: price.market_name,
          }))
          .sort((a: PriceTrend, b: PriceTrend) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setTrends(trendData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching price trends:", error)
        setLoading(false)
      })
  }, [fishSpeciesId, upazilaId])

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>দরের তথ্য লোড হচ্ছে...</p>
        </CardContent>
      </Card>
    )
  }

  if (trends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">পর্যাপ্ত দরের তথ্য নেই</p>
        </CardContent>
      </Card>
    )
  }

  const latestPrice = trends[trends.length - 1]?.price || 0
  const previousPrice = trends[trends.length - 2]?.price || latestPrice
  const priceChange = latestPrice - previousPrice
  const priceChangePercent = previousPrice > 0 ? ((priceChange / previousPrice) * 100).toFixed(1) : "0"

  const maxPrice = Math.max(...trends.map((t) => t.price))
  const minPrice = Math.min(...trends.map((t) => t.price))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>গত ৩০ দিনের দরের পরিবর্তন</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Price Info */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">৳{latestPrice}</div>
              <p className="text-sm text-gray-500">বর্তমান দর</p>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                <span>{priceChange >= 0 ? "↗" : "↘"}</span>
                <span className="font-semibold">৳{Math.abs(priceChange).toFixed(2)}</span>
                <span>({priceChangePercent}%)</span>
              </div>
              <p className="text-sm text-gray-500">গত দরের তুলনায়</p>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">৳{maxPrice}</div>
              <p className="text-sm text-gray-600">সর্বোচ্চ দর</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-600">৳{minPrice}</div>
              <p className="text-sm text-gray-600">সর্বনিম্ন দর</p>
            </div>
          </div>

          {/* Simple Price List */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <h5 className="font-semibold text-sm">সাম্প্রতিক দরসমূহ:</h5>
            {trends
              .slice(-10)
              .reverse()
              .map((trend, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1 border-b border-gray-100">
                  <span>{new Date(trend.date).toLocaleDateString("bn-BD")}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">৳{trend.price}</span>
                    {trend.market_name && (
                      <Badge variant="outline" className="text-xs">
                        {trend.market_name}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
