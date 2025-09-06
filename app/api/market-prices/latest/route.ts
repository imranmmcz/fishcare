import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const upazilaId = searchParams.get("upazila")

    const supabase = await createClient()

    // Get latest prices for each fish species in the upazila
    const { data: prices, error } = await supabase.rpc("get_latest_prices_by_upazila", {
      upazila_id_param: upazilaId ? Number.parseInt(upazilaId) : null,
    })

    if (error) {
      // Fallback query if RPC function doesn't exist
      let query = supabase
        .from("market_prices")
        .select(`
          *,
          fish_species (
            id,
            name_bn,
            name_en,
            fish_categories (
              name_bn
            )
          ),
          upazilas (
            name_bn,
            districts (
              name_bn,
              divisions (
                name_bn
              )
            )
          )
        `)
        .order("price_date", { ascending: false })
        .limit(20)

      if (upazilaId) {
        query = query.eq("upazila_id", upazilaId)
      }

      const { data: fallbackPrices, error: fallbackError } = await query

      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message }, { status: 500 })
      }

      return NextResponse.json(fallbackPrices)
    }

    return NextResponse.json(prices)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch latest prices" }, { status: 500 })
  }
}
