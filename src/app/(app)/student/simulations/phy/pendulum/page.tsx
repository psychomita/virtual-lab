"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PendulumSimulation() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [length, setLength] = useState(150)
  const [gravity, setGravity] = useState(9.8)
  const [angle, setAngle] = useState(Math.PI / 4)
  const [isRunning, setIsRunning] = useState(false)
  const [angularVelocity, setAngularVelocity] = useState(0)
  const [time, setTime] = useState(0)
  const [period, setPeriod] = useState(0)
  const [damping, setDamping] = useState(0.1)

  // Original simulation calculations and animation
  useEffect(() => {
    const calculatedPeriod = 2 * Math.PI * Math.sqrt(length / 100 / gravity)
    setPeriod(calculatedPeriod)
  }, [length, gravity])

  useEffect(() => {
    if (!isRunning) return

    let animationFrameId: number
    let lastTime = 0

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      setTime((prevTime) => prevTime + deltaTime)
      const angularAcceleration = -(gravity / (length / 100)) * Math.sin(angle) - damping * angularVelocity
      setAngularVelocity((prevVelocity) => prevVelocity + angularAcceleration * deltaTime)
      setAngle((prevAngle) => prevAngle + angularVelocity * deltaTime)
      drawPendulum()

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isRunning, angle, angularVelocity, length, gravity, damping])

  const drawPendulum = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with theme-appropriate background
    ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const originX = canvas.width / 2
    const originY = 50
    const bobX = originX + length * Math.sin(angle)
    const bobY = originY + length * Math.cos(angle)

    // Draw string
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(bobX, bobY)
    ctx.strokeStyle = theme === 'dark' ? '#94a3b8' : '#666'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw pivot
    ctx.beginPath()
    ctx.arc(originX, originY, 5, 0, Math.PI * 2)
    ctx.fillStyle = theme === 'dark' ? '#cbd5e1' : '#333'
    ctx.fill()

    // Draw bob
    ctx.beginPath()
    ctx.arc(bobX, bobY, 20, 0, Math.PI * 2)
    ctx.fillStyle = "#3b82f6"
    ctx.fill()
    ctx.strokeStyle = "#1d4ed8"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw angle indicator
    ctx.beginPath()
    ctx.arc(originX, originY, 30, -Math.PI / 2, -Math.PI / 2 + angle, angle > 0)
    ctx.strokeStyle = "rgba(59, 130, 246, 0.5)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Angle text
    ctx.fillStyle = theme === 'dark' ? '#e2e8f0' : '#333'
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`${((angle * 180) / Math.PI).toFixed(1)}°`, originX + 50, originY + 10)
  }

  useEffect(() => {
    drawPendulum()
  }, [length, angle, theme])

  const resetSimulation = () => {
    setIsRunning(false)
    setAngle(Math.PI / 4)
    setAngularVelocity(0)
    setTime(0)
    drawPendulum()
  }

  // Theory Component
  function PendulumTheory() {
    return (
      <div className="space-y-6 dark:text-gray-200">
        <h2 className="text-2xl font-bold">Pendulum Motion Theory</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Introduction</h3>
          <p>
            A pendulum is a weight suspended from a pivot that swings freely under gravity. The simple pendulum is a
            fundamental system in physics that exhibits periodic motion and is used to study harmonic motion.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Key Concepts</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium">Simple Pendulum</h4>
            <p className="mt-1">
              A simple pendulum consists of a point mass (bob) suspended from a fixed point by a massless,
              inextensible string.
            </p>

            <h4 className="font-medium mt-3">Period of Oscillation</h4>
            <div className="my-2 font-mono">T = 2π × √(L/g)</div>
            <p>Where:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>T = Period (time for one complete swing)</li>
              <li>L = Length of pendulum</li>
              <li>g = Acceleration due to gravity</li>
            </ul>

            <h4 className="font-medium mt-3">Small Angle Approximation</h4>
            <p>
              For small angles (θ &lt; 15°), the motion is nearly simple harmonic with period independent of amplitude.
              For larger angles, the period increases with amplitude.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Energy Considerations</h3>
          <p>
            In an ideal pendulum (no friction/air resistance), energy continuously converts between potential and kinetic:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Maximum potential energy at highest points</li>
            <li>Maximum kinetic energy at lowest point</li>
            <li>Total mechanical energy remains constant</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Damped Pendulum</h3>
          <p>
            Real pendulums experience damping from air resistance and friction, causing the amplitude to gradually
            decrease over time. The damping coefficient (b) determines how quickly energy is lost.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Applications</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Timekeeping in clocks</li>
            <li>Seismometers for earthquake detection</li>
            <li>Demonstrating conservation of energy</li>
            <li>Studying harmonic motion and differential equations</li>
          </ul>
        </div>
      </div>
    )
  }

  // Procedure Component
  function PendulumProcedure() {
    return (
      <div className="space-y-6 dark:text-gray-200">
        <h2 className="text-2xl font-bold">Experimental Procedure</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Objectives</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Investigate the relationship between pendulum length and period</li>
            <li>Examine how gravity affects pendulum motion</li>
            <li>Study the effect of initial angle on oscillation</li>
            <li>Observe how damping influences the motion</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Materials</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Pendulum simulation (this application)</li>
            <li>Stopwatch (for real-world verification)</li>
            <li>Data recording sheet</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Part 1: Length vs. Period</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Set gravity to 9.8 m/s² (Earth)</li>
            <li>Set initial angle to 15°</li>
            <li>Set damping to 0 (no friction)</li>
            <li>Start with length = 50 cm, record period</li>
            <li>Increase length in 25 cm increments up to 300 cm</li>
            <li>Record period for each length</li>
            <li>Plot period vs. √length and verify T ∝ √L</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Part 2: Gravity's Effect</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Set length to 100 cm</li>
            <li>Set initial angle to 15°</li>
            <li>Set damping to 0</li>
            <li>Vary gravity from 1 m/s² (Moon) to 9.8 m/s² (Earth) to 24.8 m/s² (Jupiter)</li>
            <li>Record period for each gravity value</li>
            <li>Plot period vs. 1/√g and verify T ∝ 1/√g</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Part 3: Angle and Damping</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Set length = 100 cm, gravity = 9.8 m/s²</li>
            <li>Test with angles: 5°, 15°, 30°, 45°, 60°</li>
            <li>Observe how period changes with amplitude</li>
            <li>Set damping = 0.1 and observe amplitude decay</li>
            <li>Measure how many oscillations until amplitude halves</li>
          </ol>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <h3 className="font-semibold">Analysis Questions</h3>
          <ol className="list-decimal pl-6 space-y-1 mt-2">
            <li>How does your length vs. period data compare to the theoretical prediction?</li>
            <li>What happens to the period when you increase the initial angle beyond 15°?</li>
            <li>How does changing gravity affect the pendulum's behavior?</li>
          </ol>
        </div>
      </div>
    )
  }

  // Assessment Questions
  const pendulumAssessment = [
    {
      id: "pendulum-q1",
      question: "What happens to the period if you double the length of a pendulum?",
      options: [
        "It doubles",
        "It increases by √2",
        "It halves",
        "It decreases by √2"
      ],
      correctAnswer: "It increases by √2",
      explanation: "Period is proportional to the square root of length (T ∝ √L), so doubling length increases period by √2."
    },
    {
      id: "pendulum-q2",
      question: "The small angle approximation is valid for angles less than:",
      options: [
        "5°",
        "15°",
        "30°",
        "45°"
      ],
      correctAnswer: "15°",
      explanation: "For angles < 15°, the approximation sinθ ≈ θ holds well, making motion nearly simple harmonic."
    },
    {
      id: "pendulum-q3",
      question: "Where is the pendulum bob's speed greatest?",
      options: [
        "At the highest point",
        "At the lowest point",
        "Midway between highest and lowest",
        "Speed is constant"
      ],
      correctAnswer: "At the lowest point",
      explanation: "All potential energy converts to kinetic energy at the lowest point, resulting in maximum speed."
    },
    {
      id: "pendulum-q4",
      question: "How does increasing gravity affect the period?",
      options: [
        "Increases period",
        "Decreases period",
        "No effect",
        "Depends on length"
      ],
      correctAnswer: "Decreases period",
      explanation: "Greater gravity increases restoring force, making oscillations faster (T ∝ 1/√g)."
    },
    {
      id: "pendulum-q5",
      question: "What energy transformation occurs in a frictionless pendulum?",
      options: [
        "PE → KE → PE",
        "KE → PE → KE",
        "Energy remains constant",
        "Both A and B"
      ],
      correctAnswer: "Both A and B",
      explanation: "Energy continuously converts between potential (PE) and kinetic (KE) while total remains constant."
    },
    {
      id: "pendulum-q6",
      question: "What effect does damping have on a pendulum?",
      options: [
        "Increases period",
        "Decreases amplitude over time",
        "Changes equilibrium position",
        "Both A and B"
      ],
      correctAnswer: "Decreases amplitude over time",
      explanation: "Damping causes gradual amplitude reduction but doesn't significantly affect period in most cases."
    },
    {
      id: "pendulum-q7",
      question: "A pendulum on the Moon (g=1.6 m/s²) compared to Earth will have:",
      options: [
        "Longer period",
        "Shorter period",
        "Same period",
        "No oscillations"
      ],
      correctAnswer: "Longer period",
      explanation: "Lower gravity means weaker restoring force, resulting in slower oscillations (longer period)."
    },
    {
      id: "pendulum-q8",
      question: "The restoring force in a pendulum is:",
      options: [
        "mg sinθ",
        "mg cosθ",
        "mg tanθ",
        "mg"
      ],
      correctAnswer: "mg sinθ",
      explanation: "Only the tangential component (mg sinθ) acts as the restoring force."
    },
    {
      id: "pendulum-q9",
      question: "For large initial angles, the period:",
      options: [
        "Increases with amplitude",
        "Decreases with amplitude",
        "Remains constant",
        "Becomes unpredictable"
      ],
      correctAnswer: "Increases with amplitude",
      explanation: "For large angles, the small angle approximation fails and period increases with amplitude."
    },
    {
      id: "pendulum-q10",
      question: "In a grandfather clock, if it runs slow you should:",
      options: [
        "Increase pendulum length",
        "Decrease pendulum length",
        "Increase bob mass",
        "Decrease bob mass"
      ],
      correctAnswer: "Decrease pendulum length",
      explanation: "Shorter length decreases period, making the clock run faster to correct the slow time."
    }
  ]

  // Assessment Component
  function PendulumAssessment() {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitted, setSubmitted] = useState(false)

    const handleAnswer = (questionId: string, answer: string) => {
      setAnswers(prev => ({ ...prev, [questionId]: answer }))
    }

    const handleSubmit = () => {
      setSubmitted(true)
    }

    const score = pendulumAssessment.filter(q => answers[q.id] === q.correctAnswer).length

    return (
      <div className="space-y-6 dark:text-gray-200">
        <h2 className="text-2xl font-bold">Pendulum Assessment</h2>
        
        {submitted && (
          <div className={`p-4 rounded-md ${
            score >= pendulumAssessment.length * 0.7 
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" 
              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
          }`}>
            <p className="font-medium">Score: {score}/{pendulumAssessment.length}</p>
            <p className="mt-1">
              {score === pendulumAssessment.length ? "Perfect! 🎯" : 
               score >= pendulumAssessment.length * 0.7 ? "Good job! 👍" : 
               "Keep practicing! 💪"}
            </p>
          </div>
        )}

        {pendulumAssessment.map(question => (
          <div key={question.id} className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
            <h3 className="font-medium">{question.question}</h3>
            <div className="space-y-2">
              {question.options.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${question.id}-${option}`}
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswer(question.id, option)}
                    disabled={submitted}
                    className="h-4 w-4 text-primary"
                  />
                  <label htmlFor={`${question.id}-${option}`}>{option}</label>
                </div>
              ))}
            </div>
            
            {submitted && (
              <div className={`p-3 rounded-md ${
                answers[question.id] === question.correctAnswer 
                  ? "bg-green-50 dark:bg-green-900/20" 
                  : "bg-red-50 dark:bg-red-900/20"
              }`}>
                <p className="font-medium">
                  {answers[question.id] === question.correctAnswer ? "✓ Correct" : "✗ Incorrect"}
                </p>
                <p className="text-sm mt-1">{question.explanation}</p>
              </div>
            )}
          </div>
        ))}

        {!submitted ? (
          <Button onClick={handleSubmit}>Submit Answers</Button>
        ) : (
          <Button variant="outline" onClick={() => {
            setAnswers({})
            setSubmitted(false)
          }}>
            Try Again
          </Button>
        )}
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link href="/student/simulations/phy">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Pendulum Motion Simulation</h1>
      </div>

      <Tabs defaultValue="simulation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="theory">Theory</TabsTrigger>
          <TabsTrigger value="procedure">Procedure</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="theory">
          <Card className="bg-background">
            <CardContent className="p-6">
              <PendulumTheory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedure">
          <Card className="bg-background">
            <CardContent className="p-6">
              <PendulumProcedure />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="w-full h-full bg-background">
                <CardHeader>
                  <CardTitle>Simulation</CardTitle>
                  <CardDescription>Adjust parameters and observe the pendulum</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <canvas 
                    ref={canvasRef} 
                    width={500} 
                    height={400} 
                    className="border rounded-md dark:border-gray-700 bg-background" 
                  />

                  <div className="flex gap-4 mt-4">
                    <Button
                      onClick={() => setIsRunning(!isRunning)}
                      className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600"
                    >
                      {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {isRunning ? "Pause" : "Start"}
                    </Button>
                    <Button onClick={resetSimulation} variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground">
                    Time: {time.toFixed(2)}s | Period: {period.toFixed(2)}s
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle>Parameters</CardTitle>
                  <CardDescription>Adjust these values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-muted-foreground">Length (cm)</label>
                      <span className="text-muted-foreground">{length}</span>
                    </div>
                    <Slider
                      value={[length]}
                      min={50}
                      max={300}
                      step={1}
                      onValueChange={(val) => setLength(val[0])}
                      disabled={isRunning}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-muted-foreground">Gravity (m/s²)</label>
                      <span className="text-muted-foreground">{gravity}</span>
                    </div>
                    <Slider
                      value={[gravity]}
                      min={1}
                      max={20}
                      step={0.1}
                      onValueChange={(val) => setGravity(val[0])}
                      disabled={isRunning}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-muted-foreground">Initial Angle (degrees)</label>
                      <span className="text-muted-foreground">{((angle * 180) / Math.PI).toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[(angle * 180) / Math.PI]}
                      min={-90}
                      max={90}
                      step={1}
                      onValueChange={(val) => setAngle((val[0] * Math.PI) / 180)}
                      disabled={isRunning}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-muted-foreground">Damping Coefficient</label>
                      <span className="text-muted-foreground">{damping.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[damping]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(val) => setDamping(val[0])}
                      disabled={isRunning}
                    />
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <h3 className="font-medium mb-2">Current Values</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Length:</div>
                      <div className="font-mono">{length} cm</div>
                      <div className="text-muted-foreground">Gravity:</div>
                      <div className="font-mono">{gravity} m/s²</div>
                      <div className="text-muted-foreground">Angle:</div>
                      <div className="font-mono">{((angle * 180) / Math.PI).toFixed(1)}°</div>
                      <div className="text-muted-foreground">Period:</div>
                      <div className="font-mono">{period.toFixed(2)} s</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assessment">
          <Card className="bg-background">
            <CardContent className="p-6">
              <PendulumAssessment />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}