import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'income' or 'expense'
    const pondName = searchParams.get("pond")

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (type === "income") {
      let query = supabase
        .from("pond_income")
        .select(`
          *,
          income_categories (
            id,
            name_bn,
            name_en
          )
        `)
        .eq("user_id", user.id)
        .order("income_date", { ascending: false })

      if (pondName) {
        query = query.eq("pond_name", pondName)
      }

      const { data: income, error } = await query

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(income)
    } else if (type === "expense") {
      let query = supabase
        .from("pond_expenses")
        .select(`
          *,
          expense_categories (
            id,
            name_bn,
            name_en
          )
        `)
        .eq("user_id", user.id)
        .order("expense_date", { ascending: false })

      if (pondName) {
        query = query.eq("pond_name", pondName)
      }

      const { data: expenses, error } = await query

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(expenses)
    } else {
      // Get both income and expenses
      const [incomeResult, expenseResult] = await Promise.all([
        supabase
          .from("pond_income")
          .select(`
            *,
            income_categories (
              name_bn
            )
          `)
          .eq("user_id", user.id)
          .order("income_date", { ascending: false }),
        supabase
          .from("pond_expenses")
          .select(`
            *,
            expense_categories (
              name_bn
            )
          `)
          .eq("user_id", user.id)
          .order("expense_date", { ascending: false }),
      ])

      if (incomeResult.error || expenseResult.error) {
        return NextResponse.json({ error: "Failed to fetch accounting data" }, { status: 500 })
      }

      return NextResponse.json({
        income: incomeResult.data,
        expenses: expenseResult.data,
      })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch accounting data" }, { status: 500 })
  }
}
