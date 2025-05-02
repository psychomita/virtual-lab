"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RefreshCw, Plus, Trash2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Circuit component types
type ComponentType = "resistor" | "battery" | "bulb" | "capacitor" | "switch"
type CircuitComponent = {
  id: string
  type: ComponentType
  x: number
  y: number
  rotation: number
  value: number
  state?: boolean // for switches
  connections: string[] // ids of connected components
}

export default function CircuitBuilderSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [components, setComponents] = useState<CircuitComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType>("resistor")
  const [voltage, setVoltage] = useState(9)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [currentValues, setCurrentValues] = useState<{ [key: string]: number }>({})
  const [circuitClosed, setCircuitClosed] = useState(false)

  // Component properties
  const componentProps = {
    resistor: { width: 60, height: 20, label: "Resistor", defaultValue: 100 },
    battery: { width: 40, height: 60, label: "Battery", defaultValue: 9 },
    bulb: { width: 30, height: 30, label: "Bulb", defaultValue: 0 },
    capacitor: { width: 40, height: 20, label: "Capacitor", defaultValue: 100 },
    switch: { width: 50, height: 20, label: "Switch", defaultValue: 0 },
  }

  // Add a new component
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

  // Remove a component
  const removeComponent = () => {
    if (!selectedComponent) return

    // Remove connections to this component
    const updatedComponents = components.map((comp) => {
      if (comp.connections.includes(selectedComponent)) {
        return {
          ...comp,
          connections: comp.connections.filter((id) => id !== selectedComponent),
        }
      }
      return comp
    })

    // Remove the component itself
    setComponents(updatedComponents.filter((comp) => comp.id !== selectedComponent))
    setSelectedComponent(null)
  }

  // Handle canvas mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on a component
    let clickedComponent = null
    for (const component of components) {
      const { width, height } = componentProps[component.type]
      const halfWidth = width / 2
      const halfHeight = height / 2

      // Check if click is within component bounds
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
      // If in connecting mode, create a connection
      if (isConnecting && connectingFrom && connectingFrom !== clickedComponent) {
        // Add connection between components
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
        // Start dragging or connecting
        setSelectedComponent(clickedComponent)
        setIsDragging(true)
        setDragStart({ x, y })
      }
    } else {
      // Clicked on empty space
      setSelectedComponent(null)
      setIsConnecting(false)
      setConnectingFrom(null)
    }
  }

  // Handle canvas mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedComponent) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Move the component
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

  // Handle canvas mouse up
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Start connecting components
  const startConnecting = () => {
    if (!selectedComponent) return
    setIsConnecting(true)
    setConnectingFrom(selectedComponent)
  }

  // Toggle switch state
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

  // Rotate component
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

  // Update component value
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

  // Calculate circuit values
  useEffect(() => {
    // Simple circuit analysis for demonstration
    // In a real simulation, we would use more complex circuit analysis algorithms

    // Check if circuit is closed
    const hasBattery = components.some((comp) => comp.type === "battery")
    const hasOpenSwitch = components.some((comp) => comp.type === "switch" && comp.state === false)
    const isClosed = hasBattery && !hasOpenSwitch && components.length > 1

    setCircuitClosed(isClosed)

    if (isClosed) {
      // Calculate total resistance (simplified series circuit)
      const totalResistance = components.reduce((sum, comp) => {
        if (comp.type === "resistor") {
          return sum + comp.value
        }
        return sum
      }, 0)

      // Find battery voltage
      const batteryVoltage = components.find((comp) => comp.type === "battery")?.value || 0

      // Calculate current (I = V/R)
      const current = totalResistance > 0 ? batteryVoltage / totalResistance : 0

      // Calculate values for each component
      const values: { [key: string]: number } = {}
      components.forEach((comp) => {
        if (comp.type === "resistor") {
          // Voltage across resistor (V = IR)
          values[comp.id] = current * comp.value
        } else if (comp.type === "bulb") {
          // Brightness proportional to current
          values[comp.id] = current
        } else if (comp.type === "battery") {
          values[comp.id] = comp.value
        } else if (comp.type === "capacitor") {
          // Simplified capacitor behavior
          values[comp.id] = batteryVoltage * (1 - Math.exp(-Date.now() / (comp.value * 1000)))
        }
      })

      setCurrentValues(values)
    } else {
      // Reset values if circuit is open
      setCurrentValues({})
    }
  }, [components])

  // Draw the circuit
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    ctx.strokeStyle = circuitClosed ? "#4caf50" : "#666"
    ctx.lineWidth = 2

    components.forEach((comp) => {
      comp.connections.forEach((connId) => {
        const connComp = components.find((c) => c.id === connId)
        if (connComp) {
          ctx.beginPath()
          ctx.moveTo(comp.x, comp.y)
          ctx.lineTo(connComp.x, connComp.y)
          ctx.stroke()
        }
      })
    })

    // Draw components
    components.forEach((comp) => {
      ctx.save()
      ctx.translate(comp.x, comp.y)
      ctx.rotate((comp.rotation * Math.PI) / 180)

      const { width, height } = componentProps[comp.type]
      const halfWidth = width / 2
      const halfHeight = height / 2

      // Highlight selected component
      if (comp.id === selectedComponent) {
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 3
        ctx.strokeRect(-halfWidth - 5, -halfHeight - 5, width + 10, height + 10)
      }

      // Draw component based on type
      switch (comp.type) {
        case "resistor":
          ctx.strokeStyle = "#333"
          ctx.lineWidth = 2
          ctx.strokeRect(-halfWidth, -halfHeight, width, height)
          ctx.fillStyle = "#f5f5f5"
          ctx.fillRect(-halfWidth, -halfHeight, width, height)

          // Draw zigzag line
          ctx.beginPath()
          ctx.moveTo(-halfWidth, 0)
          for (let i = 0; i < 6; i++) {
            const x = -halfWidth + (i * width) / 6
            const y = i % 2 === 0 ? -5 : 5
            ctx.lineTo(x, y)
          }
          ctx.lineTo(halfWidth, 0)
          ctx.stroke()

          // Draw value
          ctx.fillStyle = "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`${comp.value}Ω`, 0, -halfHeight - 5)
          break

        case "battery":
          ctx.strokeStyle = "#333"
          ctx.lineWidth = 2
          ctx.strokeRect(-halfWidth, -halfHeight, width, height)
          ctx.fillStyle = "#ffeb3b"
          ctx.fillRect(-halfWidth, -halfHeight, width, height)

          // Draw battery symbol
          ctx.beginPath()
          ctx.moveTo(-halfWidth / 2, -10)
          ctx.lineTo(halfWidth / 2, -10)
          ctx.moveTo(0, -15)
          ctx.lineTo(0, -5)
          ctx.moveTo(-halfWidth / 2, 10)
          ctx.lineTo(halfWidth / 2, 10)
          ctx.stroke()

          // Draw value
          ctx.fillStyle = "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`${comp.value}V`, 0, -halfHeight - 5)
          break

        case "bulb":
          ctx.strokeStyle = "#333"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(0, 0, halfWidth, 0, Math.PI * 2)
          ctx.stroke()

          // Fill with color based on current
          const brightness = currentValues[comp.id] || 0
          const glowColor = `rgba(255, 255, 0, ${Math.min(brightness / 5, 0.8)})` // Max brightness at 5A
          ctx.fillStyle = circuitClosed ? glowColor : "#f5f5f5"
          ctx.fill()

          // Draw filament
          ctx.beginPath()
          ctx.moveTo(-5, 5)
          ctx.quadraticCurveTo(0, -10, 5, 5)
          ctx.stroke()
          break

        case "capacitor":
          ctx.strokeStyle = "#333"
          ctx.lineWidth = 2
          ctx.strokeRect(-halfWidth, -halfHeight, width, height)
          ctx.fillStyle = "#e1f5fe"
          ctx.fillRect(-halfWidth, -halfHeight, width, height)

          // Draw capacitor plates
          ctx.beginPath()
          ctx.moveTo(-5, -10)
          ctx.lineTo(-5, 10)
          ctx.moveTo(5, -10)
          ctx.lineTo(5, 10)
          ctx.stroke()

          // Draw value
          ctx.fillStyle = "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`${comp.value}μF`, 0, -halfHeight - 5)
          break

        case "switch":
          ctx.strokeStyle = "#333"
          ctx.lineWidth = 2
          ctx.strokeRect(-halfWidth, -halfHeight, width, height)
          ctx.fillStyle = "#f5f5f5"
          ctx.fillRect(-halfWidth, -halfHeight, width, height)

          // Draw switch
          ctx.beginPath()
          ctx.moveTo(-halfWidth + 5, 0)
          if (comp.state) {
            // Closed switch
            ctx.lineTo(halfWidth - 5, 0)
          } else {
            // Open switch
            ctx.lineTo(0, -10)
            ctx.lineTo(halfWidth - 5, 0)
          }
          ctx.stroke()

          // Draw state
          ctx.fillStyle = "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(comp.state ? "ON" : "OFF", 0, -halfHeight - 5)
          break
      }

      ctx.restore()
    })

    // Draw connecting line if in connecting mode
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
  }, [components, selectedComponent, isConnecting, connectingFrom, dragStart, currentValues, circuitClosed])

  // Get selected component
  const getSelectedComponentDetails = () => {
    if (!selectedComponent) return null
    return components.find((comp) => comp.id === selectedComponent)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link href="/physics">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Physics Lab
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Circuit Builder Simulation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle>Circuit Workspace</CardTitle>
              <CardDescription>Build and test electrical circuits by adding components and connections</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="border rounded-md bg-gray-50"
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

              <div className="mt-4 text-sm text-gray-500">
                {circuitClosed ? (
                  <div className="p-2 bg-green-100 rounded-md">Circuit is complete and current is flowing</div>
                ) : (
                  <div className="p-2 bg-yellow-100 rounded-md">
                    Circuit is incomplete. Connect components to complete the circuit.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Components</CardTitle>
              <CardDescription>Select and configure circuit components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">{componentProps[selectedComponentType].label}</h3>
                <p className="text-sm text-gray-500 mb-4">
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
                          <label className="text-sm">Resistance</label>
                          <span className="text-sm text-gray-500">{getSelectedComponentDetails()?.value || 0} Ω</span>
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
                          <label className="text-sm">Voltage</label>
                          <span className="text-sm text-gray-500">{getSelectedComponentDetails()?.value || 0} V</span>
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
                          <label className="text-sm">Capacitance</label>
                          <span className="text-sm text-gray-500">{getSelectedComponentDetails()?.value || 0} μF</span>
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
                        <label className="text-sm">State</label>
                        <span className="text-sm font-medium">
                          {getSelectedComponentDetails()?.state ? "CLOSED (ON)" : "OPEN (OFF)"}
                        </span>
                      </div>
                    )}

                    {getSelectedComponentDetails()?.type === "bulb" && circuitClosed && (
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Brightness</label>
                        <span className="text-sm font-medium">
                          {((currentValues[selectedComponent] || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium mb-2">Circuit Analysis</h3>
                {circuitClosed ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Resistance:</span>
                      <span className="font-mono">
                        {components
                          .filter((c) => c.type === "resistor")
                          .reduce((sum, c) => sum + c.value, 0)
                          .toFixed(1)}{" "}
                        Ω
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voltage:</span>
                      <span className="font-mono">
                        {components.find((c) => c.type === "battery")?.value.toFixed(1) || 0} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current:</span>
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
                  <p className="text-sm text-gray-700">
                    Complete the circuit to see voltage, current, and resistance calculations.
                  </p>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium mb-2">Instructions</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                  <li>Select a component type from the tabs above</li>
                  <li>Click "Add" to place it on the workspace</li>
                  <li>Drag components to position them</li>
                  <li>Select a component and click "Connect" to create connections</li>
                  <li>Use "Rotate" to change component orientation</li>
                  <li>Toggle switches to open or close the circuit</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
