import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { data: stock, error } = await supabase
      .from("user_fish_stock")
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
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(stock)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fish stock" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const {
      fish_species_id,
      pond_name,
      quantity,
      size_category,
      average_weight,
      stocking_date,
      expected_harvest_date,
      notes,
    } = body

    if (!fish_species_id || !pond_name || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: stock, error } = await supabase
      .from("user_fish_stock")
      .insert({
        user_id: user.id,
        fish_species_id,
        pond_name,
        quantity,
        size_category: size_category || "fry",
        average_weight,
        stocking_date,
        expected_harvest_date,
        notes,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(stock)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create fish stock entry" }, { status: 500 })
  }
}
