import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: divisions, error } = await supabase.from("divisions").select("*").order("name_bn")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(divisions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch divisions" }, { status: 500 })
  }
}
