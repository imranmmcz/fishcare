"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LocationSelector } from "@/components/location-selector"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  full_name: string
  phone: string
  user_type: string
  division_id: number
  district_id: number
  upazila_id: number
  address: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    user_type: "",
    address: "",
  })

  const [selectedLocation, setSelectedLocation] = useState<{
    divisionId?: number
    districtId?: number
    upazilaId?: number
  }>({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
        } else if (profile) {
          setProfile(profile)
          setFormData({
            full_name: profile.full_name || "",
            phone: profile.phone || "",
            user_type: profile.user_type || "",
            address: profile.address || "",
          })
          setSelectedLocation({
            divisionId: profile.division_id,
            districtId: profile.district_id,
            upazilaId: profile.upazila_id,
          })
        }
      }
      setLoading(false)
    } catch (error) {
      console.error("Error:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          division_id: selectedLocation.divisionId,
          district_id: selectedLocation.districtId,
          upazila_id: selectedLocation.upazilaId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "প্রোফাইল আপডেট করতে সমস্যা হয়েছে")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>প্রোফাইল লোড হচ্ছে...</p>
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
                  <span className="text-white font-bold text-sm">👤</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">প্রোফাইল</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">ড্যাশবোর্ড</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">আপনার প্রোফাইল</h2>
            <p className="text-gray-600">আপনার ব্যক্তিগত তথ্য সম্পাদনা করুন</p>
          </div>

          {success && (
            <Alert className="mb-6">
              <AlertDescription className="text-green-600">প্রোফাইল সফলভাবে আপডেট হয়েছে!</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
              <CardDescription>আপনার তথ্য আপডেট করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">পূর্ণ নাম *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      placeholder="আপনার পূর্ণ নাম"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">মোবাইল নম্বর</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="০১৭xxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="user_type">ব্যবহারকারীর ধরন</Label>
                  <Select value={formData.user_type} onValueChange={(value) => handleInputChange("user_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">মৎস্য চাষী</SelectItem>
                      <SelectItem value="seller">মৎস্য ব্যবসায়ী</SelectItem>
                      <SelectItem value="general">সাধারণ ব্যবহারকারী</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-semibold">এলাকা</Label>
                  <div className="mt-2">
                    <LocationSelector
                      onLocationChange={setSelectedLocation}
                      defaultValues={{
                        divisionId: selectedLocation.divisionId,
                        districtId: selectedLocation.districtId,
                        upazilaId: selectedLocation.upazilaId,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">ঠিকানা</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="বিস্তারিত ঠিকানা..."
                    rows={3}
                  />
                </div>

                {error && (
                  <Alert>
                    <AlertDescription className="text-red-600">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? "আপডেট হচ্ছে..." : "প্রোফাইল আপডেট করুন"}
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">
                      বাতিল
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
