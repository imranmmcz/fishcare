import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { divisionId: string } }) {
  try {
    const supabase = await createClient()

    const { data: districts, error } = await supabase
      .from("districts")
      .select("*")
      .eq("division_id", params.divisionId)
      .order("name_bn")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(districts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch districts" }, { status: 500 })
  }
}
