"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface IncomeEntry {
  id: number
  pond_name: string
  amount: number
  quantity_kg: number
  price_per_kg: number
  description: string
  income_date: string
  income_categories: {
    name_bn: string
    name_en: string
  }
}

interface ExpenseEntry {
  id: number
  pond_name: string
  amount: number
  description: string
  expense_date: string
  expense_categories: {
    name_bn: string
    name_en: string
  }
}

export default function AccountingPage() {
  const [income, setIncome] = useState<IncomeEntry[]>([])
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPond, setSelectedPond] = useState("all")

  useEffect(() => {
    fetch("/api/user/accounting")
      .then((res) => res.json())
      .then((data) => {
        setIncome(data.income || [])
        setExpenses(data.expenses || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching accounting data:", error)
        setLoading(false)
      })
  }, [])

  // Get unique pond names
  const allPonds = new Set([...income.map((i) => i.pond_name), ...expenses.map((e) => e.pond_name)])
  const pondNames = Array.from(allPonds)

  // Filter by pond
  const filteredIncome = selectedPond === "all" ? income : income.filter((i) => i.pond_name === selectedPond)
  const filteredExpenses = selectedPond === "all" ? expenses : expenses.filter((e) => e.pond_name === selectedPond)

  // Calculate totals
  const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0)
  const netProfit = totalIncome - totalExpenses

  // Group by category
  const incomeByCategory = filteredIncome.reduce(
    (acc, item) => {
      const category = item.income_categories.name_bn
      acc[category] = (acc[category] || 0) + item.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const expensesByCategory = filteredExpenses.reduce(
    (acc, item) => {
      const category = item.expense_categories.name_bn
      acc[category] = (acc[category] || 0) + item.amount
      return acc
    },
    {} as Record<string, number>,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">💰</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">আয়-ব্যয় হিসাব</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/accounting/add-income">
                <Button>আয় যোগ করুন</Button>
              </Link>
              <Link href="/accounting/add-expense">
                <Button variant="outline">ব্যয় যোগ করুন</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">ড্যাশবোর্ড</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">পুকুরের আয়-ব্যয় হিসাব</h2>
            <p className="text-gray-600">আপনার মৎস্য চাষের সম্পূর্ণ আর্থিক হিসাব</p>
          </div>

          {/* Pond Filter */}
          <div className="mb-8">
            <Select value={selectedPond} onValueChange={setSelectedPond}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="পুকুর নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব পুকুর</SelectItem>
                {pondNames.map((pond) => (
                  <SelectItem key={pond} value={pond}>
                    {pond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">মোট আয়</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">৳{totalIncome.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">মোট ব্যয়</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">৳{totalExpenses.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">নিট লাভ/ক্ষতি</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ৳{netProfit.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">লাভের হার</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {totalExpenses > 0 ? ((netProfit / totalExpenses) * 100).toFixed(1) : "0"}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed View */}
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">সারসংক্ষেপ</TabsTrigger>
              <TabsTrigger value="income">আয়</TabsTrigger>
              <TabsTrigger value="expenses">ব্যয়</TabsTrigger>
              <TabsTrigger value="analysis">বিশ্লেষণ</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>আয়ের বিভাগ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(incomeByCategory).map(([category, amount]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <Badge variant="secondary">৳{amount.toLocaleString()}</Badge>
                        </div>
                      ))}
                      {Object.keys(incomeByCategory).length === 0 && (
                        <p className="text-gray-500 text-center py-4">কোনো আয়ের তথ্য নেই</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ব্যয়ের বিভাগ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(expensesByCategory).map(([category, amount]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <Badge variant="outline">৳{amount.toLocaleString()}</Badge>
                        </div>
                      ))}
                      {Object.keys(expensesByCategory).length === 0 && (
                        <p className="text-gray-500 text-center py-4">কোনো ব্যয়ের তথ্য নেই</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="income" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>আয়ের তালিকা</CardTitle>
                  <CardDescription>সকল আয়ের বিস্তারিত তথ্য</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredIncome.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">কোনো আয়ের তথ্য পাওয়া যায়নি।</p>
                      <Link href="/accounting/add-income">
                        <Button>প্রথম আয় যোগ করুন</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredIncome.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h5 className="font-semibold">{item.income_categories.name_bn}</h5>
                            <p className="text-sm text-gray-600">পুকুর: {item.pond_name}</p>
                            {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                            {item.quantity_kg && (
                              <p className="text-sm text-gray-500">
                                {item.quantity_kg} কেজি × ৳{item.price_per_kg} = ৳{item.amount}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">৳{item.amount.toLocaleString()}</div>
                            <p className="text-sm text-gray-500">
                              {new Date(item.income_date).toLocaleDateString("bn-BD")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>ব্যয়ের তালিকা</CardTitle>
                  <CardDescription>সকল ব্যয়ের বিস্তারিত তথ্য</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredExpenses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">কোনো ব্যয়ের তথ্য পাওয়া যায়নি।</p>
                      <Link href="/accounting/add-expense">
                        <Button>প্রথম ব্যয় যোগ করুন</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredExpenses.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h5 className="font-semibold">{item.expense_categories.name_bn}</h5>
                            <p className="text-sm text-gray-600">পুকুর: {item.pond_name}</p>
                            {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-600">৳{item.amount.toLocaleString()}</div>
                            <p className="text-sm text-gray-500">
                              {new Date(item.expense_date).toLocaleDateString("bn-BD")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>মাসিক ট্রেন্ড</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">মাসিক বিশ্লেষণ শীঘ্রই আসছে</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>পুকুর অনুযায়ী লাভ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pondNames.map((pond) => {
                        const pondIncome = income
                          .filter((i) => i.pond_name === pond)
                          .reduce((sum, i) => sum + i.amount, 0)
                        const pondExpenses = expenses
                          .filter((e) => e.pond_name === pond)
                          .reduce((sum, e) => sum + e.amount, 0)
                        const pondProfit = pondIncome - pondExpenses

                        return (
                          <div key={pond} className="flex items-center justify-between">
                            <span className="text-sm">{pond}</span>
                            <Badge
                              className={pondProfit >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              ৳{pondProfit.toLocaleString()}
                            </Badge>
                          </div>
                        )
                      })}
                      {pondNames.length === 0 && <p className="text-gray-500 text-center py-4">কোনো পুকুরের তথ্য নেই</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
