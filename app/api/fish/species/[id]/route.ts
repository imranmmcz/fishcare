import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const { data: species, error } = await supabase
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
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(species)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fish species" }, { status: 500 })
  }
}
