"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, RefreshCw, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

// Types
type ComponentType = "resistor" | "battery" | "bulb" | "capacitor" | "switch"
type CircuitComponent = {
  id: string
  type: ComponentType
  x: number
  y: number
  rotation: number
  value: number
  state?: boolean
  connections: string[]
}

export default function CircuitBuilderPage() {
  const { theme } = useTheme()
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link href="/student/simulations/phy">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Circuit Builder</h1>
      </div>

      <Tabs defaultValue="theory" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="theory">Theory</TabsTrigger>
          <TabsTrigger value="procedure">Procedure</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="theory">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Circuit Theory</CardTitle>
              <CardDescription>Fundamentals of electric circuits</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-2">Basic Concepts</h3>
              <p className="mb-4">
                An electric circuit is a path through which electric current flows. It consists of various components 
                connected by conductive wires that allow electrons to move through them.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border p-4 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Voltage (V)</h4>
                  <p className="text-sm text-muted-foreground">Electrical potential difference (measured in Volts)</p>
                </div>
                <div className="border p-4 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Current (I)</h4>
                  <p className="text-sm text-muted-foreground">Flow of electric charge (measured in Amperes)</p>
                </div>
                <div className="border p-4 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Resistance (R)</h4>
                  <p className="text-sm text-muted-foreground">Opposition to current flow (measured in Ohms)</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">Ohm's Law</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-6">
                <p className="text-center font-mono text-lg">V = I × R</p>
                <p className="text-center text-sm mt-2">Voltage = Current × Resistance</p>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">Circuit Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border p-3 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Resistor</h4>
                  <p className="text-sm text-muted-foreground">Limits current flow, converts electrical energy to heat</p>
                </div>
                <div className="border p-3 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Battery</h4>
                  <p className="text-sm text-muted-foreground">Provides voltage through chemical reactions</p>
                </div>
                <div className="border p-3 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Bulb</h4>
                  <p className="text-sm text-muted-foreground">Converts electrical energy to light when current flows</p>
                </div>
                <div className="border p-3 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Capacitor</h4>
                  <p className="text-sm text-muted-foreground">Stores electrical charge and energy</p>
                </div>
                <div className="border p-3 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Switch</h4>
                  <p className="text-sm text-muted-foreground">Controls current flow by opening/closing the circuit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedure">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Experiment Procedure</CardTitle>
              <CardDescription>How to build and analyze circuits</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-2">Building Circuits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border p-4 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Adding Components</h4>
                  <ol className="list-decimal pl-5 text-sm space-y-1 text-muted-foreground">
                    <li>Select component type from tabs</li>
                    <li>Click "Add Component" button</li>
                    <li>Drag components to position them</li>
                    <li>Use "Rotate" to change orientation</li>
                  </ol>
                </div>
                <div className="border p-4 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Making Connections</h4>
                  <ol className="list-decimal pl-5 text-sm space-y-1 text-muted-foreground">
                    <li>Select a component</li>
                    <li>Click "Connect" button</li>
                    <li>Click on another component to connect them</li>
                    <li>Repeat to create complete circuits</li>
                  </ol>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">Experiments to Try</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border p-3 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Series Circuit</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    <li>Battery → Switch → Resistor → Bulb → Battery</li>
                    <li>Measure current with different resistor values</li>
                    <li>Observe bulb brightness changes</li>
                  </ul>
                </div>
                <div className="border p-3 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="font-medium">Parallel Circuit</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    <li>Connect two bulbs in parallel with a battery</li>
                    <li>Compare brightness to series connection</li>
                    <li>Add switches to control bulbs independently</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <CircuitSimulation />
        </TabsContent>

        <TabsContent value="assessment">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Assessment Questions</CardTitle>
              <CardDescription>Test your understanding of circuits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {assessmentQuestions.map((q, i) => (
                  <div key={i} className="border p-4 rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                    <h4 className="font-medium mb-2">{q.question}</h4>
                    <div className="space-y-2">
                      {q.options.map((opt, j) => (
                        <div key={j} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`q${i}-opt${j}`}
                            name={`question-${i}`}
                            value={j}
                            className="h-4 w-4 text-primary"
                          />
                          <label htmlFor={`q${i}-opt${j}`} className="text-sm text-muted-foreground">
                            {opt}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm hidden answer-feedback">
                      <strong className="text-foreground">Answer:</strong> <span className="text-muted-foreground">{q.options[q.answer]}</span><br />
                      <strong className="text-foreground">Explanation:</strong> <span className="text-muted-foreground">{q.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Simulation Component
function CircuitSimulation() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [components, setComponents] = useState<CircuitComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType>("resistor")
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [currentValues, setCurrentValues] = useState<{ [key: string]: number }>({})
  const [circuitClosed, setCircuitClosed] = useState(false)

  const componentProps = {
    resistor: { width: 60, height: 20, label: "Resistor", defaultValue: 100 },
    battery: { width: 40, height: 60, label: "Battery", defaultValue: 9 },
    bulb: { width: 30, height: 30, label: "Bulb", defaultValue: 0 },
    capacitor: { width: 40, height: 20, label: "Capacitor", defaultValue: 100 },
    switch: { width: 50, height: 20, label: "Switch", defaultValue: 0 },
  }

  const addComponent = () => {
    const newComponent: CircuitComponent = {
      id: `component-${Date.now()}`,
      type: selectedComponentType,
      x: 250,
      y: 200,
      rotation: 0,
      value: componentProps[selectedComponentType].defaultValue,
      connections: [],
      state: selectedComponentType === "switch" ? false : undefined,
    }
    setComponents([...components, newComponent])
    setSelectedComponent(newComponent.id)
  }

  const removeComponent = () => {
    if (!selectedComponent) return

    const updatedComponents = components.map((comp) => {
      if (comp.connections.includes(selectedComponent)) {
        return {
          ...comp,
          connections: comp.connections.filter((id) => id !== selectedComponent),
        }
      }
      return comp
    })

    setComponents(updatedComponents.filter((comp) => comp.id !== selectedComponent))
    setSelectedComponent(null)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let clickedComponent = null
    for (const component of components) {
      const { width, height } = componentProps[component.type]
      const halfWidth = width / 2
      const halfHeight = height / 2

      if (
        x >= component.x - halfWidth &&
        x <= component.x + halfWidth &&
        y >= component.y - halfHeight &&
        y <= component.y + halfHeight
      ) {
        clickedComponent = component.id
        break
      }
    }

    if (clickedComponent) {
      if (isConnecting && connectingFrom && connectingFrom !== clickedComponent) {
        setComponents(
          components.map((comp) => {
            if (comp.id === connectingFrom) {
              return {
                ...comp,
                connections: [...comp.connections, clickedComponent],
              }
            }
            if (comp.id === clickedComponent) {
              return {
                ...comp,
                connections: [...comp.connections, connectingFrom],
              }
            }
            return comp
          }),
        )
        setIsConnecting(false)
        setConnectingFrom(null)
      } else {
        setSelectedComponent(clickedComponent)
        setIsDragging(true)
        setDragStart({ x, y })
      }
    } else {
      setSelectedComponent(null)
      setIsConnecting(false)
      setConnectingFrom(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedComponent) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setComponents(
      components.map((comp) => {
        if (comp.id === selectedComponent) {
          return {
            ...comp,
            x: comp.x + (x - dragStart.x),
            y: comp.y + (y - dragStart.y),
          }
        }
        return comp
      }),
    )

    setDragStart({ x, y })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const startConnecting = () => {
    if (!selectedComponent) return
    setIsConnecting(true)
    setConnectingFrom(selectedComponent)
  }

  const toggleSwitch = () => {
    if (!selectedComponent) return

    setComponents(
      components.map((comp) => {
        if (comp.id === selectedComponent && comp.type === "switch") {
          return {
            ...comp,
            state: !comp.state,
          }
        }
        return comp
      }),
    )
  }

  const rotateComponent = () => {
    if (!selectedComponent) return

    setComponents(
      components.map((comp) => {
        if (comp.id === selectedComponent) {
          return {
            ...comp,
            rotation: (comp.rotation + 90) % 360,
          }
        }
        return comp
      }),
    )
  }

  const updateComponentValue = (value: number) => {
    if (!selectedComponent) return

    setComponents(
      components.map((comp) => {
        if (comp.id === selectedComponent) {
          return {
            ...comp,
            value,
          }
        }
        return comp
      }),
    )
  }

  useEffect(() => {
    const hasBattery = components.some((comp) => comp.type === "battery")
    const hasOpenSwitch = components.some((comp) => comp.type === "switch" && comp.state === false)
    const isClosed = hasBattery && !hasOpenSwitch && components.length > 1

    setCircuitClosed(isClosed)

    if (isClosed) {
      const totalResistance = components.reduce((sum, comp) => {
        if (comp.type === "resistor") {
          return sum + comp.value
        }
        return sum
      }, 0)

      const batteryVoltage = components.find((comp) => comp.type === "battery")?.value || 0
      const current = totalResistance > 0 ? batteryVoltage / totalResistance : 0

      const values: { [key: string]: number } = {}
      components.forEach((comp) => {
        if (comp.type === "resistor") {
          values[comp.id] = current * comp.value
        } else if (comp.type === "bulb") {
          values[comp.id] = current
        } else if (comp.type === "battery") {
          values[comp.id] = comp.value
        } else if (comp.type === "capacitor") {
          values[comp.id] = batteryVoltage * (1 - Math.exp(-Date.now() / (comp.value * 1000)))
        }
      })

      setCurrentValues(values)
    } else {
      setCurrentValues({})
    }
  }, [components])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background based on theme
    ctx.fillStyle = theme === 'dark' ? '#1a1a1a' : '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    components.forEach((comp) => {
      comp.connections.forEach((connId) => {
        const connComp = components.find((c) => c.id === connId)
        if (connComp) {
          ctx.beginPath()
          ctx.moveTo(comp.x, comp.y)
          ctx.lineTo(connComp.x, connComp.y)
          ctx.strokeStyle = circuitClosed ? "#4caf50" : theme === 'dark' ? "#666" : "#999"
          ctx.lineWidth = 2
          ctx.stroke()

          if (circuitClosed) {
            const dx = connComp.x - comp.x
            const dy = connComp.y - comp.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const normalizedDx = dx / distance
            const normalizedDy = dy / distance

            const totalResistance = components.filter((c) => c.type === "resistor").reduce((sum, c) => sum + c.value, 0)
            const batteryVoltage = components.find((c) => c.type === "battery")?.value || 0
            const current = totalResistance > 0 ? batteryVoltage / totalResistance : 0

            const dotCount = Math.floor(distance / 15)
            const dotSpacing = distance / dotCount
            const animationOffset = (Date.now() / (300 - Math.min(current * 50, 250))) % dotSpacing

            ctx.fillStyle = "#4caf50"

            for (let i = 0; i < dotCount; i++) {
              const dotPosition = i * dotSpacing + animationOffset
              if (dotPosition < distance) {
                const dotX = comp.x + normalizedDx * dotPosition
                const dotY = comp.y + normalizedDy * dotPosition

                ctx.beginPath()
                ctx.arc(dotX, dotY, 3, 0, Math.PI * 2)
                ctx.fill()
              }
            }
          }
        }
      })
    })

    components.forEach((comp) => {
      ctx.save()
      ctx.translate(comp.x, comp.y)
      ctx.rotate((comp.rotation * Math.PI) / 180)

      const { width, height } = componentProps[comp.type]
      const halfWidth = width / 2
      const halfHeight = height / 2

      if (comp.id === selectedComponent) {
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 3
        ctx.strokeRect(-halfWidth - 5, -halfHeight - 5, width + 10, height + 10)
      }

      switch (comp.type) {
        case "resistor":
          ctx.beginPath()
          ctx.moveTo(-halfWidth, 0)

          const segments = 7
          const segmentWidth = width / segments
          for (let i = 0; i <= segments; i++) {
            const x = -halfWidth + i * segmentWidth
            const y = i % 2 === 0 ? -8 : 8
            ctx.lineTo(x, y)
          }

          ctx.lineTo(halfWidth, 0)
          ctx.strokeStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.fillStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`${comp.value}Ω`, 0, -15)
          break

        case "battery":
          ctx.beginPath()
          ctx.moveTo(-10, -15)
          ctx.lineTo(-10, 15)
          ctx.moveTo(10, -10)
          ctx.lineTo(10, 10)
          ctx.strokeStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(-halfWidth, 0)
          ctx.lineTo(-10, 0)
          ctx.moveTo(10, 0)
          ctx.lineTo(halfWidth, 0)
          ctx.stroke()

          ctx.fillStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`${comp.value}V`, 0, -25)
          ctx.font = "12px Arial"
          ctx.fillText("+", -10, -20)
          ctx.fillText("-", 10, -20)
          break

        case "bulb":
          ctx.beginPath()
          ctx.arc(0, 0, 15, 0, Math.PI * 2)
          ctx.strokeStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(-10, -10)
          ctx.lineTo(10, 10)
          ctx.moveTo(10, -10)
          ctx.lineTo(-10, 10)
          ctx.stroke()

          const brightness = currentValues[comp.id] || 0
          if (circuitClosed && brightness > 0) {
            const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, 30)
            gradient.addColorStop(0, `rgba(255, 255, 0, ${Math.min(brightness / 3, 0.9)})`)
            gradient.addColorStop(1, "rgba(255, 255, 0, 0)")

            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(0, 0, 30, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.fillStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          if (circuitClosed) {
            ctx.fillText(`${(brightness * 100).toFixed(0)}%`, 0, -20)
          } else {
            ctx.fillText("OFF", 0, -20)
          }
          break

        case "capacitor":
          ctx.beginPath()
          ctx.moveTo(-5, -15)
          ctx.lineTo(-5, 15)
          ctx.moveTo(5, -15)
          ctx.lineTo(5, 15)
          ctx.moveTo(-halfWidth, 0)
          ctx.lineTo(-5, 0)
          ctx.moveTo(5, 0)
          ctx.lineTo(halfWidth, 0)
          ctx.strokeStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.fillStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`${comp.value}μF`, 0, -20)
          break

        case "switch":
          ctx.beginPath()
          ctx.moveTo(-halfWidth, 0)
          ctx.lineTo(-10, 0)
          ctx.moveTo(10, 0)
          ctx.lineTo(halfWidth, 0)
          if (comp.state) {
            ctx.moveTo(-10, 0)
            ctx.lineTo(10, 0)
          } else {
            ctx.moveTo(-10, 0)
            ctx.lineTo(8, -10)
          }
          ctx.moveTo(-10, 0)
          ctx.arc(-10, 0, 3, 0, Math.PI * 2)
          ctx.strokeStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.fillStyle = theme === 'dark' ? "#eee" : "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(comp.state ? "CLOSED" : "OPEN", 0, -20)
          break
      }

      ctx.restore()
    })

    if (isConnecting && connectingFrom) {
      const fromComp = components.find((comp) => comp.id === connectingFrom)
      if (fromComp) {
        ctx.beginPath()
        ctx.moveTo(fromComp.x, fromComp.y)
        ctx.lineTo(dragStart.x, dragStart.y)
        ctx.strokeStyle = "#3b82f6"
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }, [components, selectedComponent, isConnecting, connectingFrom, dragStart, currentValues, circuitClosed, theme])

  const getSelectedComponentDetails = () => {
    if (!selectedComponent) return null
    return components.find((comp) => comp.id === selectedComponent)
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Circuit Simulation</CardTitle>
        <CardDescription>Build and test electrical circuits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="border rounded-md dark:border-gray-700"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />

              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <Button onClick={addComponent} className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add {componentProps[selectedComponentType].label}
                </Button>
                <Button onClick={removeComponent} variant="outline" disabled={!selectedComponent}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
                <Button onClick={startConnecting} variant="outline" disabled={!selectedComponent}>
                  Connect
                </Button>
                <Button onClick={rotateComponent} variant="outline" disabled={!selectedComponent}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rotate
                </Button>
                {getSelectedComponentDetails()?.type === "switch" && (
                  <Button onClick={toggleSwitch} variant="outline">
                    Toggle Switch
                  </Button>
                )}
              </div>

              <div className="mt-4 text-sm">
                {circuitClosed ? (
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md">
                    Circuit is complete and current is flowing
                  </div>
                ) : (
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                    Circuit is incomplete. Connect components to complete the circuit.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-6">
              <div>
                <Tabs
                  defaultValue="resistor"
                  className="w-full"
                  onValueChange={(value) => setSelectedComponentType(value as ComponentType)}
                >
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="resistor">R</TabsTrigger>
                    <TabsTrigger value="battery">B</TabsTrigger>
                    <TabsTrigger value="bulb">L</TabsTrigger>
                    <TabsTrigger value="capacitor">C</TabsTrigger>
                    <TabsTrigger value="switch">S</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="p-4 border rounded-md dark:border-gray-700 dark:bg-gray-800/50">
                <h3 className="font-medium mb-2">{componentProps[selectedComponentType].label}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedComponentType === "resistor" && "Restricts the flow of current in a circuit."}
                  {selectedComponentType === "battery" && "Provides voltage to power the circuit."}
                  {selectedComponentType === "bulb" && "Lights up when current flows through it."}
                  {selectedComponentType === "capacitor" && "Stores and releases electrical energy."}
                  {selectedComponentType === "switch" && "Controls whether current can flow in the circuit."}
                </p>

                {selectedComponent && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Selected Component Properties</h4>
                    {getSelectedComponentDetails()?.type === "resistor" && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm text-muted-foreground">Resistance</label>
                          <span className="text-sm text-muted-foreground">{getSelectedComponentDetails()?.value || 0} Ω</span>
                        </div>
                        <Slider
                          value={[getSelectedComponentDetails()?.value || 0]}
                          min={10}
                          max={1000}
                          step={10}
                          onValueChange={(value) => updateComponentValue(value[0])}
                        />
                      </div>
                    )}

                    {getSelectedComponentDetails()?.type === "battery" && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm text-muted-foreground">Voltage</label>
                          <span className="text-sm text-muted-foreground">{getSelectedComponentDetails()?.value || 0} V</span>
                        </div>
                        <Slider
                          value={[getSelectedComponentDetails()?.value || 0]}
                          min={1.5}
                          max={24}
                          step={1.5}
                          onValueChange={(value) => updateComponentValue(value[0])}
                        />
                      </div>
                    )}

                    {getSelectedComponentDetails()?.type === "capacitor" && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm text-muted-foreground">Capacitance</label>
                          <span className="text-sm text-muted-foreground">{getSelectedComponentDetails()?.value || 0} μF</span>
                        </div>
                        <Slider
                          value={[getSelectedComponentDetails()?.value || 0]}
                          min={10}
                          max={1000}
                          step={10}
                          onValueChange={(value) => updateComponentValue(value[0])}
                        />
                      </div>
                    )}

                    {getSelectedComponentDetails()?.type === "switch" && (
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-muted-foreground">State</label>
                        <span className="text-sm font-medium">
                          {getSelectedComponentDetails()?.state ? "CLOSED (ON)" : "OPEN (OFF)"}
                        </span>
                      </div>
                    )}

                    {getSelectedComponentDetails()?.type === "bulb" && circuitClosed && (
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-muted-foreground">Brightness</label>
                        <span className="text-sm font-medium">
                          {((currentValues[selectedComponent] || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <h3 className="font-medium mb-2">Circuit Analysis</h3>
                {circuitClosed ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Resistance:</span>
                      <span className="font-mono">
                        {components
                          .filter((c) => c.type === "resistor")
                          .reduce((sum, c) => sum + c.value, 0)
                          .toFixed(1)}{" "}
                        Ω
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Voltage:</span>
                      <span className="font-mono">
                        {components.find((c) => c.type === "battery")?.value.toFixed(1) || 0} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-mono">
                        {(
                          (components.find((c) => c.type === "battery")?.value || 0) /
                          Math.max(
                            components.filter((c) => c.type === "resistor").reduce((sum, c) => sum + c.value, 0),
                            0.001,
                          )
                        ).toFixed(3)}{" "}
                        A
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Complete the circuit to see voltage, current, and resistance calculations.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Assessment Questions
const assessmentQuestions = [
  {
    question: "What happens to total resistance when resistors are added in series?",
    options: [
      "Increases",
      "Decreases",
      "Stays the same",
      "Depends on the voltage"
    ],
    answer: 0,
    explanation: "In series circuits, total resistance is the sum of individual resistances, so it increases with each added resistor."
  },
  {
    question: "Which component provides the electromotive force (voltage) in a circuit?",
    options: [
      "Resistor",
      "Capacitor",
      "Battery",
      "Switch"
    ],
    answer: 2,
    explanation: "The battery provides the voltage that drives current through the circuit."
  },
  {
    question: "According to Ohm's Law, if voltage increases while resistance stays constant:",
    options: [
      "Current decreases",
      "Current increases",
      "Current stays the same",
      "Resistance changes"
    ],
    answer: 1,
    explanation: "Ohm's Law (V=IR) shows current is directly proportional to voltage when resistance is constant."
  },
  {
    question: "What is the unit of electrical resistance?",
    options: [
      "Volt",
      "Ampere",
      "Ohm",
      "Watt"
    ],
    answer: 2,
    explanation: "Resistance is measured in Ohms (Ω)."
  },
  {
    question: "In a parallel circuit with two bulbs, if one bulb burns out:",
    options: [
      "Both bulbs go out",
      "The other bulb gets brighter",
      "The other bulb stays lit",
      "The circuit current stops"
    ],
    answer: 2,
    explanation: "In parallel circuits, components operate independently, so the other bulb remains lit."
  },
  {
    question: "What is the primary function of a switch in a circuit?",
    options: [
      "Increase current",
      "Store energy",
      "Control current flow",
      "Measure voltage"
    ],
    answer: 2,
    explanation: "Switches control current flow by opening or closing the circuit."
  },
  {
    question: "Which of these is necessary for current to flow in a circuit?",
    options: [
      "A complete closed loop",
      "High resistance",
      "Multiple batteries",
      "At least three components"
    ],
    answer: 0,
    explanation: "Current requires a complete closed path (circuit) to flow continuously."
  },
  {
    question: "What happens to bulb brightness in a series circuit when more bulbs are added?",
    options: [
      "Increases",
      "Decreases",
      "Stays the same",
      "Flickers intermittently"
    ],
    answer: 1,
    explanation: "Adding bulbs in series increases total resistance, reducing current and making each bulb dimmer."
  },
  {
    question: "What does a capacitor store in an electric circuit?",
    options: [
      "Current",
      "Resistance",
      "Electrical energy",
      "Light energy"
    ],
    answer: 2,
    explanation: "Capacitors store electrical energy in an electric field between their plates."
  },
  {
    question: "If you double the voltage in a circuit while keeping resistance constant, what happens to the current?",
    options: [
      "Halves",
      "Doubles",
      "Quadruples",
      "Stays the same"
    ],
    answer: 1,
    explanation: "According to Ohm's Law (I=V/R), current is directly proportional to voltage when resistance is constant."
  }
]