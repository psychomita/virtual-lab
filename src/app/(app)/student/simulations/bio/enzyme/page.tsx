"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, X, HelpCircle, ArrowRight, Moon, Sun } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"

export default function EnzymeActivity() {
  const [temperature, setTemperature] = useState(25)
  const [prediction, setPrediction] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [reactionRate, setReactionRate] = useState(0)
  const [reactionData, setReactionData] = useState<Array<{ temp: number; rate: number }>>([])
  const [bubbleCount, setBubbleCount] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const bubblesRef = useRef<Array<{ x: number; y: number; size: number; speed: number }>>([])
  const { theme, setTheme } = useTheme()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [assessmentCompleted, setAssessmentCompleted] = useState(false)

  const calculateReactionRate = (temp: number) => {
    return 100 * Math.exp(-0.01 * Math.pow(temp - 37, 2))
  }

  useEffect(() => {
    const newRate = calculateReactionRate(temperature)
    setReactionRate(newRate)

    if (Number.isInteger(temperature)) {
      setReactionData((prev) => {
        const exists = prev.some((item) => item.temp === temperature)
        if (!exists) {
          return [...prev, { temp: temperature, rate: newRate }].sort((a, b) => a.temp - b.temp)
        }
        return prev
      })
    }
  }, [temperature])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const bubbleCount = Math.floor(reactionRate / 10)
    setBubbleCount(bubbleCount)

    bubblesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 20,
      size: 2 + Math.random() * 8,
      speed: 0.5 + Math.random() * 2,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = theme === "dark" ? "#374151" : "#e5e7eb"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#8b0000"
      ctx.fillRect(canvas.width / 2 - 40, canvas.height - 40, 80, 30)

      ctx.fillStyle = theme === "dark" ? "rgba(100, 130, 200, 0.5)" : "rgba(200, 230, 255, 0.7)"
      ctx.fillRect(0, 0, canvas.width, canvas.height - 40)

      const activeBubbles = Math.min(bubblesRef.current.length, bubbleCount)

      for (let i = 0; i < activeBubbles; i++) {
        const bubble = bubblesRef.current[i]

        if (reactionRate > 5) {
          bubble.y -= bubble.speed * (reactionRate / 50)

          if (bubble.y < -bubble.size) {
            bubble.y = canvas.height
            bubble.x = Math.random() * canvas.width
          }
        }

        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
        ctx.fillStyle = theme === "dark" ? "rgba(200, 200, 255, 0.7)" : "rgba(255, 255, 255, 0.7)"
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [reactionRate, theme])

  const handlePrediction = () => {
    setPrediction(temperature)
  }

  const handleReveal = () => {
    setShowResults(true)
  }

  const resetExperiment = () => {
    setTemperature(25)
    setPrediction(null)
    setShowResults(false)
    setReactionData([])
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    })
  }

  const nextQuestion = () => {
    setShowExplanation(false)
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setAssessmentCompleted(true)
    }
  }

  const prevQuestion = () => {
    setShowExplanation(false)
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const checkAnswer = () => {
    setShowExplanation(true)
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowExplanation(false)
    setAssessmentCompleted(false)
  }

  const calculateScore = () => {
    let score = 0
    assessmentQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  const assessmentQuestions = [
    {
      question: "What is the enzyme found in liver that breaks down hydrogen peroxide?",
      options: ["Amylase", "Lipase", "Catalase", "Protease"],
      correctAnswer: "Catalase",
      explanation: "Catalase is the enzyme found in liver that catalyzes the decomposition of hydrogen peroxide into water and oxygen.",
    },
    {
      question: "What are the products of the catalase-hydrogen peroxide reaction?",
      options: ["Carbon dioxide and water", "Water and oxygen", "Glucose and oxygen", "Water and hydrogen"],
      correctAnswer: "Water and oxygen",
      explanation: "Catalase breaks down hydrogen peroxide (H₂O₂) into water (H₂O) and oxygen (O₂).",
    },
    {
      question: "What is the approximate optimal temperature for human catalase?",
      options: ["25°C", "37°C", "50°C", "100°C"],
      correctAnswer: "37°C",
      explanation: "Human catalase works optimally at body temperature, which is approximately 37°C.",
    },
    {
      question: "What happens to enzyme activity at temperatures significantly above the optimal temperature?",
      options: [
        "It increases exponentially",
        "It remains constant",
        "It decreases due to denaturation",
        "It oscillates unpredictably",
      ],
      correctAnswer: "It decreases due to denaturation",
      explanation: "At high temperatures, the enzyme's protein structure begins to denature (unfold), causing a decrease in activity.",
    },
    {
      question: "Why does enzyme activity decrease at low temperatures?",
      options: ["Enzymes freeze", "Decreased kinetic energy", "Enzymes denature", "Substrate concentration decreases"],
      correctAnswer: "Decreased kinetic energy",
      explanation: "At low temperatures, there is less kinetic energy available, resulting in fewer successful collisions between enzymes and substrates.",
    },
    {
      question: "What is the substrate in the liver and hydrogen peroxide experiment?",
      options: ["Liver", "Catalase", "Hydrogen peroxide", "Oxygen"],
      correctAnswer: "Hydrogen peroxide",
      explanation: "Hydrogen peroxide (H₂O₂) is the substrate that the catalase enzyme acts upon in this reaction.",
    },
    {
      question: "Which of the following would NOT affect the rate of enzyme activity?",
      options: ["Temperature", "pH", "Substrate concentration", "The color of the container"],
      correctAnswer: "The color of the container",
      explanation: "The color of the container has no effect on enzyme activity. Temperature, pH, and substrate concentration all affect enzyme activity.",
    },
    {
      question: "What is the relationship between temperature and reaction rate below the optimal temperature?",
      options: [
        "As temperature increases, reaction rate decreases",
        "As temperature increases, reaction rate increases",
        "Temperature has no effect on reaction rate",
        "The relationship is random",
      ],
      correctAnswer: "As temperature increases, reaction rate increases",
      explanation: "Below the optimal temperature, increasing temperature provides more kinetic energy, leading to more successful collisions and faster reaction rates.",
    },
    {
      question: "What would happen to the reaction if the liver was boiled before adding hydrogen peroxide?",
      options: [
        "The reaction would be faster",
        "The reaction would be slower",
        "No reaction would occur",
        "The reaction would be explosive",
      ],
      correctAnswer: "No reaction would occur",
      explanation: "Boiling would denature the catalase enzyme, destroying its activity, so no reaction would occur when hydrogen peroxide is added.",
    },
    {
      question: "Which graph best represents the relationship between enzyme activity and temperature?",
      options: [
        "A straight line with positive slope",
        "A straight line with negative slope",
        "A bell-shaped curve",
        "A sigmoid curve",
      ],
      correctAnswer: "A bell-shaped curve",
      explanation: "Enzyme activity vs. temperature typically shows a bell-shaped curve, increasing to an optimal temperature and then decreasing as the enzyme denatures.",
    },
  ]

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#4b5563" : "#d1d5db"
  const tooltipBg = theme === "dark" ? "#1f2937" : "#ffffff"

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/student/simulations/bio">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Enzyme Activity: Catalase Experiment</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <Tabs defaultValue="theory" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="theory" className="text-lg">
            Theory
          </TabsTrigger>
          <TabsTrigger value="procedure" className="text-lg">
            Procedure
          </TabsTrigger>
          <TabsTrigger value="simulation" className="text-lg">
            Simulation
          </TabsTrigger>
          <TabsTrigger value="assessment" className="text-lg">
            Assessment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theory">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-4">Enzyme Theory</h2>
              <div className="prose max-w-none prose-invert">
                <h3 className="text-xl font-medium mt-4 mb-2">What are Enzymes?</h3>
                <p>
                  Enzymes are biological catalysts - proteins that speed up chemical reactions in living organisms
                  without being consumed in the process. They work by lowering the activation energy required for
                  reactions to occur.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-2">Catalase Enzyme</h3>
                <p>
                  Catalase is an enzyme found in nearly all living organisms that are exposed to oxygen. It catalyzes
                  the decomposition of hydrogen peroxide (H₂O₂) into water (H₂O) and oxygen (O₂):
                </p>
                <div className="bg-muted p-3 rounded-md my-3 text-center">
                  <p className="font-mono">2 H₂O₂ → 2 H₂O + O₂</p>
                </div>
                <p>
                  Catalase is one of the most efficient enzymes known, with each molecule able to convert millions of
                  hydrogen peroxide molecules per second.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-2">Factors Affecting Enzyme Activity</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Temperature:</strong> Enzymes have an optimal temperature at which they function most
                    efficiently. For human enzymes, this is typically around 37°C (body temperature).
                  </li>
                  <li>
                    <strong>pH:</strong> Each enzyme has an optimal pH range. Catalase works best at a neutral pH of
                    around 7.
                  </li>
                  <li>
                    <strong>Substrate Concentration:</strong> Higher substrate concentrations generally lead to faster
                    reaction rates, up to a saturation point.
                  </li>
                  <li>
                    <strong>Enzyme Concentration:</strong> More enzyme molecules can catalyze more reactions
                    simultaneously.
                  </li>
                  <li>
                    <strong>Inhibitors:</strong> Some substances can bind to enzymes and reduce their activity.
                  </li>
                </ol>
              </div>
            </Card>

            <Card className="p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-4">Temperature and Enzyme Activity</h2>
              <div className="prose max-w-none prose-invert">
                <p>
                  The relationship between temperature and enzyme activity follows a characteristic bell-shaped curve:
                </p>

                <div className="my-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={[
                        { temp: 0, rate: 10 },
                        { temp: 10, rate: 25 },
                        { temp: 20, rate: 50 },
                        { temp: 30, rate: 80 },
                        { temp: 37, rate: 100 },
                        { temp: 45, rate: 80 },
                        { temp: 55, rate: 40 },
                        { temp: 65, rate: 15 },
                        { temp: 75, rate: 5 },
                        { temp: 85, rate: 0 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis
                        dataKey="temp"
                        label={{ value: "Temperature (°C)", position: "insideBottomRight", offset: -10, fill: textColor }}
                        tick={{ fill: textColor }}
                      />
                      <YAxis
                        label={{ value: "Enzyme Activity (%)", angle: -90, position: "insideLeft", fill: textColor }}
                        tick={{ fill: textColor }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: tooltipBg,
                          borderColor: gridColor,
                          borderRadius: '0.5rem',
                        }}
                        itemStyle={{ color: textColor }}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#e11d48" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <h3 className="text-xl font-medium mt-4 mb-2">Low Temperature Effects</h3>
                <p>
                  At low temperatures, enzyme and substrate molecules have less kinetic energy, resulting in fewer
                  collisions and slower reaction rates. However, the enzyme structure remains intact.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">Optimal Temperature</h3>
                <p>
                  At the optimal temperature (around 37°C for human enzymes), there is sufficient kinetic energy for
                  frequent collisions while the enzyme structure remains stable. This results in maximum reaction rate.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-2">High Temperature Effects</h3>
                <p>
                  As temperature increases beyond the optimum, the enzyme's protein structure begins to denature
                  (unfold). This changes the shape of the active site, reducing the enzyme's ability to bind with
                  substrates. At very high temperatures, enzymes become completely denatured and lose all catalytic
                  activity.
                </p>

                <div className="bg-purple-500/10 border-l-4 border-purple-400 p-4 mt-4">
                  <p className="font-medium">Key Concept</p>
                  <p>
                    The optimal temperature for an enzyme often reflects the normal temperature of the organism or
                    environment in which it functions.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="procedure">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-4">Experimental Procedure</h2>
              <div className="prose max-w-none prose-invert">
                <p className="mb-4">
                  In this virtual experiment, you will investigate how temperature affects the activity of the enzyme
                  catalase, which is found in liver tissue. You will measure the rate of reaction between liver and
                  hydrogen peroxide at different temperatures.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-2">Materials (in real-world experiment)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Fresh liver samples</li>
                  <li>3% Hydrogen peroxide solution</li>
                  <li>Test tubes</li>
                  <li>Test tube rack</li>
                  <li>Water baths at various temperatures</li>
                  <li>Thermometer</li>
                  <li>Stopwatch</li>
                  <li>Ruler</li>
                  <li>Safety goggles and gloves</li>
                </ul>

                <h3 className="text-xl font-medium mt-6 mb-2">Safety Considerations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hydrogen peroxide can irritate skin and eyes - wear appropriate protection</li>
                  <li>Handle liver samples with gloves</li>
                  <li>Be careful with hot water baths to avoid burns</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-4">Step-by-Step Procedure</h2>
              <div className="prose max-w-none prose-invert">
                <ol className="list-decimal pl-5 space-y-4">
                  <li>
                    <strong>Preparation:</strong>
                    <p>
                      In a real lab, you would prepare equal-sized pieces of liver and set up water baths at different
                      temperatures (0°C, 10°C, 20°C, 37°C, 50°C, 70°C, 90°C).
                    </p>
                  </li>

                  <li>
                    <strong>Temperature Equilibration:</strong>
                    <p>
                      Place liver samples in test tubes and allow them to equilibrate to the desired temperature in the
                      water baths for 5 minutes.
                    </p>
                  </li>

                  <li>
                    <strong>Reaction:</strong>
                    <p>Add equal amounts of hydrogen peroxide to each test tube and immediately start timing.</p>
                  </li>

                  <li>
                    <strong>Measurement:</strong>
                    <p>
                      In a real experiment, you would measure the height of oxygen bubbles produced after a set time, or
                      time how long it takes to produce a certain volume of oxygen.
                    </p>
                  </li>

                  <li>
                    <strong>Data Collection:</strong>
                    <p>Record your results for each temperature tested.</p>
                  </li>

                  <li>
                    <strong>Analysis:</strong>
                    <p>Plot a graph of reaction rate versus temperature.</p>
                  </li>

                  <li>
                    <strong>Conclusion:</strong>
                    <p>Determine the optimal temperature for catalase activity and explain your findings.</p>
                  </li>
                </ol>

                <div className="bg-blue-500/10 border-l-4 border-blue-400 p-4 mt-6">
                  <p className="font-medium">Virtual Experiment</p>
                  <p>
                    In our virtual simulation, you will be able to adjust the temperature using a slider and observe the
                    reaction rate in real-time. The simulation will automatically collect data and plot the results for
                    you.
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-medium mb-2">Expected Results</h3>
                  <p>You should observe that:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Reaction rate increases as temperature increases from 0°C to around 37°C</li>
                    <li>Maximum reaction rate occurs at approximately 37°C (human body temperature)</li>
                    <li>Reaction rate decreases as temperature increases beyond 37°C</li>
                    <li>
                      Very little or no reaction occurs at temperatures above 70-80°C due to complete enzyme
                      denaturation
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-4">Experiment Simulation</h2>
              <p className="mb-4">
                This virtual experiment simulates the reaction between liver (containing the enzyme catalase) and
                hydrogen peroxide. Catalase breaks down hydrogen peroxide into water and oxygen, producing bubbles.
              </p>
              <p className="mb-6">
                The rate of this reaction is affected by temperature. Your task is to determine the optimal temperature
                for enzyme activity by observing the reaction rate at different temperatures.
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Temperature Control</h3>
                <div className="flex items-center gap-4 mb-2">
                  <Slider
                    value={[temperature]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setTemperature(value[0])}
                    className="flex-1"
                  />
                  <span className="w-16">{temperature}°C</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Reaction Visualization</h3>
                <div className="relative bg-muted rounded-md overflow-hidden" style={{ height: "200px" }}>
                  <canvas ref={canvasRef} className="w-full h-full"></canvas>
                  <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">
                    Bubble count: {bubbleCount}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {!prediction ? (
                  <Button onClick={handlePrediction} className="bg-primary hover:bg-primary/90">
                    Predict Optimal Temperature ({temperature}°C)
                  </Button>
                ) : (
                  <>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                      <p>
                        Your prediction: <strong>{prediction}°C</strong>
                      </p>
                      {showResults && (
                        <p className="mt-2">
                          {Math.abs(prediction - 37) <= 5
                            ? "Great job! Your prediction is close to the optimal temperature (37°C)."
                            : "The optimal temperature for human catalase is around 37°C (body temperature)."}
                        </p>
                      )}
                    </div>
                    {!showResults ? (
                      <Button onClick={handleReveal} className="bg-primary hover:bg-primary/90">
                        Reveal Optimal Temperature
                      </Button>
                    ) : (
                      <Button onClick={resetExperiment} variant="outline">
                        Reset Experiment
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-4">Reaction Rate vs. Temperature</h2>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reactionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis
                      dataKey="temp"
                      label={{ value: "Temperature (°C)", position: "insideBottomRight", offset: -10, fill: textColor }}
                      tick={{ fill: textColor }}
                    />
                    <YAxis
                      label={{ value: "Reaction Rate", angle: -90, position: "insideLeft", fill: textColor }}
                      domain={[0, 100]}
                      tick={{ fill: textColor }}
                    />
                    <Tooltip
                      formatter={(value) => (typeof value === "number" ? [`${value.toFixed(1)}`, "Reaction Rate"] : [value, "Reaction Rate"])}
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: gridColor,
                        borderRadius: '0.5rem',
                      }}
                      itemStyle={{ color: textColor }}
                    />
                    <Line type="monotone" dataKey="rate" stroke="#e11d48" activeDot={{ r: 8 }} name="Reaction Rate" />
                    {prediction && showResults && (
                      <Line
                        type="monotone"
                        data={[{ temp: 37, rate: calculateReactionRate(37) }]}
                        dataKey="rate"
                        stroke="#4ade80"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Optimal (37°C)"
                        dot={{ r: 6 }}
                      />
                    )}
                    {prediction && (
                      <Line
                        type="monotone"
                        data={[{ temp: prediction, rate: calculateReactionRate(prediction) }]}
                        dataKey="rate"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Your Prediction"
                        dot={{ r: 6 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Observations</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>At low temperatures (0-10°C), enzyme activity is low due to reduced molecular movement.</li>
                  <li>As temperature increases, the reaction rate increases due to increased kinetic energy.</li>
                  <li>The reaction rate peaks at around 37°C, which is human body temperature.</li>
                  <li>Above 37°C, the reaction rate decreases as the enzyme begins to denature.</li>
                  <li>
                    At very high temperatures (above 70°C), there is minimal enzyme activity due to complete
                    denaturation.
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessment">
          <Card className="p-6 bg-card">
            {!assessmentCompleted ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Assessment</h2>
                  <div className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {assessmentQuestions.length}
                  </div>
                </div>

                <Progress value={(currentQuestion / assessmentQuestions.length) * 100} className="mb-8" />

                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">{assessmentQuestions[currentQuestion].question}</h3>

                  <RadioGroup
                    value={selectedAnswers[currentQuestion] || ""}
                    onValueChange={handleAnswerSelect}
                    className="space-y-3"
                  >
                    {assessmentQuestions[currentQuestion].options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 rounded-lg border p-4 ${
                          showExplanation && option === assessmentQuestions[currentQuestion].correctAnswer
                            ? "bg-green-500/10 border-green-500/20"
                            : showExplanation &&
                                option === selectedAnswers[currentQuestion] &&
                                option !== assessmentQuestions[currentQuestion].correctAnswer
                              ? "bg-red-500/10 border-red-500/20"
                              : "bg-background"
                        }`}
                      >
                        <RadioGroupItem value={option} id={`option-${index}`} disabled={showExplanation} />
                        <Label htmlFor={`option-${index}`} className="flex-grow">
                          {option}
                        </Label>
                        {showExplanation && option === assessmentQuestions[currentQuestion].correctAnswer && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                        {showExplanation &&
                          option === selectedAnswers[currentQuestion] &&
                          option !== assessmentQuestions[currentQuestion].correctAnswer && (
                            <X className="h-5 w-5 text-red-600" />
                          )}
                      </div>
                    ))}
                  </RadioGroup>

                  {showExplanation && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-md">
                      <div className="flex items-start">
                        <HelpCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Explanation:</p>
                          <p>{assessmentQuestions[currentQuestion].explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button onClick={prevQuestion} disabled={currentQuestion === 0} variant="outline">
                    Previous
                  </Button>

                  <div>
                    {!showExplanation && selectedAnswers[currentQuestion] ? (
                      <Button onClick={checkAnswer} className="bg-primary hover:bg-primary/90">
                        Check Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={nextQuestion}
                        className="bg-primary hover:bg-primary/90"
                        disabled={!selectedAnswers[currentQuestion]}
                      >
                        {currentQuestion === assessmentQuestions.length - 1 ? "Finish" : "Next"}{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">Assessment Complete!</h2>
                <div className="mb-6">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {calculateScore()} / {assessmentQuestions.length}
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {calculateScore() === assessmentQuestions.length
                      ? "Perfect score! Excellent understanding of enzyme activity."
                      : calculateScore() >= assessmentQuestions.length * 0.7
                        ? "Good job! You have a solid understanding of enzyme activity."
                        : "Keep studying! Review the theory section to improve your understanding."}
                  </p>
                </div>

                <Button onClick={resetAssessment} className="bg-primary hover:bg-primary/90">
                  Retake Assessment
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}