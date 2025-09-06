"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

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

interface LocationSelectorProps {
  onLocationChange?: (location: {
    divisionId?: number
    districtId?: number
    upazilaId?: number
  }) => void
  defaultValues?: {
    divisionId?: number
    districtId?: number
    upazilaId?: number
  }
  showLabels?: boolean
}

export function LocationSelector({ onLocationChange, defaultValues, showLabels = true }: LocationSelectorProps) {
  const [divisions, setDivisions] = useState<Division[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [upazilas, setUpazilas] = useState<Upazila[]>([])

  const [selectedDivision, setSelectedDivision] = useState<string>(defaultValues?.divisionId?.toString() || "")
  const [selectedDistrict, setSelectedDistrict] = useState<string>(defaultValues?.districtId?.toString() || "")
  const [selectedUpazila, setSelectedUpazila] = useState<string>(defaultValues?.upazilaId?.toString() || "")

  // Fetch divisions on component mount
  useEffect(() => {
    fetch("/api/locations/divisions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDivisions(data)
        } else {
          console.error("Divisions data is not an array:", data)
          setDivisions([])
        }
      })
      .catch((error) => {
        console.error("Error fetching divisions:", error)
        setDivisions([])
      })
  }, [])

  // Fetch districts when division changes
  useEffect(() => {
    if (selectedDivision) {
      fetch(`/api/locations/districts/${selectedDivision}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDistricts(data)
          } else {
            console.error("Districts data is not an array:", data)
            setDistricts([])
          }
          // Reset district and upazila if division changed
          if (selectedDivision !== defaultValues?.divisionId?.toString()) {
            setSelectedDistrict("")
            setSelectedUpazila("")
            setUpazilas([])
          }
        })
        .catch((error) => {
          console.error("Error fetching districts:", error)
          setDistricts([])
        })
    } else {
      setDistricts([])
      setSelectedDistrict("")
      setSelectedUpazila("")
      setUpazilas([])
    }
  }, [selectedDivision, defaultValues?.divisionId])

  // Fetch upazilas when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`/api/locations/upazilas/${selectedDistrict}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUpazilas(data)
          } else {
            console.error("Upazilas data is not an array:", data)
            setUpazilas([])
          }
          // Reset upazila if district changed
          if (selectedDistrict !== defaultValues?.districtId?.toString()) {
            setSelectedUpazila("")
          }
        })
        .catch((error) => {
          console.error("Error fetching upazilas:", error)
          setUpazilas([])
        })
    } else {
      setUpazilas([])
      setSelectedUpazila("")
    }
  }, [selectedDistrict, defaultValues?.districtId])

  // Notify parent component of location changes
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({
        divisionId: selectedDivision ? Number.parseInt(selectedDivision) : undefined,
        districtId: selectedDistrict ? Number.parseInt(selectedDistrict) : undefined,
        upazilaId: selectedUpazila ? Number.parseInt(selectedUpazila) : undefined,
      })
    }
  }, [selectedDivision, selectedDistrict, selectedUpazila, onLocationChange])

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        {showLabels && <Label>বিভাগ নির্বাচন করুন</Label>}
        <Select value={selectedDivision} onValueChange={setSelectedDivision}>
          <SelectTrigger>
            <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(divisions) &&
              divisions.map((division) => (
                <SelectItem key={division.id} value={division.id.toString()}>
                  {division.name_bn}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDivision && (
        <div className="grid gap-2">
          {showLabels && <Label>জেলা নির্বাচন করুন</Label>}
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger>
              <SelectValue placeholder="জেলা নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(districts) &&
                districts.map((district) => (
                  <SelectItem key={district.id} value={district.id.toString()}>
                    {district.name_bn}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedDistrict && (
        <div className="grid gap-2">
          {showLabels && <Label>উপজেলা নির্বাচন করুন</Label>}
          <Select value={selectedUpazila} onValueChange={setSelectedUpazila}>
            <SelectTrigger>
              <SelectValue placeholder="উপজেলা নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(upazilas) &&
                upazilas.map((upazila) => (
                  <SelectItem key={upazila.id} value={upazila.id.toString()}>
                    {upazila.name_bn}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
