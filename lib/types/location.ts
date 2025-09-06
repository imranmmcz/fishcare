export interface Division {
  id: number
  name_bn: string
  name_en: string
  created_at?: string
}

export interface District {
  id: number
  division_id: number
  name_bn: string
  name_en: string
  created_at?: string
}

export interface Upazila {
  id: number
  district_id: number
  name_bn: string
  name_en: string
  created_at?: string
}

export interface LocationHierarchy {
  division?: Division
  district?: District
  upazila?: Upazila
}
