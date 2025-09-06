import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { districtId: string } }) {
  try {
    const supabase = await createClient()

    const { data: upazilas, error } = await supabase
      .from("upazilas")
      .select("*")
      .eq("district_id", params.districtId)
      .order("name_bn")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(upazilas)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch upazilas" }, { status: 500 })
  }
}
