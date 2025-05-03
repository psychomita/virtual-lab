"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export type QuestionType = {
  id: string
  type: "multiple-choice" | "open-ended"
  question: string
  options?: string[]
  correctAnswer?: string
  explanation?: string
}

interface AssessmentProps {
  questions: QuestionType[]
  onComplete?: (score: number, totalQuestions: number) => void
}

export function Assessment({ questions, onComplete }: AssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isMultipleChoice = currentQuestion?.type === "multiple-choice"

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer })
  }

  const handleNext = () => {
    if (isLastQuestion) {
      calculateScore()
      setShowResults(true)
      if (onComplete) {
        onComplete(calculateScore(), questions.length)
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowExplanation(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowExplanation(false)
    }
  }

  const calculateScore = () => {
    let score = 0
    questions.forEach((question) => {
      if (question.type === "multiple-choice" && answers[question.id] === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  const isAnswerCorrect = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    return question?.type === "multiple-choice" && answers[questionId] === question.correctAnswer
  }

  const resetAssessment = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
    setShowExplanation(false)
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = (score / questions.length) * 100

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>
            You scored {score} out of {questions.length} questions correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Score: {percentage.toFixed(0)}%</span>
              <span>
                {score}/{questions.length}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-2">
                  {question.type === "multiple-choice" ? (
                    isAnswerCorrect(question.id) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">
                      {index + 1}. {question.question}
                    </p>
                    {question.type === "multiple-choice" && (
                      <div className="mt-2 text-sm">
                        <p>Your answer: {answers[question.id] || "Not answered"}</p>
                        <p className="text-green-600">Correct answer: {question.correctAnswer}</p>
                        {question.explanation && <p className="mt-1 text-gray-600">{question.explanation}</p>}
                      </div>
                    )}
                    {question.type === "open-ended" && (
                      <div className="mt-2 text-sm">
                        <p>Your response:</p>
                        <p className="italic">{answers[question.id] || "Not answered"}</p>
                        {question.explanation && <p className="mt-1 text-gray-600">{question.explanation}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={resetAssessment} className="w-full">
            Retry Assessment
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assessment</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

          {isMultipleChoice && currentQuestion.options ? (
            <RadioGroup value={answers[currentQuestion.id] || ""} onValueChange={handleAnswer} className="space-y-2">
              {currentQuestion.options.map((option) => (
                <div key={option} className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              rows={5}
              className="w-full"
            />
          )}
        </div>

        {showExplanation && currentQuestion.explanation && (
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="font-medium">Explanation:</p>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={handlePrevious} variant="outline" disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          {isMultipleChoice && (
            <Button
              onClick={() => setShowExplanation(!showExplanation)}
              variant="outline"
              disabled={!answers[currentQuestion.id] || !currentQuestion.explanation}
            >
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </Button>
          )}
        </div>
        <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
          {isLastQuestion ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  )
}