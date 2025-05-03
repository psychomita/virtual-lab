"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Droplets } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExperimentLayout } from "@/components/simulations/explore/experiment-layout"
import type { QuestionType } from "@/components/simulations/explore/assessment"

export default function TitrationPage() {
  return (
    <ExperimentLayout
      title="Titration Experiment"
      labPath="/student/simulations/chem"
      theory={<TitrationTheory />}
      procedure={<TitrationProcedure />}
      simulation={<TitrationSimulation />}
      assessment={titrationAssessment}
    />
  )
}

function TitrationTheory() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acid-Base Titration Theory</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Introduction to Titration</h3>
        <p className="text-gray-700 dark:text-gray-300">
          Titration is an analytical technique used to determine the concentration of an unknown solution (analyte) by
          reacting it with a solution of known concentration (titrant). In acid-base titrations, an acid is neutralized
          by a base, or vice versa, allowing us to determine the concentration of the unknown solution.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Acid-Base Neutralization</h3>
        <p className="text-gray-700 dark:text-gray-300">When an acid and a base react, they form water and a salt in a neutralization reaction:</p>
        <div className="my-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-center">
          <p className="font-mono text-lg dark:text-gray-200">Acid + Base → Salt + Water</p>
          <p className="font-mono text-lg dark:text-gray-200">HCl + NaOH → NaCl + H₂O</p>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          At the molecular level, the hydrogen ions (H⁺) from the acid combine with the hydroxide ions (OH⁻) from the
          base to form water (H₂O).
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Equivalence Point</h3>
        <p className="text-gray-700 dark:text-gray-300">
          The equivalence point is reached when the moles of acid exactly equal the moles of base, resulting in complete
          neutralization. At this point:
        </p>
        <div className="my-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-center">
          <p className="font-mono text-lg dark:text-gray-200">Moles of acid = Moles of base</p>
          <p className="font-mono text-lg dark:text-gray-200">C₁ × V₁ = C₂ × V₂</p>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          Where C₁ and V₁ are the concentration and volume of the acid, and C₂ and V₂ are the concentration and volume
          of the base.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Indicators</h3>
        <p className="text-gray-700 dark:text-gray-300">
          Indicators are substances that change color at specific pH values, helping to visually identify when the
          equivalence point has been reached. Common indicators include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Phenolphthalein:</strong> Colorless in acidic solutions, pink in basic solutions (pH range 8.2-10.0)
          </li>
          <li>
            <strong>Methyl Orange:</strong> Red in acidic solutions, yellow in basic solutions (pH range 3.1-4.4)
          </li>
          <li>
            <strong>Bromothymol Blue:</strong> Yellow in acidic solutions, blue in basic solutions (pH range 6.0-7.6)
          </li>
          <li>
            <strong>Universal Indicator:</strong> Changes through a spectrum of colors across the pH scale (pH range 1-14)
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Titration Curve</h3>
        <p className="text-gray-700 dark:text-gray-300">A titration curve is a graph of pH versus volume of titrant added. The curve has several key features:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Initial plateau: The pH changes slowly as titrant is first added</li>
          <li>Steep rise: Near the equivalence point, the pH changes rapidly with small additions of titrant</li>
          <li>Final plateau: After the equivalence point, the pH changes slowly again</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">The inflection point of the curve (where the slope is steepest) corresponds to the equivalence point.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Applications</h3>
        <p className="text-gray-700 dark:text-gray-300">Titrations are widely used in various fields:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Determining the concentration of acids or bases in solutions</li>
          <li>Quality control in pharmaceutical and food industries</li>
          <li>Environmental analysis of water and soil samples</li>
          <li>Clinical chemistry for analyzing blood and urine samples</li>
        </ul>
      </div>
    </div>
  )
}

function TitrationProcedure() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Titration Experimental Procedure</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Objectives</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Determine the concentration of an unknown acid solution using a standardized base solution</li>
          <li>Observe the pH changes during an acid-base titration</li>
          <li>Identify the equivalence point using different indicators</li>
          <li>Understand the relationship between acid concentration and titration volume</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Materials and Equipment</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Burette</li>
          <li>Erlenmeyer flask</li>
          <li>Acid solution (unknown concentration)</li>
          <li>Standardized base solution (known concentration)</li>
          <li>pH indicator</li>
          <li>Magnetic stirrer (optional)</li>
          <li>pH meter (optional)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Step-by-Step Procedure</h3>

        <div className="space-y-2">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">Part 1: Setting Up the Titration</h4>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Fill the burette with the standardized base solution (e.g., 0.1 M NaOH)</li>
            <li>Record the initial volume reading on the burette</li>
            <li>Measure a precise volume of the acid solution (e.g., 25 mL) into the Erlenmeyer flask</li>
            <li>Add 2-3 drops of the selected indicator to the acid solution</li>
            <li>Place the flask under the burette on a white surface to better observe color changes</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">Part 2: Performing the Titration</h4>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Slowly add the base solution from the burette to the acid solution in the flask</li>
            <li>Swirl the flask continuously to ensure thorough mixing</li>
            <li>As you approach the expected equivalence point, add the base dropwise</li>
            <li>Observe the color change of the indicator</li>
            <li>Stop adding base when the indicator changes color permanently (endpoint)</li>
            <li>Record the final volume reading on the burette</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">Part 3: Calculating the Concentration</h4>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Calculate the volume of base used: V₂ = Final volume - Initial volume</li>
            <li>Use the equation: C₁ × V₁ = C₂ × V₂</li>
            <li>Solve for C₁, the concentration of the acid solution</li>
            <li>Record your result and compare with the actual concentration if available</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">Part 4: Exploring Different Variables</h4>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Repeat the titration using different indicators and compare the results</li>
            <li>Try varying the acid concentration and observe how it affects the titration volume</li>
            <li>If available, use a pH meter to monitor pH changes throughout the titration</li>
            <li>Plot a titration curve (pH vs. volume of base added)</li>
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Data Analysis</h3>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Calculate the moles of base used: moles = concentration × volume (in liters)</li>
          <li>Determine the moles of acid present: moles of acid = moles of base (at equivalence point)</li>
          <li>Calculate the concentration of the acid: concentration = moles ÷ volume (in liters)</li>
          <li>Determine the percent error if the actual concentration is known</li>
          <li>Analyze the titration curve to identify the equivalence point and buffer regions</li>
        </ol>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Safety Precautions</h3>
        <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Wear appropriate personal protective equipment (lab coat, safety goggles, gloves)</li>
          <li>Handle acids and bases with care as they can cause chemical burns</li>
          <li>In case of spills, neutralize acids with sodium bicarbonate and bases with dilute acetic acid</li>
          <li>Always add acid to water, never water to acid</li>
          <li>Ensure proper ventilation in the laboratory</li>
        </ul>
      </div>
    </div>
  )
}

function TitrationSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Titration parameters
  const [acidConcentration, setAcidConcentration] = useState(0.1) // mol/L
  const [baseConcentration, setBaseConcentration] = useState(0.1) // mol/L
  const [acidVolume, setAcidVolume] = useState(50) // mL
  const [baseAdded, setBaseAdded] = useState(0) // mL
  const [dropSize, setDropSize] = useState(1) // mL
  const [indicator, setIndicator] = useState("phenolphthalein")

  // Calculated values
  const [pH, setPH] = useState(0)
  const [equivalencePoint, setEquivalencePoint] = useState(0)
  const [color, setColor] = useState("")

  // pH curve data
  const [pHCurve, setPHCurve] = useState<{ volume: number; pH: number }[]>([])

  // Indicators and their color changes
  const indicators = {
    phenolphthalein: { range: [8.2, 10.0], acidColor: "transparent", baseColor: "#ff69b4" },
    methylOrange: { range: [3.1, 4.4], acidColor: "#ff4500", baseColor: "#ffff00" },
    bromothymolBlue: { range: [6.0, 7.6], acidColor: "#ffff00", baseColor: "#0000ff" },
    universalIndicator: { range: [0, 14], acidColor: "#ff0000", baseColor: "#800080" },
  }

  // Calculate pH based on titration progress
  useEffect(() => {
    // Calculate moles of acid and base
    const molesAcid = acidConcentration * (acidVolume / 1000) // Convert mL to L
    const molesBase = baseConcentration * (baseAdded / 1000) // Convert mL to L

    // Calculate equivalence point (volume of base needed)
    const eqPoint = (molesAcid / baseConcentration) * 1000 // Convert L to mL
    setEquivalencePoint(eqPoint)

    // Calculate pH
    let calculatedPH

    if (baseAdded < eqPoint) {
      // Before equivalence point - excess acid
      const excessAcid = molesAcid - molesBase
      const totalVolume = (acidVolume + baseAdded) / 1000 // Total volume in L
      const excessAcidConcentration = excessAcid / totalVolume
      calculatedPH = -Math.log10(excessAcidConcentration)
    } else if (Math.abs(baseAdded - eqPoint) < 0.01) {
      // At equivalence point - pH depends on salt formed
      calculatedPH = 7.0
    } else {
      // After equivalence point - excess base
      const excessBase = molesBase - molesAcid
      const totalVolume = (acidVolume + baseAdded) / 1000 // Total volume in L
      const excessBaseConcentration = excessBase / totalVolume
      calculatedPH = 14 + Math.log10(excessBaseConcentration)
    }

    // Clamp pH between 0 and 14
    calculatedPH = Math.max(0, Math.min(14, calculatedPH))
    setPH(calculatedPH)

    // Update pH curve
    if (baseAdded === 0 || pHCurve.length === 0) {
      setPHCurve([{ volume: baseAdded, pH: calculatedPH }])
    } else {
      setPHCurve((prev) => [...prev, { volume: baseAdded, pH: calculatedPH }])
    }

    // Determine solution color based on indicator and pH
    const selectedIndicator = indicators[indicator as keyof typeof indicators]
    if (calculatedPH < selectedIndicator.range[0]) {
      setColor(selectedIndicator.acidColor)
    } else if (calculatedPH > selectedIndicator.range[1]) {
      setColor(selectedIndicator.baseColor)
    } else {
      // In transition range - blend colors
      const ratio =
        (calculatedPH - selectedIndicator.range[0]) / (selectedIndicator.range[1] - selectedIndicator.range[0])
      setColor(blendColors(selectedIndicator.acidColor, selectedIndicator.baseColor, ratio))
    }
  }, [acidConcentration, baseConcentration, acidVolume, baseAdded, indicator])

  // Helper function to blend colors
  const blendColors = (color1: string, color2: string, ratio: number) => {
    // Handle transparent color
    if (color1 === "transparent") return color2 === "transparent" ? "transparent" : color2
    if (color2 === "transparent") return color1

    // Convert hex to RGB
    const r1 = Number.parseInt(color1.slice(1, 3), 16)
    const g1 = Number.parseInt(color1.slice(3, 5), 16)
    const b1 = Number.parseInt(color1.slice(5, 7), 16)

    const r2 = Number.parseInt(color2.slice(1, 3), 16)
    const g2 = Number.parseInt(color2.slice(3, 5), 16)
    const b2 = Number.parseInt(color2.slice(5, 7), 16)

    // Blend colors
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio)
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio)
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio)

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  // Draw the titration setup and pH curve
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set colors based on theme
    const textColor = document.documentElement.classList.contains('dark') ? '#ffffff' : '#333333'
    const lineColor = document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#333333'
    const gridColor = document.documentElement.classList.contains('dark') ? '#374151' : '#dddddd'
    const bgColor = document.documentElement.classList.contains('dark') ? '#1f2937' : '#f9fafb'

    // Draw flask
    ctx.beginPath()
    ctx.moveTo(150, 250)
    ctx.lineTo(150, 350)
    ctx.quadraticCurveTo(150, 400, 200, 400)
    ctx.lineTo(300, 400)
    ctx.quadraticCurveTo(350, 400, 350, 350)
    ctx.lineTo(350, 250)
    ctx.closePath()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw solution in flask
    ctx.beginPath()
    ctx.moveTo(150, 350)
    ctx.quadraticCurveTo(150, 400, 200, 400)
    ctx.lineTo(300, 400)
    ctx.quadraticCurveTo(350, 400, 350, 350)
    ctx.closePath()
    ctx.fillStyle = color || (document.documentElement.classList.contains('dark') ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)")
    ctx.fill()

    // Draw burette
    ctx.beginPath()
    ctx.rect(230, 100, 40, 150)
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw burette tip
    ctx.beginPath()
    ctx.moveTo(250, 250)
    ctx.lineTo(250, 280)
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw base solution in burette
    ctx.beginPath()
    ctx.rect(230, 100, 40, 150 * (1 - baseAdded / 100))
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? "rgba(100, 149, 237, 0.3)" : "rgba(0, 0, 255, 0.2)"
    ctx.fill()

    // Draw drop if adding
    if (baseAdded > 0 && baseAdded % dropSize === 0) {
      ctx.beginPath()
      ctx.arc(250, 290, 5, 0, Math.PI * 2)
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? "rgba(100, 149, 237, 0.5)" : "rgba(0, 0, 255, 0.3)"
      ctx.fill()
    }

    // Draw pH curve
    if (pHCurve.length > 1) {
      const graphWidth = 200
      const graphHeight = 140
      const graphX = 400
      const graphY = 100

      // Draw background
      ctx.fillStyle = bgColor
      ctx.fillRect(graphX, graphY, graphWidth, graphHeight)

      // Draw axes
      ctx.beginPath()
      ctx.moveTo(graphX, graphY)
      ctx.lineTo(graphX, graphY + graphHeight)
      ctx.lineTo(graphX + graphWidth, graphY + graphHeight)
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1
      ctx.stroke()

      // Label axes
      ctx.fillStyle = textColor
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Volume of Base (mL)", graphX + graphWidth / 2, graphY + graphHeight + 20)

      ctx.save()
      ctx.translate(graphX - 20, graphY + graphHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.textAlign = "center"
      ctx.fillText("pH", 0, 0)
      ctx.restore()

      // Draw grid lines
      ctx.strokeStyle = gridColor
      ctx.beginPath()
      for (let i = 0; i <= 14; i += 2) {
        const y = graphY + graphHeight - (i / 14) * graphHeight
        ctx.moveTo(graphX, y)
        ctx.lineTo(graphX + graphWidth, y)
      }

      for (let i = 0; i <= 100; i += 20) {
        const x = graphX + (i / 100) * graphWidth
        ctx.moveTo(x, graphY)
        ctx.lineTo(x, graphY + graphHeight)
      }
      ctx.stroke()

      // Draw pH curve
      ctx.beginPath()
      ctx.moveTo(
        graphX + (pHCurve[0].volume / 100) * graphWidth,
        graphY + graphHeight - (pHCurve[0].pH / 14) * graphHeight,
      )

      for (let i = 1; i < pHCurve.length; i++) {
        const x = graphX + (pHCurve[i].volume / 100) * graphWidth
        const y = graphY + graphHeight - (pHCurve[i].pH / 14) * graphHeight
        ctx.lineTo(x, y)
      }

      ctx.strokeStyle = document.documentElement.classList.contains('dark') ? "#60a5fa" : "#3b82f6"
      ctx.lineWidth = 2
      ctx.stroke()

      // Mark equivalence point
      if (baseAdded >= equivalencePoint) {
        const eqX = graphX + (equivalencePoint / 100) * graphWidth
        const eqY = graphY + graphHeight - (7 / 14) * graphHeight

        ctx.beginPath()
        ctx.arc(eqX, eqY, 5, 0, Math.PI * 2)
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? "#f87171" : "#ef4444"
        ctx.fill()

        ctx.fillStyle = textColor
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Equivalence Point", eqX, eqY - 10)
      }
    }

    // Display current pH
    ctx.fillStyle = textColor
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`pH: ${pH.toFixed(2)}`, 250, 50)
  }, [color, baseAdded, pHCurve, pH, equivalencePoint, dropSize])

  // Add a drop of base
  const addDrop = () => {
    if (baseAdded < 100) {
      setBaseAdded((prev) => prev + dropSize)
    }
  }

  // Reset the simulation
  const resetSimulation = () => {
    setBaseAdded(0)
    setPHCurve([])
  }

  return (
    <div className="w-full">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Titration Simulation</CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300">
            Observe how the pH changes as you add base to the acid solution
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <canvas 
            ref={canvasRef} 
            width={650} 
            height={450} 
            className="border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700" 
          />

          <div className="flex gap-4 mt-4">
            <Button 
              onClick={addDrop} 
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800" 
              disabled={baseAdded >= 100}
            >
              <Droplets className="mr-2 h-4 w-4" />
              Add {dropSize} mL of Base
            </Button>
            <Button onClick={resetSimulation} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Base Added: {baseAdded.toFixed(1)} mL | Equivalence Point: {equivalencePoint.toFixed(1)} mL
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Acid Concentration</label>
                <span className="text-sm text-gray-500 dark:text-gray-400">{acidConcentration} mol/L</span>
              </div>
              <Slider
                value={[acidConcentration * 100]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setAcidConcentration(value[0] / 100)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base Concentration</label>
                <span className="text-sm text-gray-500 dark:text-gray-400">{baseConcentration} mol/L</span>
              </div>
              <Slider
                value={[baseConcentration * 100]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setBaseConcentration(value[0] / 100)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Acid Volume</label>
                <span className="text-sm text-gray-500 dark:text-gray-400">{acidVolume} mL</span>
              </div>
              <Slider
                value={[acidVolume]}
                min={10}
                max={100}
                step={1}
                onValueChange={(value) => setAcidVolume(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop Size</label>
                <span className="text-sm text-gray-500 dark:text-gray-400">{dropSize} mL</span>
              </div>
              <Slider
                value={[dropSize * 10]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setDropSize(value[0] / 10)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Indicator</label>
              <Select value={indicator} onValueChange={setIndicator}>
                <SelectTrigger className="dark:border-gray-600">
                  <SelectValue placeholder="Select an indicator" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem 
                    value="phenolphthalein" 
                    className="dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                  >
                    Phenolphthalein (8.2-10.0)
                  </SelectItem>
                  <SelectItem 
                    value="methylOrange" 
                    className="dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                  >
                    Methyl Orange (3.1-4.4)
                  </SelectItem>
                  <SelectItem 
                    value="bromothymolBlue" 
                    className="dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                  >
                    Bromothymol Blue (6.0-7.6)
                  </SelectItem>
                  <SelectItem 
                    value="universalIndicator" 
                    className="dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                  >
                    Universal Indicator (0-14)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const titrationAssessment: QuestionType[] = [
  {
    id: "titration-q1",
    type: "multiple-choice",
    question: "What is the purpose of an indicator in a titration?",
    options: [
      "To increase the reaction rate",
      "To visually signal when the equivalence point is reached",
      "To prevent the solution from overflowing",
      "To stabilize the pH of the solution",
    ],
    correctAnswer: "To visually signal when the equivalence point is reached",
    explanation:
      "Indicators change color at specific pH values, helping to visually identify when the equivalence point has been reached during a titration.",
  },
  {
    id: "titration-q2",
    type: "multiple-choice",
    question: "At the equivalence point of an acid-base titration, what is true about the moles of acid and base?",
    options: [
      "The moles of acid are greater than the moles of base",
      "The moles of base are greater than the moles of acid",
      "The moles of acid equal the moles of base",
      "The relationship depends on the strength of the acid and base",
    ],
    correctAnswer: "The moles of acid equal the moles of base",
    explanation:
      "At the equivalence point, the moles of acid exactly equal the moles of base, resulting in complete neutralization.",
  },
  {
    id: "titration-q3",
    type: "multiple-choice",
    question: "Which equation is used to calculate the unknown concentration in a titration?",
    options: ["C₁ + V₁ = C₂ + V₂", "C₁ × V₁ = C₂ × V₂", "C₁ / V₁ = C₂ / V₂", "C₁ - V₁ = C₂ - V₂"],
    correctAnswer: "C₁ × V₁ = C₂ × V₂",
    explanation:
      "The equation C₁ × V₁ = C₂ × V₂ is used to calculate the unknown concentration, where C is concentration and V is volume.",
  },
  {
    id: "titration-q4",
    type: "multiple-choice",
    question: "What happens to the pH at the equivalence point in a strong acid-strong base titration?",
    options: [
      "The pH is always exactly 7",
      "The pH is always less than 7",
      "The pH is always greater than 7",
      "The pH depends on the specific acid and base used",
    ],
    correctAnswer: "The pH is always exactly 7",
    explanation:
      "In a strong acid-strong base titration, the salt formed at the equivalence point does not hydrolyze, resulting in a neutral solution with a pH of 7.",
  },
  {
    id: "titration-q5",
    type: "multiple-choice",
    question: "Which indicator would be most appropriate for a strong acid-weak base titration?",
    options: [
      "Phenolphthalein (pH range 8.2-10.0)",
      "Methyl Orange (pH range 3.1-4.4)",
      "Bromothymol Blue (pH range 6.0-7.6)",
      "Universal Indicator (pH range 1-14)",
    ],
    correctAnswer: "Methyl Orange (pH range 3.1-4.4)",
    explanation:
      "A strong acid-weak base titration has an equivalence point below pH 7. Methyl Orange changes color in the acidic range (3.1-4.4), making it suitable for this type of titration.",
  },
  {
    id: "titration-q6",
    type: "multiple-choice",
    question:
      "If you have 25 mL of 0.1 M HCl, how many mL of 0.1 M NaOH would be required to reach the equivalence point?",
    options: ["10 mL", "25 mL", "50 mL", "100 mL"],
    correctAnswer: "25 mL",
    explanation:
      "Using the equation C₁ × V₁ = C₂ × V₂, we have 0.1 M × 25 mL = 0.1 M × V₂. Solving for V₂ gives 25 mL.",
  },
  {
    id: "titration-q7",
    type: "open-ended",
    question: "Explain why the pH changes rapidly near the equivalence point of a titration.",
    explanation:
      "Near the equivalence point, the buffer capacity of the solution is at its minimum. This means that small additions of titrant cause large changes in pH because there are few excess acid or base molecules to resist the change. The steep portion of the titration curve represents this rapid change in pH.",
  },
  {
    id: "titration-q8",
    type: "open-ended",
    question: "Describe how you would determine the concentration of acetic acid in vinegar using a titration.",
    explanation:
      "To determine the concentration of acetic acid in vinegar, you would first dilute a known volume of vinegar with distilled water. Then add a few drops of phenolphthalein indicator and titrate with a standardized NaOH solution until the solution turns pink, indicating the endpoint. Calculate the concentration using the equation C₁ × V₁ = C₂ × V₂, where C₁ is the unknown concentration of acetic acid, V₁ is the volume of vinegar, C₂ is the concentration of NaOH, and V₂ is the volume of NaOH used.",
  },
]