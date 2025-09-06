import type { Division, District, Upazila } from "@/lib/types/location"

export async function fetchDivisions(): Promise<Division[]> {
  const response = await fetch("/api/locations/divisions")
  if (!response.ok) {
    throw new Error("Failed to fetch divisions")
  }
  return response.json()
}

export async function fetchDistricts(divisionId: number): Promise<District[]> {
  const response = await fetch(`/api/locations/districts/${divisionId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch districts")
  }
  return response.json()
}

export async function fetchUpazilas(districtId: number): Promise<Upazila[]> {
  const response = await fetch(`/api/locations/upazilas/${districtId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch upazilas")
  }
  return response.json()
}

export function getLocationBreadcrumb(
  divisions: Division[],
  districts: District[],
  upazilas: Upazila[],
  selectedLocation: {
    divisionId?: number
    districtId?: number
    upazilaId?: number
  },
): string {
  const parts: string[] = []

  if (selectedLocation.divisionId) {
    const division = divisions.find((d) => d.id === selectedLocation.divisionId)
    if (division) parts.push(division.name_bn)
  }

  if (selectedLocation.districtId) {
    const district = districts.find((d) => d.id === selectedLocation.districtId)
    if (district) parts.push(district.name_bn)
  }

  if (selectedLocation.upazilaId) {
    const upazila = upazilas.find((u) => u.id === selectedLocation.upazilaId)
    if (upazila) parts.push(upazila.name_bn)
  }

  return parts.join(" > ")
}
