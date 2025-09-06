import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: categories, error } = await supabase.from("fish_categories").select("*").order("name_bn")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fish categories" }, { status: 500 })
  }
}
