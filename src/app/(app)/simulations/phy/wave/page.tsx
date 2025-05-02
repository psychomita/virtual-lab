"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, RefreshCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function WaveInterferenceSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(true)
  const [time, setTime] = useState(0)

  // Wave 1 parameters
  const [amplitude1, setAmplitude1] = useState(50)
  const [frequency1, setFrequency1] = useState(0.5)
  const [phase1, setPhase1] = useState(0)

  // Wave 2 parameters
  const [amplitude2, setAmplitude2] = useState(50)
  const [frequency2, setFrequency2] = useState(0.5)
  const [phase2, setPhase2] = useState(Math.PI)

  // Display options
  const [showWave1, setShowWave1] = useState(true)
  const [showWave2, setShowWave2] = useState(true)
  const [showResultant, setShowResultant] = useState(true)
  const [waveType, setWaveType] = useState<"sine" | "square" | "sawtooth" | "triangle">("sine")
  const [showPhaseAnimation, setShowPhaseAnimation] = useState(true)

  // Animation loop
  useEffect(() => {
    if (!isRunning) return

    let animationFrameId: number
    let lastTime = 0

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime
      const deltaTime = (currentTime - lastTime) / 1000 // Convert to seconds
      lastTime = currentTime

      // Update time
      setTime((prevTime) => prevTime + deltaTime)

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isRunning])

  // Draw the waves
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up coordinate system
    const centerY = canvas.height / 2
    const width = canvas.width
    const dx = 1 // x increment

    // Draw grid
    ctx.strokeStyle = "#ddd"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Draw x-axis
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.stroke()

    // Function to generate wave points based on type
    const generateWavePoint = (
      x: number,
      amplitude: number,
      frequency: number,
      phase: number,
      type: string,
      time: number,
    ): number => {
      const k = (2 * Math.PI * frequency) / width
      const omega = 2 * Math.PI * frequency
      const t = time

      switch (type) {
        case "sine":
          return amplitude * Math.sin(k * x - omega * t + phase)
        case "square":
          return amplitude * Math.sign(Math.sin(k * x - omega * t + phase))
        case "sawtooth":
          const sawValue = ((x * frequency) / 50 + t * frequency - phase / (2 * Math.PI)) % 1
          return amplitude * (2 * sawValue - 1)
        case "triangle":
          const triValue = ((x * frequency) / 50 + t * frequency - phase / (2 * Math.PI)) % 1
          return amplitude * (4 * Math.abs(triValue - 0.5) - 1)
        default:
          return amplitude * Math.sin(k * x - omega * t + phase)
      }
    }

    // Draw wave 1
    if (showWave1) {
      ctx.beginPath()
      ctx.moveTo(0, centerY)

      for (let x = 0; x <= width; x += dx) {
        const y = centerY - generateWavePoint(x, amplitude1, frequency1, phase1, waveType, time)
        ctx.lineTo(x, y)
      }

      ctx.strokeStyle = "#3b82f6" // Blue
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw wave 2
    if (showWave2) {
      ctx.beginPath()
      ctx.moveTo(0, centerY)

      for (let x = 0; x <= width; x += dx) {
        const y = centerY - generateWavePoint(x, amplitude2, frequency2, phase2, waveType, time)
        ctx.lineTo(x, y)
      }

      ctx.strokeStyle = "#ef4444" // Red
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw resultant wave (sum of wave 1 and wave 2)
    if (showResultant && showWave1 && showWave2) {
      ctx.beginPath()
      ctx.moveTo(0, centerY)

      for (let x = 0; x <= width; x += dx) {
        const y1 = generateWavePoint(x, amplitude1, frequency1, phase1, waveType, time)
        const y2 = generateWavePoint(x, amplitude2, frequency2, phase2, waveType, time)
        const y = centerY - (y1 + y2)
        ctx.lineTo(x, y)
      }

      ctx.strokeStyle = "#8b5cf6" // Purple
      ctx.lineWidth = 3
      ctx.stroke()
    }

    // Draw phase animation
    if (showPhaseAnimation) {
      // Draw wave 1 source
      ctx.beginPath()
      ctx.arc(10, centerY, 10, 0, 2 * Math.PI)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()

      // Draw wave 2 source
      ctx.beginPath()
      ctx.arc(10, centerY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = "#ef4444"
      ctx.fill()

      // Draw animated phase indicator for wave 1
      const phaseIndicatorX1 = 10 + 15 * Math.cos(2 * Math.PI * frequency1 * time + phase1)
      const phaseIndicatorY1 = centerY + 15 * Math.sin(2 * Math.PI * frequency1 * time + phase1)

      ctx.beginPath()
      ctx.moveTo(10, centerY)
      ctx.lineTo(phaseIndicatorX1, phaseIndicatorY1)
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw animated phase indicator for wave 2
      const phaseIndicatorX2 = 10 + 15 * Math.cos(2 * Math.PI * frequency2 * time + phase2)
      const phaseIndicatorY2 = centerY + 15 * Math.sin(2 * Math.PI * frequency2 * time + phase2)

      ctx.beginPath()
      ctx.moveTo(10, centerY)
      ctx.lineTo(phaseIndicatorX2, phaseIndicatorY2)
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Add legend
    ctx.font = "12px Arial"
    ctx.textAlign = "left"

    if (showWave1) {
      ctx.fillStyle = "#3b82f6"
      ctx.fillText("Wave 1", width - 100, 20)
    }

    if (showWave2) {
      ctx.fillStyle = "#ef4444"
      ctx.fillText("Wave 2", width - 100, 40)
    }

    if (showResultant && showWave1 && showWave2) {
      ctx.fillStyle = "#8b5cf6"
      ctx.fillText("Resultant", width - 100, 60)
    }
  }, [
    time,
    amplitude1,
    frequency1,
    phase1,
    amplitude2,
    frequency2,
    phase2,
    showWave1,
    showWave2,
    showResultant,
    waveType,
    showPhaseAnimation,
  ])

  // Reset the simulation
  const resetSimulation = () => {
    setTime(0)
  }

  // Calculate interference type
  const getInterferenceType = () => {
    const phaseDifference = Math.abs((phase2 - phase1) % (2 * Math.PI))

    if (phaseDifference < 0.1 || phaseDifference > 2 * Math.PI - 0.1) {
      return "Constructive Interference"
    } else if (Math.abs(phaseDifference - Math.PI) < 0.1) {
      return "Destructive Interference"
    } else {
      return "Partial Interference"
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link href="/physics">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Physics Lab
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Wave Interference Simulation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle>Simulation</CardTitle>
              <CardDescription>Observe how waves interact and create interference patterns</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <canvas ref={canvasRef} width={600} height={400} className="border rounded-md bg-gray-50" />

              <div className="flex gap-4 mt-4">
                <Button onClick={() => setIsRunning(!isRunning)} className="bg-blue-500 hover:bg-blue-600">
                  {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button onClick={resetSimulation} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="mt-4 text-sm text-gray-500 w-full">
                <div className="p-2 bg-blue-50 rounded-md">
                  <span className="font-medium">Interference Type: </span>
                  <span>{getInterferenceType()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Wave Parameters</CardTitle>
              <CardDescription>Adjust these values to see how they affect wave interference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Wave Type</h3>
                <Select value={waveType} onValueChange={(value) => setWaveType(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select wave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sine">Sine Wave</SelectItem>
                    <SelectItem value="square">Square Wave</SelectItem>
                    <SelectItem value="sawtooth">Sawtooth Wave</SelectItem>
                    <SelectItem value="triangle">Triangle Wave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Wave 1 (Blue)</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showWave1">Show Wave 1</Label>
                  <Switch id="showWave1" checked={showWave1} onCheckedChange={setShowWave1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Amplitude</label>
                    <span className="text-sm text-gray-500">{amplitude1}</span>
                  </div>
                  <Slider
                    value={[amplitude1]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAmplitude1(value[0])}
                    disabled={!showWave1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Frequency</label>
                    <span className="text-sm text-gray-500">{frequency1.toFixed(2)} Hz</span>
                  </div>
                  <Slider
                    value={[frequency1 * 100]}
                    min={10}
                    max={200}
                    step={1}
                    onValueChange={(value) => setFrequency1(value[0] / 100)}
                    disabled={!showWave1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Phase</label>
                    <span className="text-sm text-gray-500">{((phase1 * 180) / Math.PI).toFixed(0)}°</span>
                  </div>
                  <Slider
                    value={[(phase1 * 180) / Math.PI]}
                    min={0}
                    max={360}
                    step={15}
                    onValueChange={(value) => setPhase1((value[0] * Math.PI) / 180)}
                    disabled={!showWave1}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Wave 2 (Red)</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showWave2">Show Wave 2</Label>
                  <Switch id="showWave2" checked={showWave2} onCheckedChange={setShowWave2} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Amplitude</label>
                    <span className="text-sm text-gray-500">{amplitude2}</span>
                  </div>
                  <Slider
                    value={[amplitude2]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAmplitude2(value[0])}
                    disabled={!showWave2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Frequency</label>
                    <span className="text-sm text-gray-500">{frequency2.toFixed(2)} Hz</span>
                  </div>
                  <Slider
                    value={[frequency2 * 100]}
                    min={10}
                    max={200}
                    step={1}
                    onValueChange={(value) => setFrequency2(value[0] / 100)}
                    disabled={!showWave2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Phase</label>
                    <span className="text-sm text-gray-500">{((phase2 * 180) / Math.PI).toFixed(0)}°</span>
                  </div>
                  <Slider
                    value={[(phase2 * 180) / Math.PI]}
                    min={0}
                    max={360}
                    step={15}
                    onValueChange={(value) => setPhase2((value[0] * Math.PI) / 180)}
                    disabled={!showWave2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Display Options</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showResultant">Show Resultant Wave</Label>
                  <Switch id="showResultant" checked={showResultant} onCheckedChange={setShowResultant} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showPhaseAnimation">Show Phase Animation</Label>
                  <Switch
                    id="showPhaseAnimation"
                    checked={showPhaseAnimation}
                    onCheckedChange={setShowPhaseAnimation}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium mb-2">Wave Interference Theory</h3>
                <p className="text-sm text-gray-700 mb-2">
                  When two waves overlap, they combine through superposition:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>
                    <strong>Constructive interference</strong> occurs when waves are in phase (0° or 360°), amplifying
                    each other
                  </li>
                  <li>
                    <strong>Destructive interference</strong> occurs when waves are out of phase (180°), canceling each
                    other
                  </li>
                  <li>
                    <strong>Partial interference</strong> occurs at other phase differences
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
