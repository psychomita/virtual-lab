"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectileMotionSimulation() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [velocity, setVelocity] = useState(50)
  const [angle, setAngle] = useState(45)
  const [gravity, setGravity] = useState(9.8)
  const [height, setHeight] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([])
  const [maxHeight, setMaxHeight] = useState(0)
  const [range, setRange] = useState(0)
  const [flightTime, setFlightTime] = useState(0)
  const [scaleFactor, setScaleFactor] = useState(3)

  // Calculate theoretical values
  useEffect(() => {
    const angleRad = (angle * Math.PI) / 180
    const vx = velocity * Math.cos(angleRad)
    const vy = velocity * Math.sin(angleRad)

    const timeOfFlight = (2 * vy) / gravity + Math.sqrt((2 * height) / gravity)
    const horizontalRange = vx * timeOfFlight
    const maxH = height + (vy * vy) / (2 * gravity)

    setFlightTime(timeOfFlight)
    setRange(horizontalRange)
    setMaxHeight(maxH)

    const expectedRange = horizontalRange * 5
    const canvasWidth = 800
    if (expectedRange > canvasWidth - 100) {
      setScaleFactor(Math.max(2, (canvasWidth - 100) / horizontalRange))
    } else {
      setScaleFactor(5)
    }
  }, [velocity, angle, gravity, height])

  // Animation loop
  useEffect(() => {
    if (!isRunning) return

    let animationFrameId: number
    let lastTime = 0
    let newPositions: { x: number; y: number }[] = []
    let currentTime = 0
    const startX = 50
    const startY = 450 - height * scaleFactor

    const animate = (timestamp: number) => {
      if (!lastTime) {
        lastTime = timestamp
        newPositions = [{ x: startX, y: startY }]
        setPositions(newPositions)
      }

      const deltaTime = (timestamp - lastTime) / 1000
      lastTime = timestamp

      currentTime += deltaTime
      setTime(currentTime)

      const angleRad = (angle * Math.PI) / 180
      const vx = velocity * Math.cos(angleRad)
      const vy = velocity * Math.sin(angleRad)

      const x = startX + vx * currentTime * scaleFactor
      const y = startY - (height + vy * currentTime - 0.5 * gravity * currentTime * currentTime) * scaleFactor

      newPositions.push({ x, y })
      setPositions([...newPositions])
      drawProjectile(newPositions, x, y)

      if (y >= 450) {
        setIsRunning(false)
        return
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isRunning, angle, velocity, gravity, height, scaleFactor])

  const drawProjectile = (positions: { x: number; y: number }[], currentX: number, currentY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with theme-appropriate background
    ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw ground
    ctx.beginPath()
    ctx.moveTo(0, 450)
    ctx.lineTo(canvas.width, 450)
    ctx.strokeStyle = theme === 'dark' ? '#94a3b8' : '#333'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw initial height platform
    if (height > 0) {
      ctx.beginPath()
      ctx.rect(0, 450, 100, -height * scaleFactor)
      ctx.fillStyle = theme === 'dark' ? '#334155' : '#d1d5db'
      ctx.fill()
      ctx.strokeStyle = theme === 'dark' ? '#64748b' : '#9ca3af'
      ctx.stroke()
    }

    // Draw trajectory
    if (positions.length > 1) {
      ctx.beginPath()
      ctx.moveTo(positions[0].x, positions[0].y)
      for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i].x, positions[i].y)
      }
      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw projectile
    ctx.beginPath()
    ctx.arc(currentX, currentY, 10, 0, Math.PI * 2)
    ctx.fillStyle = "#3b82f6"
    ctx.fill()
    ctx.strokeStyle = "#1d4ed8"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw angle indicator
    if (!isRunning || time < 0.1) {
      const angleRad = (angle * Math.PI) / 180
      ctx.beginPath()
      ctx.moveTo(50, 450 - height * scaleFactor)
      ctx.lineTo(50 + Math.cos(angleRad) * 50, 450 - height * scaleFactor - Math.sin(angleRad) * 50)
      ctx.strokeStyle = "rgba(239, 68, 68, 0.7)"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = theme === 'dark' ? '#e2e8f0' : '#333'
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${angle}°`, 80, 430 - height * scaleFactor)
    }

    // Labels
    ctx.fillStyle = theme === 'dark' ? '#e2e8f0' : '#333'
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    const currentHeight = (450 - currentY) / scaleFactor
    if (currentHeight > 0) {
      ctx.fillText(`Height: ${currentHeight.toFixed(1)}m`, currentX, currentY - 20)
    }

    const distance = (currentX - 50) / scaleFactor
    ctx.fillText(`Distance: ${distance.toFixed(1)}m`, currentX, 470)
  }

  useEffect(() => {
    const initialPositions = [{ x: 50, y: 450 - height * scaleFactor }]
    setPositions(initialPositions)
    drawProjectile(initialPositions, 50, 450 - height * scaleFactor)
  }, [height, scaleFactor, theme])

  const resetSimulation = () => {
    setIsRunning(false)
    setTime(0)
    setPositions([{ x: 50, y: 450 - height * scaleFactor }])
    drawProjectile([{ x: 50, y: 450 - height * scaleFactor }], 50, 450 - height * scaleFactor)
  }

  // Theory Component
  function ProjectileTheory() {
    return (
      <div className="space-y-6 dark:text-gray-200">
        <h2 className="text-2xl font-bold">Projectile Motion Theory</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Introduction</h3>
          <p>
            Projectile motion is a form of motion where an object moves along a curved path under the action of gravity.
            The path followed is called its trajectory.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Key Equations</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <p className="font-mono">Horizontal motion: x = v₀·cosθ·t</p>
            <p className="font-mono">Vertical motion: y = h + v₀·sinθ·t - ½gt²</p>
            <p className="font-mono mt-2">Range = (v₀²·sin2θ)/g</p>
            <p className="font-mono">Max height = h + (v₀²·sin²θ)/(2g)</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Key Concepts</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Horizontal and vertical motions are independent</li>
            <li>Horizontal velocity remains constant (no air resistance)</li>
            <li>Vertical acceleration is constant (gravity)</li>
            <li>Maximum range occurs at 45° (no air resistance)</li>
          </ul>
        </div>
      </div>
    )
  }

  // Procedure Component
  function ProjectileProcedure() {
    return (
      <div className="space-y-6 dark:text-gray-200">
        <h2 className="text-2xl font-bold">Experimental Procedure</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Objectives</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Investigate angle vs range relationship</li>
            <li>Examine velocity's effect on motion</li>
            <li>Study height's impact on trajectory</li>
            <li>Observe gravity's influence</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Steps</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Set initial velocity to 50 m/s</li>
            <li>Set gravity to 9.8 m/s²</li>
            <li>Set height to 0 m</li>
            <li>Vary launch angle from 15° to 75°</li>
            <li>Record range for each angle</li>
            <li>Plot range vs angle graph</li>
            <li>Repeat with different velocities</li>
            <li>Repeat with different heights</li>
          </ol>
        </div>
      </div>
    )
  }

  // Assessment Questions
  const projectileAssessment = [
    {
      id: "projectile-q1",
      question: "What launch angle gives maximum range (no air resistance)?",
      options: ["30°", "45°", "60°", "90°"],
      correctAnswer: "45°",
      explanation: "45° gives maximum range because sin(2θ) reaches its peak value at θ=45°."
    },
    {
      id: "projectile-q2",
      question: "Doubling initial velocity affects range by:",
      options: ["Doubling", "Quadrupling", "No change", "Square root"],
      correctAnswer: "Quadrupling",
      explanation: "Range is proportional to velocity squared (R ∝ v₀²)."
    },
    {
      id: "projectile-q3",
      question: "Which doesn't affect time of flight?",
      options: ["Initial velocity", "Launch angle", "Gravity", "Mass"],
      correctAnswer: "Mass",
      explanation: "Time depends on velocity, angle, and gravity but not mass."
    },
    {
      id: "projectile-q4",
      question: "Angles that give same range are called:",
      options: ["Supplementary", "Complementary", "Opposite", "Equal"],
      correctAnswer: "Complementary",
      explanation: "Complementary angles (summing to 90°) give same range."
    },
    {
      id: "projectile-q5",
      question: "At peak height, vertical velocity is:",
      options: ["Maximum", "Zero", "Equal to horizontal", "Minimum"],
      correctAnswer: "Zero",
      explanation: "Vertical velocity momentarily becomes zero at peak height."
    },
    {
      id: "projectile-q6",
      question: "Horizontal velocity during flight:",
      options: ["Increases", "Decreases", "Constant", "Varies"],
      correctAnswer: "Constant",
      explanation: "With no air resistance, horizontal velocity remains constant."
    },
    {
      id: "projectile-q7",
      question: "Increasing gravity affects time of flight by:",
      options: ["Increasing", "Decreasing", "No effect", "Depends"],
      correctAnswer: "Decreasing",
      explanation: "Greater gravity reduces time of flight (t ∝ 1/√g)."
    },
    {
      id: "projectile-q8",
      question: "Trajectory shape is:",
      options: ["Circular", "Parabolic", "Linear", "Elliptical"],
      correctAnswer: "Parabolic",
      explanation: "Under constant gravity, path follows a parabola."
    },
    {
      id: "projectile-q9",
      question: "Maximum height is achieved when:",
      options: ["Vertical velocity=0", "Horizontal velocity=0", "Angle=90°", "Time=0"],
      correctAnswer: "Vertical velocity=0",
      explanation: "Peak occurs when vertical component of velocity becomes zero."
    },
    {
      id: "projectile-q10",
      question: "Initial height affects:",
      options: ["Only range", "Only max height", "Both", "Neither"],
      correctAnswer: "Both",
      explanation: "Greater initial height increases both range and maximum height."
    }
  ]

  // Assessment Component
  function ProjectileAssessment() {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitted, setSubmitted] = useState(false)

    const handleAnswer = (questionId: string, answer: string) => {
      setAnswers(prev => ({ ...prev, [questionId]: answer }))
    }

    const handleSubmit = () => {
      setSubmitted(true)
    }

    const score = projectileAssessment.filter(q => answers[q.id] === q.correctAnswer).length

    return (
      <div className="space-y-6 dark:text-gray-200">
        <h2 className="text-2xl font-bold">Assessment</h2>
        
        {submitted && (
          <div className={`p-4 rounded-md ${
            score >= projectileAssessment.length * 0.7 
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" 
              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
          }`}>
            <p className="font-medium">Score: {score}/{projectileAssessment.length}</p>
            <p className="text-sm mt-1">
              {score === projectileAssessment.length ? "Perfect! 🎯" : 
               score >= projectileAssessment.length * 0.7 ? "Good job! 👍" : 
               "Keep practicing! 💪"}
            </p>
          </div>
        )}

        {projectileAssessment.map(question => (
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
              <div className={`p-3 rounded-md mt-2 ${
                answers[question.id] === question.correctAnswer 
                  ? "bg-green-50 dark:bg-green-900/20" 
                  : "bg-red-50 dark:bg-red-900/20"
              }`}>
                <p className="font-medium">
                  {answers[question.id] === question.correctAnswer ? "Correct" : "Incorrect"}
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
        <h1 className="text-3xl font-bold">Projectile Motion Simulation</h1>
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
              <ProjectileTheory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedure">
          <Card className="bg-background">
            <CardContent className="p-6">
              <ProjectileProcedure />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="w-full h-full bg-background">
                <CardHeader>
                  <CardTitle>Simulation</CardTitle>
                  <CardDescription>Adjust parameters and launch the projectile</CardDescription>
                </CardHeader>
                <CardContent>
                  <canvas 
                    ref={canvasRef} 
                    width={800} 
                    height={500} 
                    className="border rounded-md dark:border-gray-700 bg-background w-full" 
                  />
                  
                  <div className="flex gap-4 mt-4">
                    <Button
                      onClick={() => setIsRunning(!isRunning)}
                      className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600"
                      disabled={isRunning}
                    >
                      {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {isRunning ? "Running" : "Launch"}
                    </Button>
                    <Button onClick={resetSimulation} variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">Time: {time.toFixed(2)}s</p>
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
                      <label className="text-muted-foreground">Velocity (m/s)</label>
                      <span className="text-muted-foreground">{velocity}</span>
                    </div>
                    <Slider
                      value={[velocity]}
                      min={10}
                      max={100}
                      step={1}
                      onValueChange={(val) => setVelocity(val[0])}
                      disabled={isRunning}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-muted-foreground">Angle (degrees)</label>
                      <span className="text-muted-foreground">{angle}</span>
                    </div>
                    <Slider
                      value={[angle]}
                      min={0}
                      max={90}
                      step={1}
                      onValueChange={(val) => setAngle(val[0])}
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
                      <label className="text-muted-foreground">Height (m)</label>
                      <span className="text-muted-foreground">{height}</span>
                    </div>
                    <Slider
                      value={[height]}
                      min={0}
                      max={30}
                      step={1}
                      onValueChange={(val) => setHeight(val[0])}
                      disabled={isRunning}
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Calculated Values</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Max Height:</div>
                      <div className="font-mono">{maxHeight.toFixed(2)} m</div>
                      <div className="text-muted-foreground">Range:</div>
                      <div className="font-mono">{range.toFixed(2)} m</div>
                      <div className="text-muted-foreground">Flight Time:</div>
                      <div className="font-mono">{flightTime.toFixed(2)} s</div>
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
              <ProjectileAssessment />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}