"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ZoomIn, RotateCw, RefreshCw, ChevronRight, Lightbulb, Eye, FileText, BarChart } from "lucide-react"
import { useTheme } from "next-themes"

const SAMPLE_TYPES = [
  { id: "blood", name: "Blood Cells", description: "Erythrocytes and leukocytes in a peripheral blood smear" },
  { id: "plant", name: "Plant Cells", description: "Elodea leaf cells with visible chloroplasts and cell walls" },
  {
    id: "bacteria",
    name: "Bacteria",
    description: "Mixed bacterial culture with gram-positive and gram-negative species",
  },
  { id: "protozoa", name: "Protozoa", description: "Paramecium and other ciliated protozoans" },
  { id: "histology", name: "Tissue Section", description: "Cross-section of mammalian small intestine" },
]

const MAGNIFICATION_LEVELS = [40, 100, 400, 1000]

interface CellDetail {
  type: string;
  x?: number;
  y?: number;
  size?: number;
  angle?: number;
  length?: number;
}

interface Cell {
  x: number;
  y: number;
  size: number;
  color: string;
  type: string;
  details?: CellDetail[];
}

export default function MicroscopePage() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [magnification, setMagnification] = useState(40)
  const [brightness, setBrightness] = useState(50)
  const [focus, setFocus] = useState(50)
  const [sampleType, setSampleType] = useState("blood")
  const [rotation, setRotation] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const [observations, setObservations] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("simulation")
  const [isLoading, setIsLoading] = useState(true)
  const [cellsVisible, setCellsVisible] = useState<Cell[]>([])

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      generateSampleView()
      setIsLoading(false)
    }, 1000)
  }, [sampleType, magnification, brightness, focus, rotation, theme])

  const generateSampleView = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const isDark = theme === "dark"
    const bgColor = isDark ? "rgba(10, 10, 30, 0.9)" : "rgba(240, 240, 255, 0.9)"
    ctx.fillStyle = bgColor
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2)
    ctx.fill()

    const brightnessOverlay = `rgba(255, 255, 255, ${(brightness / 100) * 0.5})`
    ctx.fillStyle = brightnessOverlay
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    const focusFactor = Math.abs(50 - focus) / 50
    const newCells: Cell[] = []
    const baseCount = 20
    const cellCount = Math.floor(baseCount * (100 / magnification))
    const sizeFactor = magnification / 40

    for (let i = 0; i < cellCount; i++) {
      const cell: Cell = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0,
        color: "",
        type: "",
        details: [],
      }

      switch (sampleType) {
        case "blood":
          if (Math.random() < 0.95) {
            cell.size = 7 * sizeFactor
            cell.color = `rgba(220, 20, 60, ${0.8 - focusFactor * 0.5})`
            cell.type = "rbc"
          } else if (Math.random() < 0.8) {
            cell.size = 12 * sizeFactor
            cell.color = `rgba(240, 240, 240, ${0.8 - focusFactor * 0.5})`
            cell.type = "neutrophil"
          } else if (Math.random() < 0.5) {
            cell.size = 10 * sizeFactor
            cell.color = `rgba(220, 220, 255, ${0.8 - focusFactor * 0.5})`
            cell.type = "lymphocyte"
          } else {
            cell.size = 15 * sizeFactor
            cell.color = `rgba(200, 200, 230, ${0.8 - focusFactor * 0.5})`
            cell.type = "monocyte"
          }
          break

        case "plant":
          cell.size = 20 * sizeFactor
          cell.color = `rgba(220, 255, 220, ${0.6 - focusFactor * 0.5})`
          cell.type = "plant"
          const chloroplastCount = Math.floor(3 + Math.random() * 8)
          for (let j = 0; j < chloroplastCount; j++) {
            cell.details?.push({
              type: "chloroplast",
              x: Math.random() * 0.7 * cell.size,
              y: Math.random() * 0.7 * cell.size,
              size: cell.size * 0.2,
            })
          }
          break

        case "bacteria":
          if (Math.random() < 0.6) {
            cell.size = 2 * sizeFactor
            cell.color = `rgba(100, 100, 200, ${0.7 - focusFactor * 0.5})`
            cell.type = "bacilli"
          } else if (Math.random() < 0.8) {
            cell.size = 1 * sizeFactor
            cell.color = `rgba(100, 150, 200, ${0.7 - focusFactor * 0.5})`
            cell.type = "cocci"
          } else {
            cell.size = 1.5 * sizeFactor
            cell.color = `rgba(150, 100, 200, ${0.7 - focusFactor * 0.5})`
            cell.type = "spirilla"
          }
          break

        case "protozoa":
          if (Math.random() < 0.7) {
            cell.size = 50 * sizeFactor
            cell.color = `rgba(180, 180, 220, ${0.6 - focusFactor * 0.5})`
            cell.type = "paramecium"
            const ciliaCount = Math.floor(10 + Math.random() * 20)
            for (let j = 0; j < ciliaCount; j++) {
              const angle = j * ((Math.PI * 2) / ciliaCount)
              cell.details?.push({
                type: "cilia",
                x: Math.cos(angle) * cell.size,
                y: Math.sin(angle) * cell.size * 0.5,
                length: cell.size * 0.2,
              })
            }
          } else {
            cell.size = 40 * sizeFactor
            cell.color = `rgba(200, 200, 240, ${0.6 - focusFactor * 0.5})`
            cell.type = "amoeba"
            const pseudopodCount = Math.floor(2 + Math.random() * 4)
            for (let j = 0; j < pseudopodCount; j++) {
              const angle = j * ((Math.PI * 2) / pseudopodCount) + Math.random() * 0.5
              cell.details?.push({
                type: "pseudopod",
                angle: angle,
                length: cell.size * (0.5 + Math.random() * 0.5),
              })
            }
          }
          break

        case "histology":
          cell.size = 15 * sizeFactor
          cell.color = `rgba(240, 220, 220, ${0.7 - focusFactor * 0.5})`
          cell.type = "epithelial"
          const row = Math.floor(i / Math.sqrt(cellCount))
          const col = i % Math.sqrt(cellCount)
          cell.x = (col / Math.sqrt(cellCount)) * canvas.width * 0.8 + canvas.width * 0.1
          cell.y = (row / Math.sqrt(cellCount)) * canvas.height * 0.8 + canvas.height * 0.1
          cell.details?.push({
            type: "nucleus",
            x: 0,
            y: 0,
            size: cell.size * 0.4,
          })
          break
      }

      newCells.push(cell)
    }

    newCells.forEach((cell) => {
      ctx.fillStyle = cell.color

      if (cell.type === "bacilli") {
        ctx.save()
        ctx.translate(cell.x, cell.y)
        ctx.rotate(Math.random() * Math.PI)
        ctx.fillRect(-cell.size * 2, -cell.size / 2, cell.size * 4, cell.size)
        ctx.restore()
      } else if (cell.type === "spirilla") {
        ctx.save()
        ctx.translate(cell.x, cell.y)
        ctx.rotate(Math.random() * Math.PI)
        ctx.beginPath()
        ctx.moveTo(-cell.size * 3, 0)

        for (let x = -cell.size * 3; x <= cell.size * 3; x += 1) {
          const y = Math.sin(x * 0.5) * cell.size * 0.5
          ctx.lineTo(x, y)
        }

        ctx.lineWidth = cell.size * 0.5
        ctx.strokeStyle = cell.color
        ctx.stroke()
        ctx.restore()
      } else if (cell.type === "plant") {
        ctx.save()
        ctx.translate(cell.x, cell.y)

        ctx.strokeStyle = `rgba(0, 100, 0, ${0.8 - focusFactor * 0.5})`
        ctx.lineWidth = cell.size * 0.1
        ctx.strokeRect(-cell.size, -cell.size, cell.size * 2, cell.size * 2)

        ctx.fillStyle = cell.color
        ctx.fillRect(-cell.size * 0.9, -cell.size * 0.9, cell.size * 1.8, cell.size * 1.8)

        ctx.fillStyle = `rgba(100, 100, 200, ${0.7 - focusFactor * 0.5})`
        ctx.beginPath()
        ctx.arc(0, 0, cell.size * 0.3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(0, 180, 0, ${0.8 - focusFactor * 0.5})`
        cell.details?.forEach((detail) => {
          if (detail.type === "chloroplast") {
            ctx.beginPath()
            ctx.ellipse(
              detail.x! - cell.size / 2,
              detail.y! - cell.size / 2,
              detail.size!,
              detail.size! * 0.6,
              Math.random() * Math.PI,
              0,
              Math.PI * 2,
            )
            ctx.fill()
          }
        })

        ctx.restore()
      } else if (cell.type === "paramecium") {
        ctx.save()
        ctx.translate(cell.x, cell.y)

        ctx.beginPath()
        ctx.ellipse(0, 0, cell.size, cell.size * 0.4, 0, 0, Math.PI * 2)
        ctx.fillStyle = cell.color
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(cell.size * 0.3, 0)
        ctx.quadraticCurveTo(cell.size * 0.5, -cell.size * 0.2, cell.size * 0.7, 0)
        ctx.strokeStyle = `rgba(100, 100, 150, ${0.8 - focusFactor * 0.5})`
        ctx.lineWidth = cell.size * 0.05
        ctx.stroke()

        ctx.strokeStyle = `rgba(180, 180, 220, ${0.7 - focusFactor * 0.5})`
        ctx.lineWidth = cell.size * 0.02
        cell.details?.forEach((detail) => {
          if (detail.type === "cilia") {
            ctx.beginPath()
            ctx.moveTo(detail.x!, detail.y!)
            ctx.lineTo(detail.x! * 1.2, detail.y! * 1.2)
            ctx.stroke()
          }
        })

        ctx.fillStyle = `rgba(100, 100, 180, ${0.7 - focusFactor * 0.5})`
        ctx.beginPath()
        ctx.ellipse(-cell.size * 0.2, 0, cell.size * 0.25, cell.size * 0.15, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      } else if (cell.type === "amoeba") {
        ctx.save()
        ctx.translate(cell.x, cell.y)

        ctx.beginPath()
        ctx.moveTo(cell.size * 0.5, 0)

        const points = 12
        for (let i = 1; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2
          const radius = cell.size * (0.7 + Math.random() * 0.3)
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          ctx.lineTo(x, y)
        }

        ctx.closePath()
        ctx.fillStyle = cell.color
        ctx.fill()

        cell.details?.forEach((detail) => {
          if (detail.type === "pseudopod") {
            ctx.beginPath()
            const baseX = Math.cos(detail.angle!) * cell.size
            const baseY = Math.sin(detail.angle!) * cell.size
            const tipX = Math.cos(detail.angle!) * (cell.size + detail.length!)
            const tipY = Math.sin(detail.angle!) * (cell.size + detail.length!)
            const controlX = Math.cos(detail.angle! + 0.2) * (cell.size + detail.length! * 0.7)
            const controlY = Math.sin(detail.angle! + 0.2) * (cell.size + detail.length! * 0.7)

            ctx.moveTo(baseX, baseY)
            ctx.quadraticCurveTo(controlX, controlY, tipX, tipY)
            ctx.lineWidth = cell.size * 0.3
            ctx.strokeStyle = cell.color
            ctx.stroke()
          }
        })

        ctx.fillStyle = `rgba(100, 100, 180, ${0.7 - focusFactor * 0.5})`
        ctx.beginPath()
        ctx.arc(0, 0, cell.size * 0.3, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      } else if (cell.type === "epithelial") {
        ctx.save()
        ctx.translate(cell.x, cell.y)

        ctx.beginPath()
        const sides = 6
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2
          const radius = cell.size * (0.9 + Math.random() * 0.2)
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = cell.color
        ctx.fill()

        ctx.strokeStyle = `rgba(180, 150, 150, ${0.8 - focusFactor * 0.5})`
        ctx.lineWidth = cell.size * 0.05
        ctx.stroke()

        ctx.fillStyle = `rgba(80, 50, 120, ${0.8 - focusFactor * 0.5})`
        ctx.beginPath()
        ctx.arc(0, 0, cell.size * 0.3, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      } else if (cell.type === "rbc") {
        ctx.save()
        ctx.translate(cell.x, cell.y)

        ctx.beginPath()
        ctx.arc(0, 0, cell.size, 0, Math.PI * 2)
        ctx.fillStyle = cell.color
        ctx.fill()

        ctx.beginPath()
        ctx.arc(0, 0, cell.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 10, 30, ${0.8 - focusFactor * 0.5})`
        ctx.fill()

        ctx.restore()
      } else if (cell.type === "neutrophil" || cell.type === "lymphocyte" || cell.type === "monocyte") {
        ctx.save()
        ctx.translate(cell.x, cell.y)

        ctx.beginPath()
        ctx.arc(0, 0, cell.size, 0, Math.PI * 2)
        ctx.fillStyle = cell.color
        ctx.fill()

        if (cell.type === "neutrophil") {
          ctx.fillStyle = `rgba(100, 80, 180, ${0.8 - focusFactor * 0.5})`
          const lobes = 3 + Math.floor(Math.random() * 3)
          for (let i = 0; i < lobes; i++) {
            const angle = (i / lobes) * Math.PI * 2
            const distance = cell.size * 0.4
            const x = Math.cos(angle) * distance
            const y = Math.sin(angle) * distance
            ctx.beginPath()
            ctx.arc(x, y, cell.size * 0.25, 0, Math.PI * 2)
            ctx.fill()

            if (i > 0) {
              const prevAngle = ((i - 1) / lobes) * Math.PI * 2
              const prevX = Math.cos(prevAngle) * distance
              const prevY = Math.sin(prevAngle) * distance
              ctx.beginPath()
              ctx.moveTo(prevX, prevY)
              ctx.lineTo(x, y)
              ctx.lineWidth = cell.size * 0.2
              ctx.strokeStyle = `rgba(100, 80, 180, ${0.8 - focusFactor * 0.5})`
              ctx.stroke()
            }
          }
        } else if (cell.type === "lymphocyte") {
          ctx.fillStyle = `rgba(80, 80, 180, ${0.8 - focusFactor * 0.5})`
          ctx.beginPath()
          ctx.arc(0, 0, cell.size * 0.7, 0, Math.PI * 2)
          ctx.fill()
        } else if (cell.type === "monocyte") {
          ctx.fillStyle = `rgba(100, 100, 180, ${0.8 - focusFactor * 0.5})`
          ctx.beginPath()
          ctx.arc(0, 0, cell.size * 0.6, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(cell.size * 0.3, 0, cell.size * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = cell.color
          ctx.fill()
        }

        ctx.restore()
      } else {
        ctx.beginPath()
        ctx.arc(cell.x, cell.y, cell.size, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    setCellsVisible(newCells)
  }

  const handleMagnificationChange = (level: number) => {
    setMagnification(level)
    addObservation(`Changed magnification to ${level}x`)

    if (currentStep === 1) {
      setCurrentStep(2)
    }
  }

  const handleSampleChange = (sample: string) => {
    setSampleType(sample)
    addObservation(`Changed sample to ${SAMPLE_TYPES.find((s) => s.id === sample)?.name}`)

    if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handleFocusChange = (value: number[]) => {
    setFocus(value[0])

    if (currentStep === 3 && Math.abs(50 - value[0]) < 10) {
      setCurrentStep(4)
      addObservation("Sample is now in focus")
    }
  }

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value[0])

    if (currentStep === 4 && value[0] > 60) {
      setCurrentStep(5)
      addObservation("Brightness adjusted for optimal viewing")
    }
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 45) % 360)
    addObservation(`Rotated sample to ${(rotation + 45) % 360}°`)
  }

  const resetMicroscope = () => {
    setMagnification(40)
    setBrightness(50)
    setFocus(50)
    setRotation(0)
    setSampleType("blood")
    setCurrentStep(1)
    setObservations([])
    addObservation("Microscope reset to default settings")
  }

  const addObservation = (text: string) => {
    setObservations((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${text}`])
  }

  const getStepInstructions = () => {
    switch (currentStep) {
      case 1:
        return "Select a magnification level to begin your observation"
      case 2:
        return "Choose a sample type to observe"
      case 3:
        return "Adjust the focus until the sample is clear"
      case 4:
        return "Adjust the brightness for optimal viewing"
      case 5:
        return "Observe the sample and record your findings"
      default:
        return "Experiment completed! Try different samples or settings"
    }
  }

  const getSampleDescription = () => {
    switch (sampleType) {
      case "blood":
        return "Blood cells consist primarily of red blood cells (erythrocytes) which transport oxygen, and white blood cells (leukocytes) which are part of the immune system. Red blood cells are smaller, more numerous, and have a distinctive biconcave shape. White blood cells have a nucleus and are larger."
      case "plant":
        return "Plant cells are characterized by their rigid cell wall, large central vacuole, and chloroplasts which contain chlorophyll for photosynthesis. The cell wall provides structural support and protection. Plant cells are typically larger than animal cells."
      case "bacteria":
        return "Bacteria are prokaryotic microorganisms that lack a nucleus and membrane-bound organelles. They come in various shapes including rod-shaped (bacilli), spherical (cocci), and spiral (spirilla). Bacteria are much smaller than eukaryotic cells."
      case "protozoa":
        return "Protozoa are single-celled eukaryotic organisms that can move independently. They have complex internal structures including a nucleus, vacuoles, and sometimes specialized structures for movement like flagella or cilia. Many protozoa are free-living in aquatic environments."
      default:
        return ""
    }
  }

  const getStatistics = () => {
    const cellCounts: Record<string, number> = {
      rbc: 0,
      wbc: 0,
      plant: 0,
      rod: 0,
      cocci: 0,
      protozoa: 0,
      neutrophil: 0,
      lymphocyte: 0,
      monocyte: 0,
      bacilli: 0,
      spirilla: 0,
      paramecium: 0,
      amoeba: 0,
      epithelial: 0,
    }

    cellsVisible.forEach((cell) => {
      if (cell.type in cellCounts) {
        cellCounts[cell.type]++
      }
    })

    return (
      <div className="space-y-2">
        <h3 className="font-semibold">Sample Statistics</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(cellCounts).map(([type, count]) => {
            if (count === 0) return null

            let label = ""
            switch (type) {
              case "rbc":
                label = "Red Blood Cells"
                break
              case "wbc":
                label = "White Blood Cells"
                break
              case "plant":
                label = "Plant Cells"
                break
              case "rod":
                label = "Rod Bacteria"
                break
              case "cocci":
                label = "Spherical Bacteria"
                break
              case "protozoa":
                label = "Protozoa"
                break
              case "neutrophil":
                label = "Neutrophils"
                break
              case "lymphocyte":
                label = "Lymphocytes"
                break
              case "monocyte":
                label = "Monocytes"
                break
              case "bacilli":
                label = "Bacilli"
                break
              case "spirilla":
                label = "Spirilla"
                break
              case "paramecium":
                label = "Paramecium"
                break
              case "amoeba":
                label = "Amoeba"
                break
              case "epithelial":
                label = "Epithelial Cells"
                break
            }

            return (
              <div key={type} className="flex items-center justify-between">
                <span>{label}:</span>
                <span className="font-semibold">{count}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">Current Settings</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>Magnification: {magnification}x</div>
            <div>Focus: {focus}%</div>
            <div>Brightness: {brightness}%</div>
            <div>Rotation: {rotation}°</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-8">
        <Link href="/student/simulations/bio" className="flex items-center">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Virtual Microscope Lab</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulation" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>Simulation</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Guide</span>
          </TabsTrigger>
          <TabsTrigger value="theory" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Theory</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Results</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="simulation" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Microscope View</CardTitle>
                  <CardDescription>
                    Current magnification: {magnification}x | Sample:{" "}
                    {SAMPLE_TYPES.find((s) => s.id === sampleType)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative flex justify-center items-center">
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                        <RefreshCw className="h-8 w-8 animate-spin" />
                      </div>
                    )}
                    <div className="relative w-full aspect-square max-w-[600px] rounded-full overflow-hidden border-8 border-gray-800 dark:border-gray-700">
                      <canvas ref={canvasRef} width={600} height={600} className="w-full h-full" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {MAGNIFICATION_LEVELS.map((level) => (
                        <Button
                          key={level}
                          variant={magnification === level ? "default" : "outline"}
                          onClick={() => handleMagnificationChange(level)}
                          className="flex items-center gap-1"
                        >
                          {level}x
                        </Button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {SAMPLE_TYPES.map((sample) => (
                        <Button
                          key={sample.id}
                          variant={sampleType === sample.id ? "default" : "outline"}
                          onClick={() => handleSampleChange(sample.id)}
                        >
                          {sample.name}
                        </Button>
                      ))}
                    </div>

                    <div className="space-y-6 mt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <ZoomIn className="h-4 w-4" /> Focus
                          </label>
                          <span className="text-sm">{focus}%</span>
                        </div>
                        <Slider value={[focus]} min={0} max={100} step={1} onValueChange={handleFocusChange} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" /> Brightness
                          </label>
                          <span className="text-sm">{brightness}%</span>
                        </div>
                        <Slider
                          value={[brightness]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={handleBrightnessChange}
                        />
                      </div>

                      <div className="flex justify-center gap-4">
                        <Button onClick={handleRotate} variant="outline" className="flex items-center gap-2">
                          <RotateCw className="h-4 w-4" />
                          Rotate Sample
                        </Button>
                        <Button onClick={resetMicroscope} variant="outline" className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Lab Notebook</CardTitle>
                  <CardDescription>Record your observations and findings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-md">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ChevronRight className="h-4 w-4" />
                      Step {currentStep}: {getStepInstructions()}
                    </h3>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Sample Information</h3>
                    <p className="text-sm">{getSampleDescription()}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Observations</h3>
                    {observations.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No observations recorded yet.</p>
                    ) : (
                      <div className="max-h-[200px] overflow-y-auto space-y-1">
                        {observations.map((obs, i) => (
                          <p key={i} className="text-sm">
                            {obs}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="guide" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Guide</CardTitle>
              <CardDescription>Follow these steps to complete the microscope lab</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-muted">
                  <h3 className="text-lg font-semibold mb-2">Step 1: Select Magnification</h3>
                  <p>
                    Start with the lowest magnification (40x) to locate your specimen. Once centered, you can increase
                    magnification for more detail.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>40x - Low power, wide field of view</li>
                    <li>100x - Medium power, good for initial observations</li>
                    <li>400x - High power, detailed cellular structures</li>
                    <li>1000x - Oil immersion, maximum detail (requires perfect focus)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-md bg-muted">
                  <h3 className="text-lg font-semibold mb-2">Step 2: Choose Sample</h3>
                  <p>Select from different biological samples to observe their unique cellular structures.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Blood Cells - Observe red and white blood cells</li>
                    <li>Plant Cells - Note the cell walls and chloroplasts</li>
                    <li>Bacteria - Examine different bacterial morphologies</li>
                    <li>Protozoa - Study single-celled eukaryotic organisms</li>
                  </ul>
                </div>

                <div className="p-4 rounded-md bg-muted">
                  <h3 className="text-lg font-semibold mb-2">Step 3: Adjust Focus</h3>
                  <p>Use the focus slider to bring your specimen into sharp focus. The optimal focus is around 50%.</p>
                  <p className="mt-2">
                    Tip: Start with a lower magnification to find the specimen, then increase magnification and refocus
                    as needed.
                  </p>
                </div>

                <div className="p-4 rounded-md bg-muted">
                  <h3 className="text-lg font-semibold mb-2">Step 4: Adjust Brightness</h3>
                  <p>
                    Control the illumination to achieve optimal contrast. Different specimens require different lighting
                    conditions.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Lower brightness (30-40%) - For highly transparent specimens</li>
                    <li>Medium brightness (50-60%) - For most specimens</li>
                    <li>Higher brightness (70-80%) - For dense or darkly stained specimens</li>
                  </ul>
                </div>

                <div className="p-4 rounded-md bg-muted">
                  <h3 className="text-lg font-semibold mb-2">Step 5: Record Observations</h3>
                  <p>Document what you see in the specimen. Pay attention to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Cell shape and size</li>
                    <li>Cellular structures and organelles</li>
                    <li>Movement (if present)</li>
                    <li>Arrangement of cells</li>
                    <li>Approximate number of different cell types</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="theory" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Microscopy Theory</CardTitle>
              <CardDescription>Understanding the principles of microscopy and cell biology</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Principles of Microscopy</h3>
                <p>
                  Microscopes use lenses to magnify objects that are too small to be seen with the naked eye. The two
                  main components that determine the quality of a microscope are:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <span className="font-medium">Magnification</span> - The degree to which the specimen is enlarged
                  </li>
                  <li>
                    <span className="font-medium">Resolution</span> - The ability to distinguish between two closely
                    spaced objects (typically 0.2 μm for light microscopes)
                  </li>
                  <li>
                    <span className="font-medium">Numerical Aperture (NA)</span> - A measure of the light-gathering
                    ability of the lens
                  </li>
                </ul>
                <p className="mt-2">
                  The total magnification is calculated by multiplying the eyepiece magnification (usually 10x) by the
                  objective lens magnification (4x, 10x, 40x, or 100x).
                </p>
                <p className="mt-2">
                  The theoretical resolution limit of a light microscope is determined by the wavelength of light and
                  the numerical aperture: d = 0.61λ/NA, where d is the resolution, λ is the wavelength, and NA is the
                  numerical aperture.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Blood Cells</h3>
                  <p>
                    <span className="font-medium">Red Blood Cells (Erythrocytes)</span>: Biconcave discs without nuclei,
                    containing hemoglobin for oxygen transport. They are approximately 7-8 μm in diameter.
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">White Blood Cells (Leukocytes)</span>: Part of the immune system,
                    these cells have nuclei and include several types:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1 ml-4">
                    <li>Neutrophils (60-70% of WBCs): Segmented nucleus, 10-12 μm</li>
                    <li>Lymphocytes (20-30% of WBCs): Large, round nucleus, 7-10 μm</li>
                    <li>Monocytes (2-8% of WBCs): Kidney-shaped nucleus, 15-20 μm</li>
                    <li>Eosinophils (2-4% of WBCs): Bi-lobed nucleus, 10-12 μm</li>
                    <li>Basophils (&lt;1% of WBCs): Bi-lobed nucleus, 12-15 μm</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Plant Cells</h3>
                  <p>Plant cells are distinguished by:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <span className="font-medium">Cell Wall</span>: Rigid structure composed of cellulose
                    </li>
                    <li>
                      <span className="font-medium">Chloroplasts</span>: Double-membrane organelles containing
                      chlorophyll for photosynthesis
                    </li>
                    <li>
                      <span className="font-medium">Central Vacuole</span>: Large fluid-filled organelle occupying up to
                      90% of cell volume
                    </li>
                    <li>
                      <span className="font-medium">Plasmodesmata</span>: Channels through cell walls that connect the
                      cytoplasm of adjacent cells
                    </li>
                  </ul>
                  <p className="mt-2">
                    Plant cells are typically 20-100 μm in diameter, significantly larger than animal cells.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Bacteria</h3>
                  <p>
                    Bacteria are prokaryotic organisms lacking membrane-bound organelles. They are classified by shape:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <span className="font-medium">Cocci</span>: Spherical bacteria (e.g., Staphylococcus), 0.5-2 μm
                    </li>
                    <li>
                      <span className="font-medium">Bacilli</span>: Rod-shaped bacteria (e.g., E. coli), 1-5 μm long
                    </li>
                    <li>
                      <span className="font-medium">Spirilla</span>: Spiral-shaped bacteria (e.g., Spirillum), variable
                      size
                    </li>
                  </ul>
                  <p className="mt-2">
                    Bacteria can be stained using the Gram stain technique, which differentiates bacteria into
                    Gram-positive (purple) and Gram-negative (pink) based on their cell wall composition.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Protozoa</h3>
                  <p>Protozoa are single-celled eukaryotes with complex structures:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <span className="font-medium">Paramecium</span>: Ciliated protozoan, 50-300 μm long, with oral
                      groove for feeding
                    </li>
                    <li>
                      <span className="font-medium">Amoeba</span>: Forms pseudopodia for movement and feeding, 20-600 μm
                    </li>
                    <li>
                      <span className="font-medium">Euglena</span>: Flagellated protozoan with chloroplasts, 15-500 μm
                    </li>
                  </ul>
                  <p className="mt-2">
                    Protozoa move using specialized structures such as cilia, flagella, or pseudopodia, and many are
                    free-living in aquatic environments.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Histology</h3>
                  <p>
                    Histology is the study of tissues, which are groups of similar cells that perform a specific
                    function.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <span className="font-medium">Epithelial tissue</span>: Forms the outer layer of organs and body
                      surfaces
                    </li>
                    <li>
                      <span className="font-medium">Connective tissue</span>: Supports and connects other tissues
                    </li>
                    <li>
                      <span className="font-medium">Muscle tissue</span>: Responsible for movement
                    </li>
                    <li>
                      <span className="font-medium">Nervous tissue</span>: Transmits electrical signals
                    </li>
                  </ul>
                  <p className="mt-2">
                    Tissue sections are typically stained with hematoxylin and eosin (H&E), which stains nuclei
                    blue-purple and cytoplasm pink.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Types of Microscopy</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <span className="font-medium">Brightfield</span>: Standard light microscopy where specimens appear
                      dark against a bright background
                    </li>
                    <li>
                      <span className="font-medium">Phase Contrast</span>: Enhances contrast in transparent specimens
                      without staining
                    </li>
                    <li>
                      <span className="font-medium">Fluorescence</span>: Uses fluorescent dyes to visualize specific
                      cellular components
                    </li>
                    <li>
                      <span className="font-medium">Electron</span>: Uses electrons instead of light, achieving much
                      higher resolution (0.1 nm)
                    </li>
                    <li>
                      <span className="font-medium">Confocal</span>: Creates sharp images of a single plane by
                      eliminating out-of-focus light
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment</CardTitle>
              <CardDescription>Evaluate your understanding of microscopy and cell biology</CardDescription>
            </CardHeader>
            <CardContent>
              {getStatistics()}

              <div className="mt-6 p-4 bg-muted rounded-md">
                <h3 className="font-semibold mb-2">Experiment Summary</h3>
                <p>Use this section to summarize your findings and observations from the microscope lab.</p>

                <div className="mt-4">
                  <h4 className="font-semibold">Observation Log</h4>
                  {observations.length === 0 ? (
                    <p className="text-sm text-muted-foreground mt-2">
                      No observations recorded yet. Complete the simulation to record observations.
                    </p>
                  ) : (
                    <div className="mt-2 max-h-[300px] overflow-y-auto space-y-1">
                      {observations.map((obs, i) => (
                        <p key={i} className="text-sm">
                          {obs}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Self-Assessment Questions</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">1. What is the approximate diameter of a red blood cell?</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addObservation("Incorrect: RBC diameter is not 4-5 μm")}
                        >
                          4-5 μm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addObservation("Correct: RBC diameter is 7-8 μm")}
                        >
                          7-8 μm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addObservation("Incorrect: RBC diameter is not 10-12 μm")}
                        >
                          10-12 μm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addObservation("Incorrect: RBC diameter is not 15-20 μm")}
                        >
                          15-20 μm
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">
                        2. Which of the following is a characteristic of plant cells but not animal cells?
                      </p>
                      <div className="grid grid-cols-1 gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addObservation("Incorrect: Both plant and animal cells have mitochondria")}
                        >
                          Mitochondria
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addObservation("Correct: Cell walls are present in plant cells but not animal cells")
                          }
                        >
                          Cell wall
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addObservation("Incorrect: Both plant and animal cells have a nucleus")}
                        >
                          Nucleus
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addObservation("Incorrect: Both plant and animal cells have ribosomes")}
                        >
                          Ribosomes
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">
                        3. Which microscope technique would be best for observing living, unstained cells?
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addObservation(
                              "Incorrect: Brightfield microscopy provides poor contrast for unstained cells",
                            )
                          }
                        >
                          Brightfield
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addObservation("Correct: Phase contrast microscopy is ideal for unstained living cells")
                          }
                        >
                          Phase contrast
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addObservation("Incorrect: Electron microscopy requires fixed, non-living specimens")
                          }
                        >
                          Electron
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addObservation("Incorrect: Fluorescence microscopy typically requires staining")
                          }
                        >
                          Fluorescence
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}