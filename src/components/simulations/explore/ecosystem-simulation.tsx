"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Plus, Minus, Sun } from "lucide-react";

export default function EcosystemSimulation() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [ecosystemType, setEcosystemType] = useState("pond");
  const [time, setTime] = useState(0); // 0-24 hours
  const [temperature, setTemperature] = useState(25);
  const [precipitation, setPrecipitation] = useState(0);
  const [sunlight, setSunlight] = useState(100);
  const [organisms, setOrganisms] = useState({
    producers: 10,
    herbivores: 5,
    carnivores: 2,
    decomposers: 8,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ecosystems = {
    pond: {
      name: "Freshwater Pond",
      description:
        "A small body of still freshwater with diverse aquatic life.",
      producers: ["Algae", "Water Lilies", "Duckweed"],
      herbivores: ["Tadpoles", "Small Fish", "Water Insects"],
      carnivores: ["Large Fish", "Frogs", "Water Snakes"],
      decomposers: ["Bacteria", "Fungi", "Detritivores"],
    },
    forest: {
      name: "Temperate Forest",
      description: "A forest with deciduous trees and seasonal changes.",
      producers: ["Oak Trees", "Maple Trees", "Ferns"],
      herbivores: ["Deer", "Rabbits", "Squirrels"],
      carnivores: ["Wolves", "Foxes", "Hawks"],
      decomposers: ["Mushrooms", "Beetles", "Worms"],
    },
    desert: {
      name: "Desert",
      description:
        "An arid ecosystem with extreme temperatures and specialized organisms.",
      producers: ["Cacti", "Desert Grasses", "Shrubs"],
      herbivores: ["Kangaroo Rats", "Rabbits", "Insects"],
      carnivores: ["Coyotes", "Snakes", "Eagles"],
      decomposers: ["Bacteria", "Fungi", "Beetles"],
    },
  };

  const toggleSimulation = () => {
    setRunning(!running);
  };

  const resetSimulation = () => {
    setRunning(false);
    setTime(0);
    setTemperature(25);
    setPrecipitation(0);
    setSunlight(100);
    setOrganisms({
      producers: 10,
      herbivores: 5,
      carnivores: 2,
      decomposers: 8,
    });
  };

  const adjustPopulation = (type: keyof typeof organisms, amount: number) => {
    setOrganisms((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + amount),
    }));
  };

  // Simulation logic
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      // Update time (day/night cycle)
      setTime((prev) => (prev + speed / 10) % 24);

      // Update environmental factors based on time
      const newSunlight = Math.sin((time / 24) * Math.PI * 2) * 50 + 50;
      setSunlight(newSunlight);

      // Temperature fluctuates with time
      const baseTemp =
        ecosystemType === "desert" ? 35 : ecosystemType === "forest" ? 20 : 25;
      const newTemp = baseTemp + Math.sin((time / 24) * Math.PI * 2) * 10;
      setTemperature(newTemp);

      // Random precipitation events
      if (Math.random() < 0.01 * speed) {
        const precipAmount =
          ecosystemType === "desert" ? 5 : ecosystemType === "forest" ? 20 : 15;
        setPrecipitation(precipAmount);
      } else {
        setPrecipitation((prev) => Math.max(0, prev - 1 * speed));
      }

      // Update populations based on environmental factors and interactions
      setOrganisms((prev) => {
        // Growth rates
        const producerGrowth =
          (sunlight / 100) * (0.1 * speed) * (precipitation > 0 ? 1.2 : 0.8);
        const herbivoreGrowth = (prev.producers / 20) * (0.05 * speed);
        const carnivoreGrowth = (prev.herbivores / 10) * (0.02 * speed);
        const decomposerGrowth = 0.03 * speed;

        // Consumption rates
        const producerConsumption = (prev.herbivores / 10) * (0.2 * speed);
        const herbivoreConsumption = (prev.carnivores / 5) * (0.3 * speed);

        // Death rates
        const producerDeath = 0.01 * speed;
        const herbivoreDeath = 0.02 * speed;
        const carnivoreDeath = 0.03 * speed;
        const decomposerDeath = 0.01 * speed;

        return {
          producers: Math.max(
            0,
            prev.producers +
              prev.producers * producerGrowth -
              prev.producers * producerConsumption -
              prev.producers * producerDeath,
          ),
          herbivores: Math.max(
            0,
            prev.herbivores +
              prev.herbivores * herbivoreGrowth -
              prev.herbivores * herbivoreConsumption -
              prev.herbivores * herbivoreDeath,
          ),
          carnivores: Math.max(
            0,
            prev.carnivores +
              prev.carnivores * carnivoreGrowth -
              prev.carnivores * carnivoreDeath,
          ),
          decomposers: Math.max(
            0,
            prev.decomposers +
              prev.decomposers * decomposerGrowth -
              prev.decomposers * decomposerDeath,
          ),
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    running,
    speed,
    time,
    ecosystemType,
    sunlight,
    temperature,
    precipitation,
    organisms,
  ]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background based on ecosystem type
    const drawBackground = () => {
      if (ecosystemType === "pond") {
        // Draw sky
        const skyGradient = ctx.createLinearGradient(
          0,
          0,
          0,
          canvas.height * 0.4,
        );
        skyGradient.addColorStop(0, `rgba(135, 206, 235, ${sunlight / 100})`);
        skyGradient.addColorStop(1, `rgba(255, 255, 255, ${sunlight / 100})`);
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);

        // Draw water
        const waterGradient = ctx.createLinearGradient(
          0,
          canvas.height * 0.4,
          0,
          canvas.height,
        );
        waterGradient.addColorStop(0, "rgba(64, 164, 223, 0.8)");
        waterGradient.addColorStop(1, "rgba(0, 51, 102, 0.9)");
        ctx.fillStyle = waterGradient;
        ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.6);
      } else if (ecosystemType === "forest") {
        // Draw sky
        const skyGradient = ctx.createLinearGradient(
          0,
          0,
          0,
          canvas.height * 0.7,
        );
        skyGradient.addColorStop(0, `rgba(135, 206, 235, ${sunlight / 100})`);
        skyGradient.addColorStop(1, `rgba(255, 255, 255, ${sunlight / 100})`);
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);

        // Draw ground
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

        // Draw grass
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(
          0,
          canvas.height * 0.7,
          canvas.width,
          canvas.height * 0.05,
        );
      } else if (ecosystemType === "desert") {
        // Draw sky
        const skyGradient = ctx.createLinearGradient(
          0,
          0,
          0,
          canvas.height * 0.7,
        );
        skyGradient.addColorStop(0, `rgba(135, 206, 235, ${sunlight / 100})`);
        skyGradient.addColorStop(1, `rgba(255, 255, 255, ${sunlight / 100})`);
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);

        // Draw sand
        ctx.fillStyle = "#e6c35c";
        ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
      }
    };

    // Draw sun/moon
    const drawCelestialBody = () => {
      const x = canvas.width * 0.8;
      const y = canvas.height * 0.2;
      const radius = 30;

      if (time >= 6 && time <= 18) {
        // Draw sun
        const brightness = Math.sin(((time - 6) / 12) * Math.PI) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 0, ${brightness})`;
        ctx.fill();
      } else {
        // Draw moon
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240, 240, 240, 0.8)";
        ctx.fill();
      }
    };

    // Draw precipitation
    const drawPrecipitation = () => {
      if (precipitation <= 0) return;

      ctx.fillStyle = "rgba(120, 180, 255, 0.5)";

      for (let i = 0; i < precipitation * 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.7;
        const width = 1;
        const height = 10;

        ctx.fillRect(x, y, width, height);
      }
    };

    // Draw organisms
    const drawOrganisms = () => {
      // Scale organism counts for display
      const maxCount = Math.max(
        organisms.producers,
        organisms.herbivores,
        organisms.carnivores,
        organisms.decomposers,
      );
      const scaleFactor = 50 / maxCount;

      // Draw producers
      const producerCount = Math.round(organisms.producers * scaleFactor);
      ctx.fillStyle = "#4caf50"; // Green

      if (ecosystemType === "pond") {
        // Draw water plants
        for (let i = 0; i < producerCount; i++) {
          const x = Math.random() * canvas.width;
          const y = canvas.height * 0.4 + Math.random() * canvas.height * 0.5;
          const size = 5 + Math.random() * 10;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Draw land plants
        for (let i = 0; i < producerCount; i++) {
          const x = Math.random() * canvas.width;
          const y = canvas.height * 0.7 - Math.random() * 50;
          const width = 10 + Math.random() * 20;
          const height = 30 + Math.random() * 50;

          ctx.fillRect(x, y, width, height);
        }
      }

      // Draw herbivores
      const herbivoreCount = Math.round(organisms.herbivores * scaleFactor);
      ctx.fillStyle = "#2196f3"; // Blue

      for (let i = 0; i < herbivoreCount; i++) {
        const x = Math.random() * canvas.width;
        const y =
          ecosystemType === "pond"
            ? canvas.height * 0.4 + Math.random() * canvas.height * 0.5
            : canvas.height * 0.7 - Math.random() * 30;
        const size = 4 + Math.random() * 6;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw carnivores
      const carnivoreCount = Math.round(organisms.carnivores * scaleFactor);
      ctx.fillStyle = "#f44336"; // Red

      for (let i = 0; i < carnivoreCount; i++) {
        const x = Math.random() * canvas.width;
        const y =
          ecosystemType === "pond"
            ? canvas.height * 0.4 + Math.random() * canvas.height * 0.5
            : canvas.height * 0.7 - Math.random() * 40;
        const size = 6 + Math.random() * 8;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw decomposers
      const decomposerCount = Math.round(organisms.decomposers * scaleFactor);
      ctx.fillStyle = "#9c27b0"; // Purple

      for (let i = 0; i < decomposerCount; i++) {
        const x = Math.random() * canvas.width;
        const y =
          ecosystemType === "pond"
            ? canvas.height * 0.9 + Math.random() * canvas.height * 0.1
            : canvas.height * 0.7 + Math.random() * canvas.height * 0.3;
        const size = 2 + Math.random() * 3;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Draw information
    const drawInformation = () => {
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        `Time: ${Math.floor(time)}:${Math.floor((time % 1) * 60)
          .toString()
          .padStart(2, "0")}`,
        20,
        30,
      );
      ctx.fillText(`Temperature: ${temperature.toFixed(1)}°C`, 20, 50);
      ctx.fillText(`Sunlight: ${sunlight.toFixed(0)}%`, 20, 70);
      ctx.fillText(`Precipitation: ${precipitation.toFixed(1)} mm`, 20, 90);
    };

    // Draw legend
    const drawLegend = () => {
      const legendX = canvas.width - 150;
      const legendY = 30;

      ctx.font = "12px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Legend:", legendX, legendY);

      // Producers
      ctx.fillStyle = "#4caf50";
      ctx.beginPath();
      ctx.arc(legendX + 10, legendY + 20, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333";
      ctx.fillText("Producers", legendX + 20, legendY + 25);

      // Herbivores
      ctx.fillStyle = "#2196f3";
      ctx.beginPath();
      ctx.arc(legendX + 10, legendY + 40, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333";
      ctx.fillText("Herbivores", legendX + 20, legendY + 45);

      // Carnivores
      ctx.fillStyle = "#f44336";
      ctx.beginPath();
      ctx.arc(legendX + 10, legendY + 60, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333";
      ctx.fillText("Carnivores", legendX + 20, legendY + 65);

      // Decomposers
      ctx.fillStyle = "#9c27b0";
      ctx.beginPath();
      ctx.arc(legendX + 10, legendY + 80, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333";
      ctx.fillText("Decomposers", legendX + 20, legendY + 85);
    };

    // Execute all drawing functions
    drawBackground();
    drawCelestialBody();
    drawPrecipitation();
    drawOrganisms();
    drawInformation();
    drawLegend();
  }, [ecosystemType, time, temperature, precipitation, sunlight, organisms]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-semibold">Ecosystem Simulation</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleSimulation}>
              {running ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {running ? "Pause" : "Start"}
            </Button>
            <Button variant="outline" size="sm" onClick={resetSimulation}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <Tabs
          value={ecosystemType}
          onValueChange={(value) => {
            setEcosystemType(value);
            resetSimulation();
          }}
        >
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="pond">Pond</TabsTrigger>
            <TabsTrigger value="forest">Forest</TabsTrigger>
            <TabsTrigger value="desert">Desert</TabsTrigger>
          </TabsList>

          <div
            className="relative overflow-hidden rounded-lg bg-gray-50"
            style={{ height: "400px" }}
          >
            <canvas ref={canvasRef} className="h-full w-full" />

            {!running && (
              <div className="text-muted-foreground absolute inset-0 flex items-center justify-center bg-white/50">
                Start the simulation to view ecosystem dynamics
              </div>
            )}
          </div>
        </Tabs>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Simulation Speed</label>
              <span className="text-sm">{speed}x</span>
            </div>
            <Slider
              value={[speed]}
              min={0.5}
              max={3}
              step={0.5}
              onValueChange={(value) => setSpeed(value[0])}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Sun className="h-4 w-4" />
            </Button>
            <Slider
              value={[sunlight]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setSunlight(value[0])}
              disabled={running}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Ecosystem Information</h3>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="text-md mb-2 font-semibold">
              {ecosystems[ecosystemType as keyof typeof ecosystems].name}
            </h4>
            <p className="text-sm">
              {ecosystems[ecosystemType as keyof typeof ecosystems].description}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Population Controls</h4>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between rounded-lg border p-2">
                <span className="text-sm">Producers</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustPopulation("producers", -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {Math.round(organisms.producers)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustPopulation("producers", 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-2">
                <span className="text-sm">Herbivores</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustPopulation("herbivores", -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {Math.round(organisms.herbivores)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustPopulation("herbivores", 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-2">
                <span className="text-sm">Carnivores</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustPopulation("carnivores", -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {Math.round(organisms.carnivores)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustPopulation("carnivores", 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-2">
                <span className="text-sm">Decomposers</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustPopulation("decomposers", -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {Math.round(organisms.decomposers)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => adjustPopulation("decomposers", 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Organisms</h4>

            <div className="space-y-1">
              <div className="text-xs font-medium">Producers</div>
              <ul className="list-disc pl-4 text-xs">
                {ecosystems[
                  ecosystemType as keyof typeof ecosystems
                ].producers.map((producer, index) => (
                  <li key={index}>{producer}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium">Herbivores</div>
              <ul className="list-disc pl-4 text-xs">
                {ecosystems[
                  ecosystemType as keyof typeof ecosystems
                ].herbivores.map((herbivore, index) => (
                  <li key={index}>{herbivore}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium">Carnivores</div>
              <ul className="list-disc pl-4 text-xs">
                {ecosystems[
                  ecosystemType as keyof typeof ecosystems
                ].carnivores.map((carnivore, index) => (
                  <li key={index}>{carnivore}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium">Decomposers</div>
              <ul className="list-disc pl-4 text-xs">
                {ecosystems[
                  ecosystemType as keyof typeof ecosystems
                ].decomposers.map((decomposer, index) => (
                  <li key={index}>{decomposer}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
