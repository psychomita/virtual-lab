"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Play, RotateCcw, Download, LineChart } from "lucide-react";
import ChemistrySimulation from "@/components/simulations/explore/chemistry-simulation";
import DataAnalysis from "@/components/simulations/explore/data-analysis";

export default function ChemistryLab() {
  const [activeTab, setActiveTab] = useState("experiment");
  const [experimentRunning, setExperimentRunning] = useState(false);
  const [experimentData, setExperimentData] = useState<number[]>([]);
  const [temperature, setTemperature] = useState(25);
  const [chemical, setChemical] = useState("hcl");
  const [concentration, setConcentration] = useState(1);

  // Simulate experiment data collection
  useEffect(() => {
    if (experimentRunning) {
      const interval = setInterval(() => {
        setExperimentData((prev) => {
          // Generate realistic data based on experiment parameters
          const newDataPoint =
            Math.sin(prev.length * 0.1) * concentration * (temperature / 25) +
            Math.random() * 0.5;
          return [...prev, newDataPoint];
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [experimentRunning, temperature, concentration]);

  const startExperiment = () => {
    setExperimentData([]);
    setExperimentRunning(true);
  };

  const stopExperiment = () => {
    setExperimentRunning(false);
  };

  const resetExperiment = () => {
    setExperimentRunning(false);
    setExperimentData([]);
    setTemperature(25);
    setChemical("hcl");
    setConcentration(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Chemistry Virtual Laboratory</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Experiment Controls</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Chemical Solution</label>
                <Select
                  value={chemical}
                  onValueChange={setChemical}
                  disabled={experimentRunning}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chemical" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hcl">Hydrochloric Acid (HCl)</SelectItem>
                    <SelectItem value="naoh">
                      Sodium Hydroxide (NaOH)
                    </SelectItem>
                    <SelectItem value="h2so4">Sulfuric Acid (H₂SO₄)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Concentration (mol/L)
                  </label>
                  <span className="text-sm">
                    {concentration.toFixed(1)} mol/L
                  </span>
                </div>
                <Slider
                  value={[concentration]}
                  min={0.1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setConcentration(value[0])}
                  disabled={experimentRunning}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Temperature (°C)
                  </label>
                  <span className="text-sm">{temperature}°C</span>
                </div>
                <Slider
                  value={[temperature]}
                  min={5}
                  max={100}
                  step={1}
                  onValueChange={(value) => setTemperature(value[0])}
                  disabled={experimentRunning}
                />
              </div>

              <div className="flex flex-col gap-2 pt-4">
                {!experimentRunning ? (
                  <Button onClick={startExperiment}>
                    <Play className="mr-2 h-4 w-4" /> Start Experiment
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={stopExperiment}>
                    Stop Experiment
                  </Button>
                )}
                <Button variant="outline" onClick={resetExperiment}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="experiment">Experiment View</TabsTrigger>
              <TabsTrigger value="analysis">Data Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="experiment" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <ChemistrySimulation
                    chemical={chemical}
                    concentration={concentration}
                    temperature={temperature}
                    running={experimentRunning}
                    data={experimentData}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analysis" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-medium">
                      Reaction Data Analysis
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={experimentData.length === 0}
                    >
                      <Download className="mr-2 h-4 w-4" /> Export Data
                    </Button>
                  </div>
                  <DataAnalysis data={experimentData} />
                  {experimentData.length === 0 && (
                    <div className="text-muted-foreground flex h-[300px] flex-col items-center justify-center">
                      <LineChart className="mb-2 h-12 w-12 opacity-20" />
                      <p>Run the experiment to collect data for analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
