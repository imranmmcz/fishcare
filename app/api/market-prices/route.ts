import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const divisionId = searchParams.get("division")
    const districtId = searchParams.get("district")
    const upazilaId = searchParams.get("upazila")
    const speciesId = searchParams.get("species")
    const limit = searchParams.get("limit") || "50"

    const supabase = await createClient()

    let query = supabase
      .from("market_prices")
      .select(`
        *,
        fish_species (
          id,
          name_bn,
          name_en,
          scientific_name,
          fish_categories (
            name_bn,
            name_en
          )
        ),
        upazilas (
          id,
          name_bn,
          name_en,
          districts (
            id,
            name_bn,
            name_en,
            divisions (
              id,
              name_bn,
              name_en
            )
          )
        )
      `)
      .order("price_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(Number.parseInt(limit))

    if (upazilaId) {
      query = query.eq("upazila_id", upazilaId)
    } else if (districtId) {
      query = query.eq("upazilas.district_id", districtId)
    } else if (divisionId) {
      query = query.eq("upazilas.districts.division_id", divisionId)
    }

    if (speciesId) {
      query = query.eq("fish_species_id", speciesId)
    }

    const { data: prices, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(prices)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch market prices" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { fish_species_id, upazila_id, price_per_kg, size_category, market_name, price_date } = body

    // Validate required fields
    if (!fish_species_id || !upazila_id || !price_per_kg) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: price, error } = await supabase
      .from("market_prices")
      .insert({
        fish_species_id,
        upazila_id,
        price_per_kg,
        size_category: size_category || "medium",
        market_name,
        price_date: price_date || new Date().toISOString().split("T")[0],
        reported_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(price)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create market price" }, { status: 500 })
  }
}
