"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RefreshCw, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Gravitational constant (scaled for simulation)
const G = 6.67e-2;

type CelestialBody = {
  id: string;
  name: string;
  mass: number;
  radius: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  color: string;
  trail: Array<{ x: number; y: number }>;
};

export default function GravitySimulation() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [bodies, setBodies] = useState<CelestialBody[]>([
    {
      id: "sun",
      name: "Star",
      mass: 1000,
      radius: 20,
      position: { x: 300, y: 200 },
      velocity: { x: 0, y: 0 },
      color: "#ffcc00",
      trail: [],
    },
    {
      id: "planet1",
      name: "Planet 1",
      mass: 10,
      radius: 8,
      position: { x: 300, y: 100 },
      velocity: { x: 1.2, y: 0 },
      color: "#3b82f6",
      trail: [],
    },
    {
      id: "planet2",
      name: "Planet 2",
      mass: 5,
      radius: 5,
      position: { x: 300, y: 300 },
      velocity: { x: -1, y: 0 },
      color: "#ef4444",
      trail: [],
    },
  ]);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [timeScale, setTimeScale] = useState(1);
  const [showTrails, setShowTrails] = useState(true);
  const [showVelocityVectors, setShowVelocityVectors] = useState(true);
  const [showForceVectors, setShowForceVectors] = useState(false);
  const [collisionsEnabled, setCollisionsEnabled] = useState(true);
  const [newBodyName, setNewBodyName] = useState("New Planet");
  const [newBodyMass, setNewBodyMass] = useState(10);
  const [newBodyColor, setNewBodyColor] = useState("#8b5cf6");

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Update positions and velocities
      updateBodies(deltaTime * timeScale);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, bodies, timeScale, collisionsEnabled]);

  // Update celestial bodies
  const updateBodies = (deltaTime: number) => {
    // Calculate forces and update velocities
    const newBodies = [...bodies];

    // Calculate forces between all pairs of bodies
    for (let i = 0; i < newBodies.length; i++) {
      const body1 = newBodies[i];
      let totalForceX = 0;
      let totalForceY = 0;

      for (let j = 0; j < newBodies.length; j++) {
        if (i === j) continue;

        const body2 = newBodies[j];
        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check for collision
        if (collisionsEnabled && distance < body1.radius + body2.radius) {
          // Handle collision by merging bodies
          if (body1.mass >= body2.mass) {
            // Merge body2 into body1
            const totalMass = body1.mass + body2.mass;
            const newVelocityX =
              (body1.mass * body1.velocity.x + body2.mass * body2.velocity.x) /
              totalMass;
            const newVelocityY =
              (body1.mass * body1.velocity.y + body2.mass * body2.velocity.y) /
              totalMass;

            body1.velocity.x = newVelocityX;
            body1.velocity.y = newVelocityY;
            body1.mass = totalMass;
            body1.radius = Math.pow(
              Math.pow(body1.radius, 3) + Math.pow(body2.radius, 3),
              1 / 3,
            );

            // Remove body2
            newBodies.splice(j, 1);
            if (j < i) i--;
            if (selectedBody === body2.id) setSelectedBody(null);
            continue;
          }
        }

        // Calculate gravitational force
        const force = (G * body1.mass * body2.mass) / (distance * distance);
        const forceX = (force * dx) / distance;
        const forceY = (force * dy) / distance;

        totalForceX += forceX;
        totalForceY += forceY;
      }

      // Update velocity based on force (F = ma, so a = F/m)
      body1.velocity.x += (totalForceX / body1.mass) * deltaTime;
      body1.velocity.y += (totalForceY / body1.mass) * deltaTime;
    }

    // Update positions based on velocities
    for (const body of newBodies) {
      body.position.x += body.velocity.x * deltaTime;
      body.position.y += body.velocity.y * deltaTime;

      // Add current position to trail
      if (showTrails) {
        body.trail.push({ ...body.position });
        // Limit trail length
        if (body.trail.length > 100) {
          body.trail.shift();
        }
      } else {
        body.trail = [];
      }
    }

    setBodies(newBodies);
  };

  // Draw the simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with theme-appropriate background
    ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw trails
    if (showTrails) {
      for (const body of bodies) {
        if (body.trail.length < 2) continue;

        ctx.beginPath();
        ctx.moveTo(body.trail[0].x, body.trail[0].y);

        for (let i = 1; i < body.trail.length; i++) {
          ctx.lineTo(body.trail[i].x, body.trail[i].y);
        }

        ctx.strokeStyle = body.color + "80"; // Add transparency
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw bodies
    for (const body of bodies) {
      // Draw the celestial body
      ctx.beginPath();
      ctx.arc(body.position.x, body.position.y, body.radius, 0, Math.PI * 2);
      ctx.fillStyle = body.color;
      ctx.fill();

      // Highlight selected body
      if (body.id === selectedBody) {
        ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw velocity vector
      if (showVelocityVectors) {
        const velocityMagnitude = Math.sqrt(
          body.velocity.x * body.velocity.x + body.velocity.y * body.velocity.y,
        );
        const velocityScale = 20; // Scale factor for better visualization

        ctx.beginPath();
        ctx.moveTo(body.position.x, body.position.y);
        ctx.lineTo(
          body.position.x +
            (body.velocity.x / velocityMagnitude) * velocityScale * body.radius,
          body.position.y +
            (body.velocity.y / velocityMagnitude) * velocityScale * body.radius,
        );
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw force vectors
      if (showForceVectors) {
        for (const otherBody of bodies) {
          if (body.id === otherBody.id) continue;

          const dx = otherBody.position.x - body.position.x;
          const dy = otherBody.position.y - body.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const force =
            (G * body.mass * otherBody.mass) / (distance * distance);
          const forceScale = 5000 / force; // Inverse scale for better visualization

          ctx.beginPath();
          ctx.moveTo(body.position.x, body.position.y);
          ctx.lineTo(
            body.position.x + (dx / distance) * body.radius * 2,
            body.position.y + (dy / distance) * body.radius * 2,
          );
          ctx.strokeStyle = "#ff00ff";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw body name
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        body.name,
        body.position.x,
        body.position.y - body.radius - 5,
      );
    }
  }, [bodies, selectedBody, showTrails, showVelocityVectors, showForceVectors, theme]);

  // Handle canvas click to select bodies
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a body
    let clickedBody = null;
    for (const body of bodies) {
      const dx = x - body.position.x;
      const dy = y - body.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= body.radius) {
        clickedBody = body.id;
        break;
      }
    }

    setSelectedBody(clickedBody);
  };

  // Add a new celestial body
  const addBody = () => {
    // Generate random position away from the center
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    const x = 300 + Math.cos(angle) * distance;
    const y = 200 + Math.sin(angle) * distance;

    // Generate orbital velocity perpendicular to position vector
    const speed = 0.5 + Math.random() * 1;
    const vx = -Math.sin(angle) * speed;
    const vy = Math.cos(angle) * speed;

    const newBody: CelestialBody = {
      id: `body-${Date.now()}`,
      name: newBodyName,
      mass: newBodyMass,
      radius: 5 + Math.sqrt(newBodyMass) / 2,
      position: { x, y },
      velocity: { x: vx, y: vy },
      color: newBodyColor,
      trail: [],
    };

    setBodies([...bodies, newBody]);
    setSelectedBody(newBody.id);
  };

  // Remove selected body
  const removeBody = () => {
    if (!selectedBody) return;
    setBodies(bodies.filter((body) => body.id !== selectedBody));
    setSelectedBody(null);
  };

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setBodies([
      {
        id: "sun",
        name: "Star",
        mass: 1000,
        radius: 20,
        position: { x: 300, y: 200 },
        velocity: { x: 0, y: 0 },
        color: "#ffcc00",
        trail: [],
      },
      {
        id: "planet1",
        name: "Planet 1",
        mass: 10,
        radius: 8,
        position: { x: 300, y: 100 },
        velocity: { x: 1.2, y: 0 },
        color: "#3b82f6",
        trail: [],
      },
      {
        id: "planet2",
        name: "Planet 2",
        mass: 5,
        radius: 5,
        position: { x: 300, y: 300 },
        velocity: { x: -1, y: 0 },
        color: "#ef4444",
        trail: [],
      },
    ]);
    setSelectedBody(null);
  };

  // Get selected body details
  const getSelectedBodyDetails = () => {
    if (!selectedBody) return null;
    return bodies.find((body) => body.id === selectedBody);
  };

  // Update selected body properties
  const updateSelectedBody = (property: string, value: any) => {
    if (!selectedBody) return;

    setBodies(
      bodies.map((body) => {
        if (body.id === selectedBody) {
          if (property === "name") {
            return { ...body, name: value };
          } else if (property === "mass") {
            const newMass = Number(value);
            return {
              ...body,
              mass: newMass,
              radius: 5 + Math.sqrt(newMass) / 2, // Update radius based on mass
            };
          } else if (property === "velocityX") {
            return {
              ...body,
              velocity: { ...body.velocity, x: Number(value) },
            };
          } else if (property === "velocityY") {
            return {
              ...body,
              velocity: { ...body.velocity, y: Number(value) },
            };
          } else if (property === "color") {
            return { ...body, color: value };
          }
        }
        return body;
      }),
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/student/simulations/phy">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Gravity Simulation</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="w-full h-full bg-background">
            <CardHeader>
              <CardTitle>Simulation</CardTitle>
              <CardDescription>
                Observe gravitational interactions between celestial bodies
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="border rounded-md dark:border-gray-700 bg-background"
                onClick={handleCanvasClick}
              />

              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-amber-500 hover:bg-amber-600"
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

              <div className="mt-4 text-sm text-muted-foreground w-full">
                <div className="flex justify-between mb-1">
                  <span>Time Scale:</span>
                  <span>{timeScale}x</span>
                </div>
                <Slider
                  value={[timeScale]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={(value) => setTimeScale(value[0])}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>
                Manage celestial bodies and simulation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Display Options</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showTrails">Show Orbital Trails</Label>
                  <Switch
                    id="showTrails"
                    checked={showTrails}
                    onCheckedChange={setShowTrails}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showVelocityVectors">
                    Show Velocity Vectors
                  </Label>
                  <Switch
                    id="showVelocityVectors"
                    checked={showVelocityVectors}
                    onCheckedChange={setShowVelocityVectors}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showForceVectors">Show Force Vectors</Label>
                  <Switch
                    id="showForceVectors"
                    checked={showForceVectors}
                    onCheckedChange={setShowForceVectors}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="collisionsEnabled">Enable Collisions</Label>
                  <Switch
                    id="collisionsEnabled"
                    checked={collisionsEnabled}
                    onCheckedChange={setCollisionsEnabled}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Add New Body</h3>
                <div className="space-y-2">
                  <Label htmlFor="newBodyName">Name</Label>
                  <Input
                    id="newBodyName"
                    value={newBodyName}
                    onChange={(e) => setNewBodyName(e.target.value)}
                    className="dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="newBodyMass">Mass</Label>
                    <span className="text-sm text-muted-foreground">{newBodyMass}</span>
                  </div>
                  <Slider
                    id="newBodyMass"
                    value={[newBodyMass]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setNewBodyMass(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newBodyColor">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newBodyColor"
                      type="color"
                      value={newBodyColor}
                      onChange={(e) => setNewBodyColor(e.target.value)}
                      className="h-8 w-12 p-0"
                    />
                    <Button onClick={addBody} className="flex-1">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Body
                    </Button>
                  </div>
                </div>
              </div>

              {getSelectedBodyDetails() && (
                <div className="space-y-4">
                  <h3 className="font-medium">
                    Selected Body: {getSelectedBodyDetails()?.name}
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="bodyName">Name</Label>
                    <Input
                      id="bodyName"
                      value={getSelectedBodyDetails()?.name}
                      onChange={(e) =>
                        updateSelectedBody("name", e.target.value)
                      }
                      className="dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="bodyMass">Mass</Label>
                      <span className="text-sm text-muted-foreground">
                        {getSelectedBodyDetails()?.mass}
                      </span>
                    </div>
                    <Slider
                      id="bodyMass"
                      value={[getSelectedBodyDetails()?.mass || 0]}
                      min={1}
                      max={1000}
                      step={1}
                      onValueChange={(value) =>
                        updateSelectedBody("mass", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="bodyVelocityX">Velocity X</Label>
                      <span className="text-sm text-muted-foreground">
                        {getSelectedBodyDetails()?.velocity.x.toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id="bodyVelocityX"
                      value={[getSelectedBodyDetails()?.velocity.x || 0]}
                      min={-3}
                      max={3}
                      step={0.1}
                      onValueChange={(value) =>
                        updateSelectedBody("velocityX", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="bodyVelocityY">Velocity Y</Label>
                      <span className="text-sm text-muted-foreground">
                        {getSelectedBodyDetails()?.velocity.y.toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id="bodyVelocityY"
                      value={[getSelectedBodyDetails()?.velocity.y || 0]}
                      min={-3}
                      max={3}
                      step={0.1}
                      onValueChange={(value) =>
                        updateSelectedBody("velocityY", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyColor">Color</Label>
                    <Input
                      id="bodyColor"
                      type="color"
                      value={getSelectedBodyDetails()?.color}
                      onChange={(e) =>
                        updateSelectedBody("color", e.target.value)
                      }
                    />
                  </div>

                  <Button
                    onClick={removeBody}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Body
                  </Button>
                </div>
              )}

              <div className="rounded-md bg-amber-950 dark:bg-amber-950 p-4">
                <h3 className="mb-2 font-medium">Gravity Simulation</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  This simulation demonstrates Newton's law of universal
                  gravitation:
                </p>
                <div className="my-2 text-center font-mono">
                  F = G × (m₁ × m₂) / r²
                </div>
                <p className="text-sm text-muted-foreground">
                  Where F is the gravitational force, G is the gravitational
                  constant, m₁ and m₂ are the masses of the objects, and r is
                  the distance between them.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}