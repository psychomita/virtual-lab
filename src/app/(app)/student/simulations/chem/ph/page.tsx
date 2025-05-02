"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Solution types
type Solution = {
  id: string;
  name: string;
  type: "acid" | "base" | "salt" | "buffer";
  concentration: number;
  volume: number;
  pH: number;
  color: string;
};

// Indicator types
type Indicator = {
  name: string;
  range: [number, number];
  acidColor: string;
  baseColor: string;
};

export default function PHMeasurementSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [solutions, setSolutions] = useState<Solution[]>([
    {
      id: "sol1",
      name: "Hydrochloric Acid",
      type: "acid",
      concentration: 0.1,
      volume: 100,
      pH: 1,
      color: "#f8fafc",
    },
  ]);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(
    "sol1",
  );
  const [mixedSolution, setMixedSolution] = useState<Solution | null>(null);
  const [selectedIndicator, setSelectedIndicator] =
    useState<string>("universal");
  const [newSolutionName, setNewSolutionName] = useState("");
  const [newSolutionType, setNewSolutionType] = useState<
    "acid" | "base" | "salt" | "buffer"
  >("acid");
  const [newSolutionConcentration, setNewSolutionConcentration] = useState(0.1);
  const [newSolutionVolume, setNewSolutionVolume] = useState(100);
  const [phMeterReading, setPhMeterReading] = useState<number | null>(null);
  const [showPhMeter, setShowPhMeter] = useState(false);

  // Indicators
  const indicators: { [key: string]: Indicator } = {
    universal: {
      name: "Universal Indicator",
      range: [0, 14],
      acidColor: "#ff0000",
      baseColor: "#800080",
    },
    phenolphthalein: {
      name: "Phenolphthalein",
      range: [8.2, 10.0],
      acidColor: "transparent",
      baseColor: "#ff69b4",
    },
    methylOrange: {
      name: "Methyl Orange",
      range: [3.1, 4.4],
      acidColor: "#ff4500",
      baseColor: "#ffff00",
    },
    bromothymolBlue: {
      name: "Bromothymol Blue",
      range: [6.0, 7.6],
      acidColor: "#ffff00",
      baseColor: "#0000ff",
    },
    litmus: {
      name: "Litmus",
      range: [4.5, 8.3],
      acidColor: "#ff0000",
      baseColor: "#0000ff",
    },
  };

  // Calculate pH based on solution type and concentration
  const calculatePH = (type: string, concentration: number): number => {
    switch (type) {
      case "acid":
        return -Math.log10(concentration);
      case "base":
        return 14 + Math.log10(concentration);
      case "salt":
        return 7;
      case "buffer":
        return 7;
      default:
        return 7;
    }
  };

  // Add a new solution
  const addSolution = () => {
    if (!newSolutionName) return;

    const pH = calculatePH(newSolutionType, newSolutionConcentration);
    const newSolution: Solution = {
      id: `sol-${Date.now()}`,
      name: newSolutionName,
      type: newSolutionType,
      concentration: newSolutionConcentration,
      volume: newSolutionVolume,
      pH,
      color: getSolutionColor(pH, "universal"),
    };

    setSolutions([...solutions, newSolution]);
    setSelectedSolution(newSolution.id);
    setNewSolutionName("");
  };

  // Remove selected solution
  const removeSolution = () => {
    if (!selectedSolution) return;

    const updatedSolutions = solutions.filter(
      (sol) => sol.id !== selectedSolution,
    );
    setSolutions(updatedSolutions);
    setSelectedSolution(
      updatedSolutions.length > 0 ? updatedSolutions[0].id : null,
    );
  };

  // Mix solutions
  const mixSolutions = () => {
    if (solutions.length < 2) return;

    // Calculate mixed pH using a simplified approach
    // In reality, this would involve more complex acid-base equilibrium calculations

    let totalMoles = 0;
    let totalVolume = 0;

    // Calculate total moles of H+ or OH-
    for (const solution of solutions) {
      totalVolume += solution.volume;

      if (solution.type === "acid") {
        // For acids, calculate moles of H+
        totalMoles += (solution.concentration * solution.volume) / 1000;
      } else if (solution.type === "base") {
        // For bases, calculate moles of OH- (negative for neutralization)
        totalMoles -= (solution.concentration * solution.volume) / 1000;
      }
      // Salts and buffers are assumed neutral in this simplified model
    }

    // Calculate resulting concentration
    const resultingConcentration = Math.abs(totalMoles) / (totalVolume / 1000);

    // Calculate pH
    let resultingPH;
    if (totalMoles > 0) {
      // Net acidic
      resultingPH = -Math.log10(resultingConcentration);
    } else if (totalMoles < 0) {
      // Net basic
      resultingPH = 14 + Math.log10(resultingConcentration);
    } else {
      // Neutral
      resultingPH = 7;
    }

    // Clamp pH between 0 and 14
    resultingPH = Math.max(0, Math.min(14, resultingPH));

    // Create mixed solution
    const mixedSol: Solution = {
      id: "mixed",
      name: "Mixed Solution",
      type: totalMoles > 0 ? "acid" : totalMoles < 0 ? "base" : "salt",
      concentration: resultingConcentration,
      volume: totalVolume,
      pH: resultingPH,
      color: getSolutionColor(resultingPH, selectedIndicator),
    };

    setMixedSolution(mixedSol);
    setPhMeterReading(resultingPH);
  };

  // Get solution color based on pH and indicator
  const getSolutionColor = (pH: number, indicatorName: string): string => {
    const indicator = indicators[indicatorName];
    if (!indicator) return "#f8fafc"; // Default transparent

    if (indicatorName === "universal") {
      // Universal indicator has a spectrum of colors
      if (pH <= 3) return "#ff0000"; // Red
      if (pH <= 4) return "#ff4500"; // Orange-red
      if (pH <= 5) return "#ffa500"; // Orange
      if (pH <= 6) return "#ffff00"; // Yellow
      if (pH <= 7.5) return "#00ff00"; // Green
      if (pH <= 9) return "#0000ff"; // Blue
      if (pH <= 11) return "#4b0082"; // Indigo
      return "#800080"; // Purple
    }

    // Other indicators have two colors with a transition range
    if (pH < indicator.range[0]) {
      return indicator.acidColor;
    } else if (pH > indicator.range[1]) {
      return indicator.baseColor;
    } else {
      // In transition range - blend colors
      const ratio =
        (pH - indicator.range[0]) / (indicator.range[1] - indicator.range[0]);
      return blendColors(indicator.acidColor, indicator.baseColor, ratio);
    }
  };

  // Helper function to blend colors
  const blendColors = (
    color1: string,
    color2: string,
    ratio: number,
  ): string => {
    // Handle transparent color
    if (color1 === "transparent")
      return color2 === "transparent" ? "#f8fafc" : color2;
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

  // Update solution when parameters change
  const updateSolution = (property: string, value: any) => {
    if (!selectedSolution) return;

    setSolutions(
      solutions.map((sol) => {
        if (sol.id === selectedSolution) {
          if (property === "concentration") {
            const newConcentration = Number(value);
            const newPH = calculatePH(sol.type, newConcentration);
            return {
              ...sol,
              concentration: newConcentration,
              pH: newPH,
              color: getSolutionColor(newPH, selectedIndicator),
            };
          } else if (property === "volume") {
            return { ...sol, volume: Number(value) };
          } else if (property === "type") {
            const newType = value as "acid" | "base" | "salt" | "buffer";
            const newPH = calculatePH(newType, sol.concentration);
            return {
              ...sol,
              type: newType,
              pH: newPH,
              color: getSolutionColor(newPH, selectedIndicator),
            };
          }
        }
        return sol;
      }),
    );
  };

  // Change indicator
  useEffect(() => {
    // Update solution colors when indicator changes
    setSolutions(
      solutions.map((sol) => ({
        ...sol,
        color: getSolutionColor(sol.pH, selectedIndicator),
      })),
    );

    if (mixedSolution) {
      setMixedSolution({
        ...mixedSolution,
        color: getSolutionColor(mixedSolution.pH, selectedIndicator),
      });
    }
  }, [selectedIndicator]);

  // Draw the simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw beakers with solutions
    const beakerWidth = 80;
    const beakerHeight = 120;
    const beakerSpacing = 20;
    const beakerBottom = 300;

    // Draw individual solution beakers
    solutions.forEach((solution, index) => {
      const x = 50 + index * (beakerWidth + beakerSpacing);
      const y = beakerBottom - beakerHeight;

      // Draw beaker
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + beakerHeight);
      ctx.lineTo(x + beakerWidth, y + beakerHeight);
      ctx.lineTo(x + beakerWidth, y);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw solution
      const solutionHeight = (solution.volume / 100) * (beakerHeight - 10);
      ctx.fillStyle =
        solution.color === "transparent" ? "#f8fafc" : solution.color;
      ctx.fillRect(
        x + 2,
        y + beakerHeight - solutionHeight,
        beakerWidth - 4,
        solutionHeight,
      );

      // Highlight selected solution
      if (solution.id === selectedSolution) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 5, y - 5, beakerWidth + 10, beakerHeight + 10);
      }

      // Draw solution name
      ctx.fillStyle = "#000000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(solution.name, x + beakerWidth / 2, y + beakerHeight + 20);

      // Draw pH value
      ctx.fillText(
        `pH: ${solution.pH.toFixed(2)}`,
        x + beakerWidth / 2,
        y + beakerHeight + 40,
      );
    });

    // Draw mixed solution beaker if exists
    if (mixedSolution) {
      const x = canvas.width - 150;
      const y = beakerBottom - beakerHeight;

      // Draw beaker
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + beakerHeight);
      ctx.lineTo(x + beakerWidth, y + beakerHeight);
      ctx.lineTo(x + beakerWidth, y);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw solution
      const solutionHeight =
        (mixedSolution.volume /
          solutions.reduce((sum, sol) => sum + sol.volume, 0)) *
        (beakerHeight - 10);
      ctx.fillStyle =
        mixedSolution.color === "transparent" ? "#f8fafc" : mixedSolution.color;
      ctx.fillRect(
        x + 2,
        y + beakerHeight - solutionHeight,
        beakerWidth - 4,
        solutionHeight,
      );

      // Draw solution name
      ctx.fillStyle = "#000000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        mixedSolution.name,
        x + beakerWidth / 2,
        y + beakerHeight + 20,
      );

      // Draw pH value
      ctx.fillText(
        `pH: ${mixedSolution.pH.toFixed(2)}`,
        x + beakerWidth / 2,
        y + beakerHeight + 40,
      );

      // Draw pH meter if enabled
      if (showPhMeter && phMeterReading !== null) {
        // Draw pH meter
        ctx.beginPath();
        ctx.moveTo(x + beakerWidth / 2, y - 50);
        ctx.lineTo(x + beakerWidth / 2, y + beakerHeight - solutionHeight / 2);
        ctx.strokeStyle = "#666666";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw pH meter display
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + beakerWidth / 2 - 25, y - 80, 50, 30);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(x + beakerWidth / 2 - 25, y - 80, 50, 30);

        // Draw pH reading
        ctx.fillStyle = "#ff0000";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(phMeterReading.toFixed(2), x + beakerWidth / 2, y - 60);
      }
    }

    // Draw pH scale
    const scaleX = 50;
    const scaleY = 50;
    const scaleWidth = 300;
    const scaleHeight = 30;

    // Draw scale background
    const gradient = ctx.createLinearGradient(
      scaleX,
      scaleY,
      scaleX + scaleWidth,
      scaleY,
    );
    gradient.addColorStop(0, "#ff0000"); // Red (pH 0)
    gradient.addColorStop(0.2, "#ffa500"); // Orange (pH 3)
    gradient.addColorStop(0.4, "#ffff00"); // Yellow (pH 6)
    gradient.addColorStop(0.5, "#00ff00"); // Green (pH 7)
    gradient.addColorStop(0.6, "#0000ff"); // Blue (pH 8)
    gradient.addColorStop(0.8, "#4b0082"); // Indigo (pH 11)
    gradient.addColorStop(1, "#800080"); // Purple (pH 14)

    ctx.fillStyle = gradient;
    ctx.fillRect(scaleX, scaleY, scaleWidth, scaleHeight);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(scaleX, scaleY, scaleWidth, scaleHeight);

    // Draw pH values
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    for (let i = 0; i <= 14; i += 2) {
      const x = scaleX + (i / 14) * scaleWidth;
      ctx.beginPath();
      ctx.moveTo(x, scaleY + scaleHeight);
      ctx.lineTo(x, scaleY + scaleHeight + 5);
      ctx.stroke();
      ctx.fillText(i.toString(), x, scaleY + scaleHeight + 20);
    }

    // Draw scale title
    ctx.font = "14px Arial";
    ctx.fillText("pH Scale", scaleX + scaleWidth / 2, scaleY - 10);

    // Draw indicator information
    const indicator = indicators[selectedIndicator];
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText(
      `Indicator: ${indicator.name}`,
      scaleX,
      scaleY + scaleHeight + 40,
    );

    // Draw indicator color range
    if (selectedIndicator !== "universal") {
      ctx.fillText(
        `Range: pH ${indicator.range[0]} - ${indicator.range[1]}`,
        scaleX,
        scaleY + scaleHeight + 60,
      );

      // Draw acid color
      ctx.fillStyle =
        indicator.acidColor === "transparent" ? "#f8fafc" : indicator.acidColor;
      ctx.fillRect(scaleX + 200, scaleY + scaleHeight + 30, 20, 20);
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(scaleX + 200, scaleY + scaleHeight + 30, 20, 20);
      ctx.fillStyle = "#000000";
      ctx.fillText("Acid", scaleX + 230, scaleY + scaleHeight + 45);

      // Draw base color
      ctx.fillStyle =
        indicator.baseColor === "transparent" ? "#f8fafc" : indicator.baseColor;
      ctx.fillRect(scaleX + 200, scaleY + scaleHeight + 60, 20, 20);
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(scaleX + 200, scaleY + scaleHeight + 60, 20, 20);
      ctx.fillStyle = "#000000";
      ctx.fillText("Base", scaleX + 230, scaleY + scaleHeight + 75);
    }
  }, [
    solutions,
    selectedSolution,
    mixedSolution,
    selectedIndicator,
    showPhMeter,
    phMeterReading,
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/student/simulations/chem">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">pH Measurement Simulation</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>pH Visualization</CardTitle>
              <CardDescription>
                Observe how different solutions affect pH and indicator colors
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="rounded-md border bg-gray-50"
              />

              <div className="mt-4 flex gap-4">
                <Button
                  onClick={mixSolutions}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Mix Solutions
                </Button>
                <Button
                  onClick={() => setShowPhMeter(!showPhMeter)}
                  variant={showPhMeter ? "default" : "outline"}
                >
                  {showPhMeter ? "Hide pH Meter" : "Show pH Meter"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Solution Controls</CardTitle>
              <CardDescription>
                Add and modify solutions to test pH changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Indicator Selection</h3>
                <Select
                  value={selectedIndicator}
                  onValueChange={setSelectedIndicator}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an indicator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="universal">
                      Universal Indicator
                    </SelectItem>
                    <SelectItem value="phenolphthalein">
                      Phenolphthalein (8.2-10.0)
                    </SelectItem>
                    <SelectItem value="methylOrange">
                      Methyl Orange (3.1-4.4)
                    </SelectItem>
                    <SelectItem value="bromothymolBlue">
                      Bromothymol Blue (6.0-7.6)
                    </SelectItem>
                    <SelectItem value="litmus">Litmus (4.5-8.3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Add New Solution</h3>
                <div className="space-y-2">
                  <Label htmlFor="solutionName">Solution Name</Label>
                  <Input
                    id="solutionName"
                    value={newSolutionName}
                    onChange={(e) => setNewSolutionName(e.target.value)}
                    placeholder="e.g., Acetic Acid"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solutionType">Solution Type</Label>
                  <Select
                    value={newSolutionType}
                    onValueChange={(value) => setNewSolutionType(value as any)}
                  >
                    <SelectTrigger id="solutionType">
                      <SelectValue placeholder="Select solution type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acid">Acid</SelectItem>
                      <SelectItem value="base">Base</SelectItem>
                      <SelectItem value="salt">Salt</SelectItem>
                      <SelectItem value="buffer">Buffer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="concentration">Concentration (mol/L)</Label>
                    <span className="text-sm text-gray-500">
                      {newSolutionConcentration}
                    </span>
                  </div>
                  <Slider
                    id="concentration"
                    value={[newSolutionConcentration]}
                    min={0.001}
                    max={1}
                    step={0.001}
                    onValueChange={(value) =>
                      setNewSolutionConcentration(value[0])
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="volume">Volume (mL)</Label>
                    <span className="text-sm text-gray-500">
                      {newSolutionVolume}
                    </span>
                  </div>
                  <Slider
                    id="volume"
                    value={[newSolutionVolume]}
                    min={10}
                    max={200}
                    step={10}
                    onValueChange={(value) => setNewSolutionVolume(value[0])}
                  />
                </div>

                <Button onClick={addSolution} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Solution
                </Button>
              </div>

              {selectedSolution && (
                <div className="space-y-4">
                  <h3 className="font-medium">Selected Solution</h3>
                  <div className="space-y-2">
                    <Label>Solution Type</Label>
                    <Select
                      value={
                        solutions.find((s) => s.id === selectedSolution)
                          ?.type || "acid"
                      }
                      onValueChange={(value) => updateSolution("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acid">Acid</SelectItem>
                        <SelectItem value="base">Base</SelectItem>
                        <SelectItem value="salt">Salt</SelectItem>
                        <SelectItem value="buffer">Buffer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Concentration (mol/L)</Label>
                      <span className="text-sm text-gray-500">
                        {
                          solutions.find((s) => s.id === selectedSolution)
                            ?.concentration
                        }
                      </span>
                    </div>
                    <Slider
                      value={[
                        solutions.find((s) => s.id === selectedSolution)
                          ?.concentration || 0.1,
                      ]}
                      min={0.001}
                      max={1}
                      step={0.001}
                      onValueChange={(value) =>
                        updateSolution("concentration", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Volume (mL)</Label>
                      <span className="text-sm text-gray-500">
                        {
                          solutions.find((s) => s.id === selectedSolution)
                            ?.volume
                        }
                      </span>
                    </div>
                    <Slider
                      value={[
                        solutions.find((s) => s.id === selectedSolution)
                          ?.volume || 100,
                      ]}
                      min={10}
                      max={200}
                      step={10}
                      onValueChange={(value) =>
                        updateSolution("volume", value[0])
                      }
                    />
                  </div>

                  <Button
                    onClick={removeSolution}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Solution
                  </Button>
                </div>
              )}

              <div className="rounded-md bg-green-50 p-4">
                <h3 className="mb-2 font-medium">pH Scale</h3>
                <p className="mb-2 text-sm text-gray-700">
                  The pH scale measures how acidic or basic a solution is:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  <li>
                    <strong>pH 0-6:</strong> Acidic solutions (H+ ions)
                  </li>
                  <li>
                    <strong>pH 7:</strong> Neutral solutions
                  </li>
                  <li>
                    <strong>pH 8-14:</strong> Basic solutions (OH- ions)
                  </li>
                </ul>
                <p className="mt-2 text-sm text-gray-700">
                  Each pH unit represents a 10-fold change in H+ concentration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
