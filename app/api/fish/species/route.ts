import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category")

    const supabase = await createClient()

    let query = supabase
      .from("fish_species")
      .select(`
        *,
        fish_categories (
          id,
          name_bn,
          name_en,
          description_bn,
          description_en
        )
      `)
      .order("name_bn")

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data: species, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(species)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fish species" }, { status: 500 })
  }
}
