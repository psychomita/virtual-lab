"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Droplets } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TitrationSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Titration parameters
  const [acidConcentration, setAcidConcentration] = useState(0.1); // mol/L
  const [baseConcentration, setBaseConcentration] = useState(0.1); // mol/L
  const [acidVolume, setAcidVolume] = useState(50); // mL
  const [baseAdded, setBaseAdded] = useState(0); // mL
  const [dropSize, setDropSize] = useState(1); // mL
  const [indicator, setIndicator] = useState("phenolphthalein");

  // Calculated values
  const [pH, setPH] = useState(0);
  const [equivalencePoint, setEquivalencePoint] = useState(0);
  const [color, setColor] = useState("");

  // pH curve data
  const [pHCurve, setPHCurve] = useState<{ volume: number; pH: number }[]>([]);

  // Indicators and their color changes
  const indicators = {
    phenolphthalein: {
      range: [8.2, 10.0],
      acidColor: "transparent",
      baseColor: "#ff69b4",
    },
    methylOrange: {
      range: [3.1, 4.4],
      acidColor: "#ff4500",
      baseColor: "#ffff00",
    },
    bromothymolBlue: {
      range: [6.0, 7.6],
      acidColor: "#ffff00",
      baseColor: "#0000ff",
    },
    universalIndicator: {
      range: [0, 14],
      acidColor: "#ff0000",
      baseColor: "#800080",
    },
  };

  // Calculate pH based on titration progress
  useEffect(() => {
    // Calculate moles of acid and base
    const molesAcid = acidConcentration * (acidVolume / 1000); // Convert mL to L
    const molesBase = baseConcentration * (baseAdded / 1000); // Convert mL to L

    // Calculate equivalence point (volume of base needed)
    const eqPoint = (molesAcid / baseConcentration) * 1000; // Convert L to mL
    setEquivalencePoint(eqPoint);

    // Calculate pH
    let calculatedPH;

    if (baseAdded < eqPoint) {
      // Before equivalence point - excess acid
      const excessAcid = molesAcid - molesBase;
      const totalVolume = (acidVolume + baseAdded) / 1000; // Total volume in L
      const excessAcidConcentration = excessAcid / totalVolume;
      calculatedPH = -Math.log10(excessAcidConcentration);
    } else if (Math.abs(baseAdded - eqPoint) < 0.01) {
      // At equivalence point - pH depends on salt formed
      calculatedPH = 7.0;
    } else {
      // After equivalence point - excess base
      const excessBase = molesBase - molesAcid;
      const totalVolume = (acidVolume + baseAdded) / 1000; // Total volume in L
      const excessBaseConcentration = excessBase / totalVolume;
      calculatedPH = 14 + Math.log10(excessBaseConcentration);
    }

    // Clamp pH between 0 and 14
    calculatedPH = Math.max(0, Math.min(14, calculatedPH));
    setPH(calculatedPH);

    // Update pH curve
    if (baseAdded === 0 || pHCurve.length === 0) {
      setPHCurve([{ volume: baseAdded, pH: calculatedPH }]);
    } else {
      setPHCurve((prev) => [...prev, { volume: baseAdded, pH: calculatedPH }]);
    }

    // Determine solution color based on indicator and pH
    const selectedIndicator = indicators[indicator as keyof typeof indicators];
    if (calculatedPH < selectedIndicator.range[0]) {
      setColor(selectedIndicator.acidColor);
    } else if (calculatedPH > selectedIndicator.range[1]) {
      setColor(selectedIndicator.baseColor);
    } else {
      // In transition range - blend colors
      const ratio =
        (calculatedPH - selectedIndicator.range[0]) /
        (selectedIndicator.range[1] - selectedIndicator.range[0]);
      setColor(
        blendColors(
          selectedIndicator.acidColor,
          selectedIndicator.baseColor,
          ratio,
        ),
      );
    }
  }, [acidConcentration, baseConcentration, acidVolume, baseAdded, indicator]);

  // Helper function to blend colors
  const blendColors = (color1: string, color2: string, ratio: number) => {
    // Handle transparent color
    if (color1 === "transparent")
      return color2 === "transparent" ? "transparent" : color2;
    if (color2 === "transparent") return color1;

    // Convert hex to RGB
    const r1 = Number.parseInt(color1.slice(1, 3), 16);
    const g1 = Number.parseInt(color1.slice(3, 5), 16);
    const b1 = Number.parseInt(color1.slice(5, 7), 16);

    const r2 = Number.parseInt(color2.slice(1, 3), 16);
    const g2 = Number.parseInt(color2.slice(3, 5), 16);
    const b2 = Number.parseInt(color2.slice(5, 7), 16);

    // Blend colors
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  // Draw the titration setup and pH curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw flask
    ctx.beginPath();
    ctx.moveTo(150, 250);
    ctx.lineTo(150, 350);
    ctx.quadraticCurveTo(150, 400, 200, 400);
    ctx.lineTo(300, 400);
    ctx.quadraticCurveTo(350, 400, 350, 350);
    ctx.lineTo(350, 250);
    ctx.closePath();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw solution in flask
    ctx.beginPath();
    ctx.moveTo(150, 350);
    ctx.quadraticCurveTo(150, 400, 200, 400);
    ctx.lineTo(300, 400);
    ctx.quadraticCurveTo(350, 400, 350, 350);
    ctx.closePath();
    ctx.fillStyle = color || "rgba(255, 255, 255, 0.8)";
    ctx.fill();

    // Draw burette
    ctx.beginPath();
    ctx.rect(230, 100, 40, 150);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw burette tip
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.lineTo(250, 280);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw base solution in burette
    ctx.beginPath();
    ctx.rect(230, 100, 40, 150 * (1 - baseAdded / 100));
    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx.fill();

    // Draw drop if adding
    if (baseAdded > 0 && baseAdded % dropSize === 0) {
      ctx.beginPath();
      ctx.arc(250, 290, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      ctx.fill();
    }

    // Draw pH curve
    if (pHCurve.length > 1) {
      const graphWidth = 200;
      const graphHeight = 140;
      const graphX = 400;
      const graphY = 100;

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(graphX, graphY);
      ctx.lineTo(graphX, graphY + graphHeight);
      ctx.lineTo(graphX + graphWidth, graphY + graphHeight);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label axes
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "Volume of Base (mL)",
        graphX + graphWidth / 2,
        graphY + graphHeight + 20,
      );

      ctx.save();
      ctx.translate(graphX - 20, graphY + graphHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillText("pH", 0, 0);
      ctx.restore();

      // Draw grid lines
      ctx.strokeStyle = "#ddd";
      ctx.beginPath();
      for (let i = 0; i <= 14; i += 2) {
        const y = graphY + graphHeight - (i / 14) * graphHeight;
        ctx.moveTo(graphX, y);
        ctx.lineTo(graphX + graphWidth, y);
      }

      for (let i = 0; i <= 100; i += 20) {
        const x = graphX + (i / 100) * graphWidth;
        ctx.moveTo(x, graphY);
        ctx.lineTo(x, graphY + graphHeight);
      }
      ctx.stroke();

      // Draw pH curve
      ctx.beginPath();
      ctx.moveTo(
        graphX + (pHCurve[0].volume / 100) * graphWidth,
        graphY + graphHeight - (pHCurve[0].pH / 14) * graphHeight,
      );

      for (let i = 1; i < pHCurve.length; i++) {
        const x = graphX + (pHCurve[i].volume / 100) * graphWidth;
        const y = graphY + graphHeight - (pHCurve[i].pH / 14) * graphHeight;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mark equivalence point
      if (baseAdded >= equivalencePoint) {
        const eqX = graphX + (equivalencePoint / 100) * graphWidth;
        const eqY = graphY + graphHeight - (7 / 14) * graphHeight;

        ctx.beginPath();
        ctx.arc(eqX, eqY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();

        ctx.fillStyle = "#333";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Equivalence Point", eqX, eqY - 10);
      }
    }

    // Display current pH
    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`pH: ${pH.toFixed(2)}`, 250, 50);
  }, [color, baseAdded, pHCurve, pH, equivalencePoint, dropSize]);

  // Add a drop of base
  const addDrop = () => {
    if (baseAdded < 100) {
      setBaseAdded((prev) => prev + dropSize);
    }
  };

  // Reset the simulation
  const resetSimulation = () => {
    setBaseAdded(0);
    setPHCurve([]);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/student/simulations/chem">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Titration Experiment</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>Simulation</CardTitle>
              <CardDescription>
                Observe how the pH changes as you add base to the acid solution
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={650}
                height={450}
                className="rounded-md border bg-gray-50"
              />

              <div className="mt-4 flex gap-4">
                <Button
                  onClick={addDrop}
                  className="bg-green-500 hover:bg-green-600"
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

              <div className="mt-4 text-sm text-gray-500">
                Base Added: {baseAdded.toFixed(1)} mL | Equivalence Point:{" "}
                {equivalencePoint.toFixed(1)} mL
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
              <CardDescription>
                Adjust these values to see how they affect the titration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Acid Concentration
                  </label>
                  <span className="text-sm text-gray-500">
                    {acidConcentration} mol/L
                  </span>
                </div>
                <Slider
                  value={[acidConcentration * 100]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    setAcidConcentration(value[0] / 100)
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Base Concentration
                  </label>
                  <span className="text-sm text-gray-500">
                    {baseConcentration} mol/L
                  </span>
                </div>
                <Slider
                  value={[baseConcentration * 100]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    setBaseConcentration(value[0] / 100)
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Acid Volume</label>
                  <span className="text-sm text-gray-500">{acidVolume} mL</span>
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
                  <label className="text-sm font-medium">Drop Size</label>
                  <span className="text-sm text-gray-500">{dropSize} mL</span>
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
                <label className="text-sm font-medium">Indicator</label>
                <Select value={indicator} onValueChange={setIndicator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an indicator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phenolphthalein">
                      Phenolphthalein (8.2-10.0)
                    </SelectItem>
                    <SelectItem value="methylOrange">
                      Methyl Orange (3.1-4.4)
                    </SelectItem>
                    <SelectItem value="bromothymolBlue">
                      Bromothymol Blue (6.0-7.6)
                    </SelectItem>
                    <SelectItem value="universalIndicator">
                      Universal Indicator (0-14)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md bg-green-50 p-4">
                <h3 className="mb-2 font-medium">Theory</h3>
                <p className="text-sm text-gray-700">
                  Titration is used to determine the concentration of an acid or
                  base by neutralizing it with a base or acid of known
                  concentration.
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  The equivalence point occurs when the moles of acid equal the
                  moles of base:
                </p>
                <div className="my-2 text-center font-mono">
                  M<sub>acid</sub> × V<sub>acid</sub> = M<sub>base</sub> × V
                  <sub>base</sub>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
