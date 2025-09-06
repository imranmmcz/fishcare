"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Symptom {
  id: string
  name: string
  category: string
}

interface Disease {
  id: string
  name: string
  symptoms: string[]
  treatment: string
  prevention: string
  severity: "low" | "medium" | "high"
}

const symptoms: Symptom[] = [
  { id: "red_spots", name: "শরীরে লাল দাগ", category: "external" },
  { id: "white_spots", name: "সাদা দাগ বা তুলার মতো", category: "external" },
  { id: "fin_rot", name: "পাখনা পচা", category: "external" },
  { id: "ulcers", name: "ক্ষত বা ঘা", category: "external" },
  { id: "swollen_eyes", name: "চোখ ফোলা", category: "external" },
  { id: "loss_appetite", name: "খাবারে অনীহা", category: "behavioral" },
  { id: "abnormal_swimming", name: "অস্বাভাবিক সাঁতার", category: "behavioral" },
  { id: "gasping", name: "পানির উপরে হাঁপানি", category: "behavioral" },
  { id: "lethargy", name: "নিস্তেজতা", category: "behavioral" },
  { id: "isolation", name: "একা থাকার প্রবণতা", category: "behavioral" },
]

const diseases: Disease[] = [
  {
    id: "bacterial_infection",
    name: "ব্যাকটেরিয়াল ইনফেকশন",
    symptoms: ["red_spots", "fin_rot", "ulcers", "loss_appetite"],
    treatment: "অ্যান্টিবায়োটিক (অক্সিটেট্রাসাইক্লিন) ১০-১৫ মিগ্রা/লিটার পানিতে ৫-৭ দিন প্রয়োগ করুন।",
    prevention: "পুকুরের পানি পরিষ্কার রাখুন, অতিরিক্ত খাবার দেবেন না।",
    severity: "high",
  },
  {
    id: "fungal_infection",
    name: "ছত্রাক সংক্রমণ",
    symptoms: ["white_spots", "lethargy", "loss_appetite"],
    treatment: "পটাশিয়াম পারম্যাঙ্গানেট ২-৩ মিগ্রা/লিটার অথবা ফরমালিন ২৫ মিলি/১০০ লিটার পানিতে প্রয়োগ করুন।",
    prevention: "পানির তাপমাত্রা নিয়ন্ত্রণে রাখুন, আহত মাছ আলাদা করুন।",
    severity: "medium",
  },
  {
    id: "parasitic_infection",
    name: "পরজীবী আক্রমণ",
    symptoms: ["abnormal_swimming", "gasping", "isolation", "loss_appetite"],
    treatment: "লবণ স্নান (৩% লবণ পানিতে ৫-১০ মিনিট) অথবা ট্রিক্লোরফন ০.৫ মিগ্রা/লিটার প্রয়োগ করুন।",
    prevention: "নতুন মাছ কোয়ারেন্টাইন করুন, পুকুর নিয়মিত পরিষ্কার করুন।",
    severity: "medium",
  },
  {
    id: "oxygen_deficiency",
    name: "অক্সিজেনের অভাব",
    symptoms: ["gasping", "abnormal_swimming", "lethargy"],
    treatment: "পানিতে বায়ু সরবরাহ বাড়ান, অতিরিক্ত মাছ সরান, পানি পরিবর্তন করুন।",
    prevention: "পুকুরে অতিরিক্ত মাছ রাখবেন না, নিয়মিত পানি পরিবর্তন করুন।",
    severity: "high",
  },
  {
    id: "eye_disease",
    name: "চোখের রোগ",
    symptoms: ["swollen_eyes", "loss_appetite", "abnormal_swimming"],
    treatment: "টেরামাইসিন ১০ মিগ্রা/লিটার পানিতে ৫ দিন প্রয়োগ করুন।",
    prevention: "পানির গুণাগুণ ভালো রাখুন, আঘাত এড়ান।",
    severity: "low",
  },
]

export default function DiseaseDiagnosisPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [diagnosisResult, setDiagnosisResult] = useState<Disease[]>([])
  const [showResult, setShowResult] = useState(false)

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptomId])
    } else {
      setSelectedSymptoms(selectedSymptoms.filter((id) => id !== symptomId))
    }
  }

  const diagnose = () => {
    if (selectedSymptoms.length === 0) {
      return
    }

    const possibleDiseases = diseases
      .map((disease) => {
        const matchingSymptoms = disease.symptoms.filter((symptom) => selectedSymptoms.includes(symptom))
        const matchPercentage = (matchingSymptoms.length / disease.symptoms.length) * 100
        return { ...disease, matchPercentage, matchingSymptoms: matchingSymptoms.length }
      })
      .filter((disease) => disease.matchingSymptoms > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)

    setDiagnosisResult(possibleDiseases)
    setShowResult(true)
  }

  const reset = () => {
    setSelectedSymptoms([])
    setDiagnosisResult([])
    setShowResult(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "high":
        return "জরুরি"
      case "medium":
        return "মাধ্যম"
      case "low":
        return "সাধারণ"
      default:
        return "অজানা"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/fish-guide">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🏥</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">রোগ নির্ণয়</h1>
            </div>
            <Link href="/fish-guide">
              <Button variant="outline">গাইডে ফিরুন</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">মাছের রোগ নির্ণয়</h2>
            <p className="text-gray-600">আপনার মাছের লক্ষণগুলো নির্বাচন করুন। আমরা সম্ভাব্য রোগ ও চিকিৎসার পরামর্শ দেব।</p>
          </div>

          {!showResult ? (
            <div className="space-y-6">
              {/* Symptom Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>লক্ষণ নির্বাচন করুন</CardTitle>
                  <CardDescription>আপনার মাছে যে লক্ষণগুলো দেখছেন সেগুলো টিক দিন</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* External Symptoms */}
                    <div>
                      <h4 className="font-semibold mb-3">বাহ্যিক লক্ষণ</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {symptoms
                          .filter((symptom) => symptom.category === "external")
                          .map((symptom) => (
                            <div key={symptom.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={symptom.id}
                                checked={selectedSymptoms.includes(symptom.id)}
                                onCheckedChange={(checked) => handleSymptomChange(symptom.id, !!checked)}
                              />
                              <label htmlFor={symptom.id} className="text-sm cursor-pointer">
                                {symptom.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Behavioral Symptoms */}
                    <div>
                      <h4 className="font-semibold mb-3">আচরণগত লক্ষণ</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {symptoms
                          .filter((symptom) => symptom.category === "behavioral")
                          .map((symptom) => (
                            <div key={symptom.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={symptom.id}
                                checked={selectedSymptoms.includes(symptom.id)}
                                onCheckedChange={(checked) => handleSymptomChange(symptom.id, !!checked)}
                              />
                              <label htmlFor={symptom.id} className="text-sm cursor-pointer">
                                {symptom.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <Button onClick={diagnose} disabled={selectedSymptoms.length === 0}>
                      রোগ নির্ণয় করুন ({selectedSymptoms.length} টি লক্ষণ)
                    </Button>
                    <Button variant="outline" onClick={reset}>
                      রিসেট করুন
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Diagnosis Results */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">নির্ণয়ের ফলাফল</h3>
                <Button variant="outline" onClick={reset}>
                  নতুন নির্ণয়
                </Button>
              </div>

              {diagnosisResult.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500 mb-4">নির্বাচিত লক্ষণের সাথে কোনো রোগ মিলেনি।</p>
                    <p className="text-sm text-gray-400 mb-4">
                      দয়া করে আরো লক্ষণ নির্বাচন করুন অথবা স্থানীয় মৎস্য বিশেষজ্ঞের সাথে যোগাযোগ করুন।
                    </p>
                    <Button onClick={reset}>আবার চেষ্টা করুন</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {diagnosisResult.map((disease, index) => (
                    <Card key={disease.id} className={index === 0 ? "border-blue-200 bg-blue-50" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <span>{disease.name}</span>
                              {index === 0 && <Badge variant="secondary">সবচেয়ে সম্ভাব্য</Badge>}
                            </CardTitle>
                            <CardDescription>
                              {disease.matchPercentage.toFixed(0)}% লক্ষণ মিলেছে ({disease.matchingSymptoms}/
                              {disease.symptoms.length})
                            </CardDescription>
                          </div>
                          <Badge className={getSeverityColor(disease.severity)}>
                            {getSeverityText(disease.severity)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h5 className="font-semibold mb-2">চিকিৎসা:</h5>
                          <p className="text-sm text-gray-700">{disease.treatment}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2">প্রতিরোধ:</h5>
                          <p className="text-sm text-gray-700">{disease.prevention}</p>
                        </div>
                        {disease.severity === "high" && (
                          <Alert>
                            <AlertDescription>
                              এটি একটি গুরুতর রোগ। দ্রুত চিকিৎসা না করলে মাছ মারা যেতে পারে। অবিলম্বে ব্যবস্থা নিন।
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* General Advice */}
              <Card>
                <CardHeader>
                  <CardTitle>সাধারণ পরামর্শ</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>রোগাক্রান্ত মাছ অবিলম্বে আলাদা করুন</li>
                    <li>পুকুরের পানির গুণাগুণ পরীক্ষা করুন</li>
                    <li>অতিরিক্ত খাবার দেওয়া বন্ধ করুন</li>
                    <li>প্রয়োজনে স্থানীয় মৎস্য বিশেষজ্ঞের সাথে যোগাযোগ করুন</li>
                    <li>চিকিৎসার সময় পানি পরিবর্তনের হার কমান</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
