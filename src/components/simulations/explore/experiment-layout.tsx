"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, FlaskConical, GraduationCap } from "lucide-react"
import { Assessment, type QuestionType } from "@/components/simulations/explore/assessment"

interface ExperimentLayoutProps {
  title: string
  labPath: string
  theory: ReactNode
  procedure: ReactNode
  simulation: ReactNode
  assessment: QuestionType[]
}

export function ExperimentLayout({ title, labPath, theory, procedure, simulation, assessment }: ExperimentLayoutProps) {
  const [activeTab, setActiveTab] = useState<string>("simulation")
  const [assessmentCompleted, setAssessmentCompleted] = useState(false)
  const [score, setScore] = useState<{ score: number; total: number } | null>(null)

  const handleAssessmentComplete = (score: number, total: number) => {
    setAssessmentCompleted(true)
    setScore({ score, total })
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link href={labPath}>
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{title}</h1>

        {assessmentCompleted && score && (
          <div className="ml-auto flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
            <span className="text-sm font-medium">
              Assessment Score: {score.score}/{score.total} ({Math.round((score.score / score.total) * 100)}%)
            </span>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="theory" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Theory</span>
          </TabsTrigger>
          <TabsTrigger value="procedure" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            <span>Procedure</span>
          </TabsTrigger>
          <TabsTrigger value="simulation" className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 4V2M12 22v-2M4 12H2M22 12h-2M19.778 19.778l-1.414-1.414M19.778 4.222l-1.414 1.414M4.222 19.778l1.414-1.414M4.222 4.222l1.414 1.414"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>Simulation</span>
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Assessment</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="theory">
            <Card>
              <CardContent className="pt-6">{theory}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="procedure">
            <Card>
              <CardContent className="pt-6">{procedure}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulation">{simulation}</TabsContent>

          <TabsContent value="assessment">
            <Assessment questions={assessment} onComplete={handleAssessmentComplete} />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  )
}