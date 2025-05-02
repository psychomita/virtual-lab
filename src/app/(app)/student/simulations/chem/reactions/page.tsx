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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Reaction types
type Particle = {
  id: string;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  energy: number;
  reacted?: boolean;
};

type Reaction = {
  name: string;
  description: string;
  reactants: string[];
  products: string[];
  activationEnergy: number;
  exothermic: boolean;
  reactionEnergy: number;
  particleTypes: {
    [key: string]: {
      radius: number;
      color: string;
      mass: number;
    };
  };
};

export default function ChemicalReactionsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedReaction, setSelectedReaction] =
    useState<string>("combustion");
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [particles, setParticles] = useState<Particle[]>([]);
  const [reactionCount, setReactionCount] = useState(0);
  const [showEnergyProfile, setShowEnergyProfile] = useState(true);
  const [showParticleLabels, setShowParticleLabels] = useState(true);
  const [particleCount, setParticleCount] = useState(20);
  const [time, setTime] = useState(0);
  const [reactionProgress, setReactionProgress] = useState(0);

  // Reaction library
  const reactions: { [key: string]: Reaction } = {
    combustion: {
      name: "Combustion of Methane",
      description: "CH₄ + 2O₂ → CO₂ + 2H₂O",
      reactants: ["CH4", "O2"],
      products: ["CO2", "H2O"],
      activationEnergy: 50,
      exothermic: true,
      reactionEnergy: -80,
      particleTypes: {
        CH4: { radius: 10, color: "#808080", mass: 16 },
        O2: { radius: 8, color: "#ff0000", mass: 32 },
        CO2: { radius: 12, color: "#000000", mass: 44 },
        H2O: { radius: 7, color: "#0000ff", mass: 18 },
      },
    },
    synthesis: {
      name: "Synthesis of Ammonia",
      description: "N₂ + 3H₂ → 2NH₃",
      reactants: ["N2", "H2"],
      products: ["NH3"],
      activationEnergy: 100,
      exothermic: true,
      reactionEnergy: -45,
      particleTypes: {
        N2: { radius: 10, color: "#3050f8", mass: 28 },
        H2: { radius: 6, color: "#ffffff", mass: 2 },
        NH3: { radius: 9, color: "#84a9ff", mass: 17 },
      },
    },
    decomposition: {
      name: "Decomposition of Hydrogen Peroxide",
      description: "2H₂O₂ → 2H₂O + O₂",
      reactants: ["H2O2"],
      products: ["H2O", "O2"],
      activationEnergy: 75,
      exothermic: true,
      reactionEnergy: -98,
      particleTypes: {
        H2O2: { radius: 9, color: "#00ffff", mass: 34 },
        H2O: { radius: 7, color: "#0000ff", mass: 18 },
        O2: { radius: 8, color: "#ff0000", mass: 32 },
      },
    },
    acid_base: {
      name: "Acid-Base Neutralization",
      description: "HCl + NaOH → NaCl + H₂O",
      reactants: ["HCl", "NaOH"],
      products: ["NaCl", "H2O"],
      activationEnergy: 20,
      exothermic: true,
      reactionEnergy: -55,
      particleTypes: {
        HCl: { radius: 8, color: "#00ff00", mass: 36.5 },
        NaOH: { radius: 9, color: "#ff00ff", mass: 40 },
        NaCl: { radius: 10, color: "#ffffff", mass: 58.5 },
        H2O: { radius: 7, color: "#0000ff", mass: 18 },
      },
    },
    endothermic: {
      name: "Photosynthesis (Simplified)",
      description: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
      reactants: ["CO2", "H2O"],
      products: ["C6H12O6", "O2"],
      activationEnergy: 120,
      exothermic: false,
      reactionEnergy: 2870,
      particleTypes: {
        CO2: { radius: 12, color: "#000000", mass: 44 },
        H2O: { radius: 7, color: "#0000ff", mass: 18 },
        C6H12O6: { radius: 15, color: "#964B00", mass: 180 },
        O2: { radius: 8, color: "#ff0000", mass: 32 },
      },
    },
  };

  // Initialize particles
  useEffect(() => {
    resetSimulation();
  }, [selectedReaction, particleCount]);

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
  }, [isRunning, particles, temperature]);

  // Update particles
  const updateParticles = (deltaTime: number) => {
    const reaction = reactions[selectedReaction];
    if (!reaction) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Calculate temperature effect on particle speed
    const tempFactor = Math.sqrt(temperature / 300);

    // Update positions and handle collisions
    const newParticles = [...particles];
    let newReactionCount = reactionCount;

    // Move particles
    for (let i = 0; i < newParticles.length; i++) {
      const particle = newParticles[i];

      // Update position
      particle.x += particle.vx * deltaTime * tempFactor;
      particle.y += particle.vy * deltaTime * tempFactor;

      // Bounce off walls
      if (particle.x - particle.radius < 0) {
        particle.x = particle.radius;
        particle.vx = -particle.vx;
      } else if (particle.x + particle.radius > width) {
        particle.x = width - particle.radius;
        particle.vx = -particle.vx;
      }

      if (particle.y - particle.radius < 0) {
        particle.y = particle.radius;
        particle.vy = -particle.vy;
      } else if (particle.y + particle.radius > height) {
        particle.y = height - particle.radius;
        particle.vy = -particle.vy;
      }
    }

    // Check for collisions and reactions
    for (let i = 0; i < newParticles.length; i++) {
      const particle1 = newParticles[i];
      if (particle1.reacted) continue;

      for (let j = i + 1; j < newParticles.length; j++) {
        const particle2 = newParticles[j];
        if (particle2.reacted) continue;

        const dx = particle2.x - particle1.x;
        const dy = particle2.y - particle1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check for collision
        if (distance < particle1.radius + particle2.radius) {
          // Calculate collision response
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          // Rotate velocities
          const vx1 = particle1.vx * cos + particle1.vy * sin;
          const vy1 = particle1.vy * cos - particle1.vx * sin;
          const vx2 = particle2.vx * cos + particle2.vy * sin;
          const vy2 = particle2.vy * cos - particle2.vx * sin;

          // Calculate new velocities (elastic collision)
          const m1 = reaction.particleTypes[particle1.type].mass;
          const m2 = reaction.particleTypes[particle2.type].mass;
          const newVx1 = ((m1 - m2) * vx1 + 2 * m2 * vx2) / (m1 + m2);
          const newVx2 = ((m2 - m1) * vx2 + 2 * m1 * vx1) / (m1 + m2);

          // Rotate velocities back
          particle1.vx = newVx1 * cos - vy1 * sin;
          particle1.vy = vy1 * cos + newVx1 * sin;
          particle2.vx = newVx2 * cos - vy2 * sin;
          particle2.vy = vy2 * cos + newVx2 * sin;

          // Move particles apart to prevent sticking
          const overlap = particle1.radius + particle2.radius - distance;
          particle1.x -= (overlap / 2) * cos;
          particle1.y -= (overlap / 2) * sin;
          particle2.x += (overlap / 2) * cos;
          particle2.y += (overlap / 2) * sin;

          // Check for reaction
          const relativeSpeed = Math.sqrt(
            Math.pow(particle1.vx - particle2.vx, 2) +
              Math.pow(particle1.vy - particle2.vy, 2),
          );
          const combinedEnergy =
            0.5 * relativeSpeed * relativeSpeed * (m1 + m2) * tempFactor;

          // Check if particles can react
          if (
            reaction.reactants.includes(particle1.type) &&
            reaction.reactants.includes(particle2.type) &&
            particle1.type !== particle2.type && // Different reactants
            combinedEnergy > reaction.activationEnergy
          ) {
            // Mark particles as reacted
            particle1.reacted = true;
            particle2.reacted = true;

            // Create product particles
            const productTypes = [...reaction.products];

            // Determine how many of each product to create
            let productsToCreate: string[] = [];

            if (reaction.name === "Combustion of Methane") {
              if (particle1.type === "CH4" && particle2.type === "O2") {
                productsToCreate = ["CO2", "H2O"];
              } else if (particle1.type === "O2" && particle2.type === "CH4") {
                productsToCreate = ["CO2", "H2O"];
              }
            } else if (reaction.name === "Synthesis of Ammonia") {
              if (particle1.type === "N2" && particle2.type === "H2") {
                productsToCreate = ["NH3"];
              } else if (particle1.type === "H2" && particle2.type === "N2") {
                productsToCreate = ["NH3"];
              }
            } else if (reaction.name === "Decomposition of Hydrogen Peroxide") {
              if (particle1.type === "H2O2" && particle2.type === "H2O2") {
                productsToCreate = ["H2O", "H2O", "O2"];
              }
            } else if (reaction.name === "Acid-Base Neutralization") {
              if (particle1.type === "HCl" && particle2.type === "NaOH") {
                productsToCreate = ["NaCl", "H2O"];
              } else if (
                particle1.type === "NaOH" &&
                particle2.type === "HCl"
              ) {
                productsToCreate = ["NaCl", "H2O"];
              }
            } else if (reaction.name === "Photosynthesis (Simplified)") {
              if (particle1.type === "CO2" && particle2.type === "H2O") {
                productsToCreate = ["C6H12O6", "O2"];
              } else if (particle1.type === "H2O" && particle2.type === "CO2") {
                productsToCreate = ["C6H12O6", "O2"];
              }
            }

            // Create product particles if we have a valid reaction
            if (productsToCreate.length > 0) {
              for (const productType of productsToCreate) {
                const productProps = reaction.particleTypes[productType];

                // Create new product particle
                const newParticle: Particle = {
                  id: `particle-${Date.now()}-${Math.random()}`,
                  type: productType,
                  x: (particle1.x + particle2.x) / 2,
                  y: (particle1.y + particle2.y) / 2,
                  vx:
                    ((particle1.vx + particle2.vx) / 2) *
                    (1 + (reaction.exothermic ? 0.5 : -0.2)),
                  vy:
                    ((particle1.vy + particle2.vy) / 2) *
                    (1 + (reaction.exothermic ? 0.5 : -0.2)),
                  radius: productProps.radius,
                  color: productProps.color,
                  energy: reaction.exothermic
                    ? combinedEnergy + Math.abs(reaction.reactionEnergy)
                    : combinedEnergy - reaction.reactionEnergy,
                };

                newParticles.push(newParticle);
              }

              newReactionCount++;
            }
          }
        }
      }
    }

    // Remove reacted particles
    const filteredParticles = newParticles.filter((p) => !p.reacted);

    // Update state
    setParticles(filteredParticles);
    setReactionCount(newReactionCount);

    // Calculate reaction progress
    const totalReactants = particles.filter((p) =>
      reaction.reactants.includes(p.type),
    ).length;
    const totalProducts = particles.filter((p) =>
      reaction.products.includes(p.type),
    ).length;
    const initialReactants = particleCount;

    if (initialReactants > 0) {
      setReactionProgress(totalProducts / (totalProducts + totalReactants));
    }
  };

  // Draw the simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reaction = reactions[selectedReaction];
    if (!reaction) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw energy profile if enabled
    if (showEnergyProfile) {
      drawEnergyProfile(ctx, canvas.width, canvas.height, reaction);
    }

    // Draw particles
    for (const particle of particles) {
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw label
      if (showParticleLabels) {
        ctx.fillStyle = "#000000";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(particle.type, particle.x, particle.y);
      }
    }

    // Draw reaction information
    ctx.fillStyle = "#000000";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Reaction: ${reaction.name}`, 10, 10);
    ctx.fillText(`Equation: ${reaction.description}`, 10, 30);
    ctx.fillText(`Temperature: ${temperature} K`, 10, 50);
    ctx.fillText(`Reactions: ${reactionCount}`, 10, 70);
    ctx.fillText(`Progress: ${(reactionProgress * 100).toFixed(1)}%`, 10, 90);
  }, [
    particles,
    selectedReaction,
    showEnergyProfile,
    showParticleLabels,
    temperature,
    reactionCount,
    reactionProgress,
  ]);

  // Draw energy profile
  const drawEnergyProfile = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    reaction: Reaction,
  ) => {
    const profileHeight = 100;
    const profileY = height - profileHeight - 10;
    const profileWidth = width - 20;
    const profileX = 10;

    // Draw background
    ctx.fillStyle = "rgba(240, 240, 240, 0.7)";
    ctx.fillRect(profileX, profileY, profileWidth, profileHeight);

    // Draw axes
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(profileX, profileY);
    ctx.lineTo(profileX, profileY + profileHeight);
    ctx.lineTo(profileX + profileWidth, profileY + profileHeight);
    ctx.stroke();

    // Draw reaction coordinate labels
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(
      "Reaction Coordinate",
      profileX + profileWidth / 2,
      profileY + profileHeight + 5,
    );

    // Draw energy labels
    ctx.save();
    ctx.translate(profileX - 5, profileY + profileHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Energy", 0, 0);
    ctx.restore();

    // Draw energy profile
    const startX = profileX + 20;
    const endX = profileX + profileWidth - 20;
    const baselineY = profileY + profileHeight - 10;
    const reactantY = baselineY - 30;
    const productY = baselineY - 30 + (reaction.exothermic ? 40 : -40);
    const activationY = reactantY - reaction.activationEnergy / 2;

    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, reactantY);
    ctx.lineTo(startX + (endX - startX) / 3, reactantY);
    ctx.quadraticCurveTo(
      startX + (endX - startX) / 2,
      activationY,
      startX + (2 * (endX - startX)) / 3,
      productY,
    );
    ctx.lineTo(endX, productY);
    ctx.stroke();

    // Draw labels for reactants, products, and activation energy
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("Reactants", startX, reactantY - 5);
    ctx.fillText("Products", endX, productY - 5);
    ctx.fillText(
      "Activation Energy",
      startX + (endX - startX) / 2,
      activationY - 5,
    );

    // Draw reaction progress indicator
    const progressX = startX + reactionProgress * (endX - startX);
    ctx.beginPath();
    ctx.arc(
      progressX,
      reactantY + (productY - reactantY) * reactionProgress,
      5,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "#0000ff";
    ctx.fill();
  };

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
    setReactionCount(0);
    setReactionProgress(0);

    const reaction = reactions[selectedReaction];
    if (!reaction) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create new particles
    const newParticles: Particle[] = [];

    // Determine reactant distribution
    let reactantCounts: { [key: string]: number } = {};

    if (selectedReaction === "combustion") {
      // CH₄ + 2O₂ → CO₂ + 2H₂O
      reactantCounts = {
        CH4: Math.floor(particleCount / 3),
        O2: Math.floor((particleCount * 2) / 3),
      };
    } else if (selectedReaction === "synthesis") {
      // N₂ + 3H₂ → 2NH₃
      reactantCounts = {
        N2: Math.floor(particleCount / 4),
        H2: Math.floor((particleCount * 3) / 4),
      };
    } else if (selectedReaction === "decomposition") {
      // 2H₂O₂ → 2H₂O + O₂
      reactantCounts = { H2O2: particleCount };
    } else if (selectedReaction === "acid_base") {
      // HCl + NaOH → NaCl + H₂O
      reactantCounts = {
        HCl: Math.floor(particleCount / 2),
        NaOH: Math.floor(particleCount / 2),
      };
    } else if (selectedReaction === "endothermic") {
      // 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
      reactantCounts = {
        CO2: Math.floor(particleCount / 2),
        H2O: Math.floor(particleCount / 2),
      };
    }

    // Create particles for each reactant
    for (const [type, count] of Object.entries(reactantCounts)) {
      const particleProps = reaction.particleTypes[type];

      for (let i = 0; i < count; i++) {
        // Random position within canvas
        const x =
          particleProps.radius +
          Math.random() * (width - 2 * particleProps.radius);
        const y =
          particleProps.radius +
          Math.random() * (height - 2 * particleProps.radius);

        // Random velocity
        const speed = 50 + Math.random() * 50;
        const angle = Math.random() * Math.PI * 2;
        const vx = speed * Math.cos(angle);
        const vy = speed * Math.sin(angle);

        newParticles.push({
          id: `particle-${Date.now()}-${i}-${type}`,
          type,
          x,
          y,
          vx,
          vy,
          radius: particleProps.radius,
          color: particleProps.color,
          energy: 0.5 * particleProps.mass * (vx * vx + vy * vy),
        });
      }
    }

    setParticles(newParticles);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/student/simulations/chem">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Chemical Reactions Simulation</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>Reaction Simulation</CardTitle>
              <CardDescription>
                Observe how molecules interact and react with each other
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

              <div className="mt-4 w-full text-sm text-gray-500">
                <div className="mb-1 flex justify-between">
                  <span>Temperature:</span>
                  <span>{temperature} K</span>
                </div>
                <Slider
                  value={[temperature]}
                  min={100}
                  max={1000}
                  step={10}
                  onValueChange={(value) => setTemperature(value[0])}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Reaction Settings</CardTitle>
              <CardDescription>
                Choose a reaction type and adjust simulation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Reaction</label>
                <Select
                  value={selectedReaction}
                  onValueChange={setSelectedReaction}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reaction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="combustion">
                      Combustion of Methane
                    </SelectItem>
                    <SelectItem value="synthesis">
                      Synthesis of Ammonia
                    </SelectItem>
                    <SelectItem value="decomposition">
                      Decomposition of H₂O₂
                    </SelectItem>
                    <SelectItem value="acid_base">
                      Acid-Base Neutralization
                    </SelectItem>
                    <SelectItem value="endothermic">
                      Photosynthesis (Simplified)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Particle Count</label>
                  <span className="text-sm text-gray-500">{particleCount}</span>
                </div>
                <Slider
                  value={[particleCount]}
                  min={10}
                  max={50}
                  step={5}
                  onValueChange={(value) => setParticleCount(value[0])}
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Display Options</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showEnergyProfile">Show Energy Profile</Label>
                  <Switch
                    id="showEnergyProfile"
                    checked={showEnergyProfile}
                    onCheckedChange={setShowEnergyProfile}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showParticleLabels">
                    Show Particle Labels
                  </Label>
                  <Switch
                    id="showParticleLabels"
                    checked={showParticleLabels}
                    onCheckedChange={setShowParticleLabels}
                  />
                </div>
              </div>

              <div className="rounded-md bg-green-50 p-4">
                <h3 className="mb-2 font-medium">Reaction Information</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">Equation:</span>
                    <span>{reactions[selectedReaction]?.description}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">Type:</span>
                    <span>
                      {reactions[selectedReaction]?.exothermic
                        ? "Exothermic"
                        : "Endothermic"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">Energy Change:</span>
                    <span>
                      {reactions[selectedReaction]?.reactionEnergy} kJ/mol
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">Activation Energy:</span>
                    <span>
                      {reactions[selectedReaction]?.activationEnergy} kJ/mol
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-green-50 p-4">
                <h3 className="mb-2 font-medium">Reaction Kinetics</h3>
                <p className="mb-2 text-sm text-gray-700">
                  Factors affecting reaction rate:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  <li>
                    <strong>Temperature:</strong> Higher temperatures increase
                    particle kinetic energy and collision frequency
                  </li>
                  <li>
                    <strong>Concentration:</strong> More particles lead to more
                    frequent collisions
                  </li>
                  <li>
                    <strong>Activation Energy:</strong> Energy barrier that must
                    be overcome for reaction to occur
                  </li>
                  <li>
                    <strong>Orientation:</strong> Particles must collide with
                    the correct orientation to react
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
