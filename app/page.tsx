import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐟</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">মৎস্য ব্যবস্থাপনা</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">লগইন</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>নিবন্ধন</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">বাংলাদেশের সবচেয়ে বড় মৎস্য চাষ ব্যবস্থাপনা প্ল্যাটফর্ম</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            মাছের বাজার দর, চাষ পদ্ধতি, রোগ নির্ণয় এবং পুকুর হিসাব রাখুন একটি প্ল্যাটফর্মেই
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/market-prices">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                বাজার দর দেখুন
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline">
                বিনামূল্যে শুরু করুন
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">প্রধান সুবিধাসমূহ</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 বাজার দর</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>সারাদেশের সর্বশেষ মাছের বাজার দর জানুন বিভাগ, জেলা ও উপজেলা অনুযায়ী</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🐟 মাছের তথ্য</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>বিভিন্ন প্রজাতির মাছের চাষ পদ্ধতি, খাবার ও পরিচর্যার বিস্তারিত তথ্য</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💰 হিসাব রক্ষণ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>পুকুরের আয়-ব্যয়ের হিসাব রাখুন এবং লাভ-ক্ষতির হিসাব করুন সহজেই</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🏥 রোগ নির্ণয়</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>মাছের রোগের লক্ষণ দেখে রোগ নির্ণয় করুন এবং চিকিৎসার পরামর্শ নিন</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; ২০২৫ মৎস্য ব্যবস্থাপনা। সকল অধিকার সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  )
}
