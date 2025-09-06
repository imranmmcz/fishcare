import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐟</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">মৎস্য ব্যবস্থাপনা</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">স্বাগতম, {profile?.full_name || user.email}</span>
              <form action="/auth/signout" method="post">
                <Button variant="outline" type="submit">
                  লগআউট
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">ড্যাশবোর্ড</h2>
          <p className="text-gray-600">আপনার মৎস্য চাষ ব্যবস্থাপনার সকল তথ্য এক জায়গায়</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📊</span>
                <span>বাজার দর</span>
              </CardTitle>
              <CardDescription>সর্বশেষ মাছের বাজার দর দেখুন</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/market-prices">
                <Button className="w-full">বাজার দর দেখুন</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🐟</span>
                <span>মাছের স্টক</span>
              </CardTitle>
              <CardDescription>আপনার পুকুরের মাছের হিসাব রাখুন</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/fish-stock">
                <Button className="w-full">স্টক দেখুন</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>💰</span>
                <span>আয়-ব্যয়</span>
              </CardTitle>
              <CardDescription>পুকুরের আয়-ব্যয়ের হিসাব</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/accounting">
                <Button className="w-full">হিসাব দেখুন</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📚</span>
                <span>মাছ চাষ গাইড</span>
              </CardTitle>
              <CardDescription>বিভিন্ন মাছের চাষ পদ্ধতি জানুন</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/fish-guide">
                <Button className="w-full">গাইড দেখুন</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🏥</span>
                <span>রোগ নির্ণয়</span>
              </CardTitle>
              <CardDescription>মাছের রোগ নির্ণয় ও চিকিৎসা</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/disease-diagnosis">
                <Button className="w-full">রোগ নির্ণয়</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚙️</span>
                <span>প্রোফাইল</span>
              </CardTitle>
              <CardDescription>আপনার প্রোফাইল সম্পাদনা করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button className="w-full">প্রোফাইল</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
