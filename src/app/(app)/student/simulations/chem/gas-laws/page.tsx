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
import { ArrowLeft, Play, Pause, RefreshCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Gas particle type
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

export default function GasLawsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedLaw, setSelectedLaw] = useState<
    "boyle" | "charles" | "gay-lussac" | "combined"
  >("boyle");
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [pressure, setPressure] = useState(1); // atm
  const [volume, setVolume] = useState(1); // L
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleCount, setParticleCount] = useState(100);
  const [containerWidth, setContainerWidth] = useState(300);
  const [containerHeight, setContainerHeight] = useState(300);
  const [gasType, setGasType] = useState<"air" | "helium" | "co2">("air");
  const [collisionCount, setCollisionCount] = useState(0);
  const [time, setTime] = useState(0);

  // Gas properties
  const gasProperties = {
    air: { color: "#a0a0a0", mass: 29, radius: 3 },
    helium: { color: "#ffff00", mass: 4, radius: 2 },
    co2: { color: "#808080", mass: 44, radius: 4 },
  };

  // Initialize particles
  useEffect(() => {
    resetSimulation();
  }, [particleCount, gasType]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Update time
      setTime((prevTime) => prevTime + deltaTime);

      // Update particles
      updateParticles(deltaTime);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, particles, temperature, containerWidth, containerHeight]);

  // Update particles
  const updateParticles = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate temperature effect on particle speed
    const tempFactor = Math.sqrt(temperature / 300);
    let newCollisionCount = collisionCount;

    // Update positions and handle collisions
    const newParticles = particles.map((particle) => {
      // Update position
      let x = particle.x + particle.vx * deltaTime * tempFactor;
      let y = particle.y + particle.vy * deltaTime * tempFactor;
      let vx = particle.vx;
      let vy = particle.vy;

      // Bounce off walls
      if (x - particle.radius < 50) {
        x = 50 + particle.radius;
        vx = -vx;
        newCollisionCount++;
      } else if (x + particle.radius > 50 + containerWidth) {
        x = 50 + containerWidth - particle.radius;
        vx = -vx;
        newCollisionCount++;
      }

      if (y - particle.radius < 50) {
        y = 50 + particle.radius;
        vy = -vy;
        newCollisionCount++;
      } else if (y + particle.radius > 50 + containerHeight) {
        y = 50 + containerHeight - particle.radius;
        vy = -vy;
        newCollisionCount++;
      }

      return { ...particle, x, y, vx, vy };
    });

    // Update state
    setParticles(newParticles);
    setCollisionCount(newCollisionCount);

    // Calculate pressure based on collisions
    const calculatedPressure =
      (newCollisionCount / (time + 1) / (containerWidth * containerHeight)) *
      10000;
    setPressure(calculatedPressure);
  };

  // Draw the simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw container
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, containerWidth, containerHeight);

    // Draw particles
    for (const particle of particles) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    }

    // Draw gas law information
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    let lawName = "";
    let lawEquation = "";
    let lawDescription = "";

    switch (selectedLaw) {
      case "boyle":
        lawName = "Boyle's Law";
        lawEquation = "P₁V₁ = P₂V₂ (at constant temperature)";
        lawDescription = "Pressure and volume are inversely proportional";
        break;
      case "charles":
        lawName = "Charles's Law";
        lawEquation = "V₁/T₁ = V₂/T₂ (at constant pressure)";
        lawDescription = "Volume and temperature are directly proportional";
        break;
      case "gay-lussac":
        lawName = "Gay-Lussac's Law";
        lawEquation = "P₁/T₁ = P₂/T₂ (at constant volume)";
        lawDescription = "Pressure and temperature are directly proportional";
        break;
      case "combined":
        lawName = "Combined Gas Law";
        lawEquation = "P₁V₁/T₁ = P₂V₂/T₂";
        lawDescription = "Relates pressure, volume, and temperature";
        break;
    }

    ctx.fillText(`${lawName}: ${lawEquation}`, 50, 10);
    ctx.fillText(lawDescription, 50, 30);

    // Draw measurements
    ctx.fillText(`Temperature: ${temperature.toFixed(0)} K`, 400, 50);
    ctx.fillText(`Pressure: ${pressure.toFixed(2)} atm`, 400, 70);
    ctx.fillText(
      `Volume: ${((containerWidth * containerHeight) / 10000).toFixed(2)} L`,
      400,
      90,
    );
    ctx.fillText(`Gas: ${gasType.toUpperCase()}`, 400, 110);
    ctx.fillText(`Particles: ${particles.length}`, 400, 130);
  }, [
    particles,
    selectedLaw,
    temperature,
    pressure,
    volume,
    containerWidth,
    containerHeight,
    gasType,
  ]);

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
    setCollisionCount(0);

    // Create new particles
    const newParticles: Particle[] = [];
    const gasProps = gasProperties[gasType];

    for (let i = 0; i < particleCount; i++) {
      // Random position within container
      const x =
        50 +
        gasProps.radius +
        Math.random() * (containerWidth - 2 * gasProps.radius);
      const y =
        50 +
        gasProps.radius +
        Math.random() * (containerHeight - 2 * gasProps.radius);

      // Random velocity
      const speed = 50 + Math.random() * 50;
      const angle = Math.random() * Math.PI * 2;
      const vx = speed * Math.cos(angle);
      const vy = speed * Math.sin(angle);

      newParticles.push({
        x,
        y,
        vx,
        vy,
        radius: gasProps.radius,
        color: gasProps.color,
      });
    }

    setParticles(newParticles);
    setIsRunning(true);
  };

  // Handle law selection
  const handleLawChange = (
    law: "boyle" | "charles" | "gay-lussac" | "combined",
  ) => {
    setSelectedLaw(law);

    // Reset to default values
    setTemperature(300);
    setPressure(1);
    setVolume(1);
    setContainerWidth(300);
    setContainerHeight(300);

    // Apply law-specific settings
    switch (law) {
      case "boyle":
        // For Boyle's Law, we'll vary volume while keeping temperature constant
        break;
      case "charles":
        // For Charles's Law, we'll vary temperature while keeping pressure constant
        break;
      case "gay-lussac":
        // For Gay-Lussac's Law, we'll vary temperature while keeping volume constant
        break;
      case "combined":
        // For Combined Gas Law, all variables can change
        break;
    }

    resetSimulation();
  };

  // Update container dimensions based on volume
  useEffect(() => {
    // Calculate container dimensions based on volume
    // We'll keep a square container for simplicity
    const size = Math.sqrt(volume * 10000);
    setContainerWidth(size);
    setContainerHeight(size);
  }, [volume]);

  // Handle temperature change
  const handleTemperatureChange = (newTemp: number) => {
    setTemperature(newTemp);

    // Apply gas law relationships
    if (selectedLaw === "charles") {
      // V ∝ T at constant pressure
      const newVolume = (newTemp / 300) * 1; // Initial volume is 1
      setVolume(newVolume);
    } else if (selectedLaw === "gay-lussac") {
      // P ∝ T at constant volume
      const newPressure = (newTemp / 300) * 1; // Initial pressure is 1
      setPressure(newPressure);
    } else if (selectedLaw === "combined") {
      // PV/T = constant
      const constant = (pressure * volume) / temperature;
      const newPressure = (constant * newTemp) / volume;
      setPressure(newPressure);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);

    // Apply gas law relationships
    if (selectedLaw === "boyle") {
      // P ∝ 1/V at constant temperature
      const newPressure = 1 / newVol; // Initial pressure is 1
      setPressure(newPressure);
    } else if (selectedLaw === "combined") {
      // PV/T = constant
      const constant = (pressure * volume) / temperature;
      const newPressure = (constant * temperature) / newVol;
      setPressure(newPressure);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/student/simulations/chem">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Gas Laws Simulation</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>Gas Behavior Simulation</CardTitle>
              <CardDescription>
                Observe how gas particles behave under different conditions
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
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {isRunning ? (
                    <Pause className="mr-2 h-4 w-4" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button onClick={resetSimulation} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Gas Law Controls</CardTitle>
              <CardDescription>
                Adjust parameters to observe different gas laws in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Select Gas Law</h3>
                <Tabs
                  defaultValue="boyle"
                  value={selectedLaw}
                  onValueChange={(value) => handleLawChange(value as any)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="boyle">Boyle's Law</TabsTrigger>
                    <TabsTrigger value="charles">Charles's Law</TabsTrigger>
                    <TabsTrigger value="gay-lussac">
                      Gay-Lussac's Law
                    </TabsTrigger>
                    <TabsTrigger value="combined">Combined Law</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gas Type</label>
                <Select value={gasType} onValueChange={setGasType as any}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gas type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air">Air</SelectItem>
                    <SelectItem value="helium">Helium</SelectItem>
                    <SelectItem value="co2">Carbon Dioxide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Number of Particles
                  </label>
                  <span className="text-sm text-gray-500">{particleCount}</span>
                </div>
                <Slider
                  value={[particleCount]}
                  min={50}
                  max={200}
                  step={10}
                  onValueChange={(value) => setParticleCount(value[0])}
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Temperature (K)</label>
                  <span className="text-sm text-gray-500">
                    {temperature.toFixed(0)} K
                  </span>
                </div>
                <Slider
                  value={[temperature]}
                  min={100}
                  max={1000}
                  step={10}
                  onValueChange={(value) => handleTemperatureChange(value[0])}
                  disabled={selectedLaw === "boyle"}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Volume (L)</label>
                  <span className="text-sm text-gray-500">
                    {volume.toFixed(2)} L
                  </span>
                </div>
                <Slider
                  value={[volume]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => handleVolumeChange(value[0])}
                  disabled={selectedLaw === "gay-lussac"}
                />
              </div>

              <div className="rounded-md bg-green-50 p-4">
                <h3 className="mb-2 font-medium">Gas Law Equations</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    <strong>Boyle's Law:</strong> P₁V₁ = P₂V₂
                    <p>
                      At constant temperature, pressure and volume are inversely
                      proportional.
                    </p>
                  </div>
                  <div>
                    <strong>Charles's Law:</strong> V₁/T₁ = V₂/T₂
                    <p>
                      At constant pressure, volume and temperature are directly
                      proportional.
                    </p>
                  </div>
                  <div>
                    <strong>Gay-Lussac's Law:</strong> P₁/T₁ = P₂/T₂
                    <p>
                      At constant volume, pressure and temperature are directly
                      proportional.
                    </p>
                  </div>
                  <div>
                    <strong>Combined Gas Law:</strong> P₁V₁/T₁ = P₂V₂/T₂
                    <p>Relates pressure, volume, and temperature changes.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-green-50 p-4">
                <h3 className="mb-2 font-medium">Kinetic Theory of Gases</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  <li>Gas particles are in constant, random motion</li>
                  <li>
                    Particles collide elastically with each other and container
                    walls
                  </li>
                  <li>Pressure results from particle collisions with walls</li>
                  <li>
                    Temperature is proportional to average kinetic energy of
                    particles
                  </li>
                  <li>Volume is the space available for particles to move</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
