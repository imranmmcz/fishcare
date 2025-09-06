import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <CardTitle className="text-2xl">নিবন্ধন সফল!</CardTitle>
            <CardDescription>আপনার ইমেইল যাচাই করুন</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              আমরা আপনার ইমেইল ঠিকানায় একটি যাচাইকরণ লিংক পাঠিয়েছি। অ্যাকাউন্ট সক্রিয় করতে ইমেইলের লিংকে ক্লিক করুন।
            </p>
            <div className="space-y-3">
              <Link href="/auth/login">
                <Button className="w-full">লগইন পেজে ফিরে যান</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  হোম পেজে যান
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
