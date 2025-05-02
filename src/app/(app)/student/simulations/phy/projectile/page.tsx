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
import { ArrowLeft, Play, Pause, RefreshCw } from "lucide-react";

export default function ProjectileMotionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [velocity, setVelocity] = useState(50);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);
  const [height, setHeight] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [maxHeight, setMaxHeight] = useState(0);
  const [range, setRange] = useState(0);
  const [flightTime, setFlightTime] = useState(0);

  // Calculate theoretical values
  useEffect(() => {
    const angleRad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);

    // Time of flight: t = (2 * vy) / g + sqrt(2 * h / g)
    const timeOfFlight = (2 * vy) / gravity + Math.sqrt((2 * height) / gravity);

    // Range: x = vx * t
    const horizontalRange = vx * timeOfFlight;

    // Maximum height: h + vy^2 / (2g)
    const maxH = height + (vy * vy) / (2 * gravity);

    setFlightTime(timeOfFlight);
    setRange(horizontalRange);
    setMaxHeight(maxH);
  }, [velocity, angle, gravity, height]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    let animationFrameId: number;
    let lastTime = 0;
    let newPositions: { x: number; y: number }[] = [];
    let currentTime = 0;
    const startX = 50; // Starting x position on canvas
    const startY = 350 - height; // Starting y position on canvas (inverted y-axis)

    const animate = (timestamp: number) => {
      if (!lastTime) {
        lastTime = timestamp;
        // Initialize positions array with starting position
        newPositions = [{ x: startX, y: startY }];
        setPositions(newPositions);
      }

      const deltaTime = (timestamp - lastTime) / 1000; // Convert to seconds
      lastTime = timestamp;

      // Update simulation time
      currentTime += deltaTime;
      setTime(currentTime);

      // Calculate projectile position
      const angleRad = (angle * Math.PI) / 180;
      const vx = velocity * Math.cos(angleRad);
      const vy = velocity * Math.sin(angleRad);

      const x = startX + vx * currentTime * 5; // Scale factor for better visualization
      const y =
        startY -
        (height +
          vy * currentTime -
          0.5 * gravity * currentTime * currentTime) *
          5; // Inverted y-axis

      // Add new position to array
      newPositions.push({ x, y });
      setPositions([...newPositions]);

      // Draw the projectile
      drawProjectile(newPositions, x, y);

      // Check if projectile has hit the ground
      if (y >= 350) {
        setIsRunning(false);
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, angle, velocity, gravity, height]);

  // Draw the projectile and its path
  const drawProjectile = (
    positions: { x: number; y: number }[],
    currentX: number,
    currentY: number,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.lineTo(canvas.width, 350);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw initial height platform if height > 0
    if (height > 0) {
      ctx.beginPath();
      ctx.rect(0, 350, 100, -height * 5);
      ctx.fillStyle = "#d1d5db";
      ctx.fill();
      ctx.strokeStyle = "#9ca3af";
      ctx.stroke();
    }

    // Draw trajectory path
    if (positions.length > 1) {
      ctx.beginPath();
      ctx.moveTo(positions[0].x, positions[0].y);

      for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i].x, positions[i].y);
      }

      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw the projectile
    ctx.beginPath();
    ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw angle indicator at start position
    if (!isRunning || time < 0.1) {
      const angleRad = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(50, 350 - height * 5);
      ctx.lineTo(
        50 + Math.cos(angleRad) * 50,
        350 - height * 5 - Math.sin(angleRad) * 50,
      );
      ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add angle text
      ctx.fillStyle = "#333";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${angle}°`, 80, 330 - height * 5);
    }

    // Add labels for distance and height
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    // Current height label
    const currentHeight = (350 - currentY) / 5;
    if (currentHeight > 0) {
      ctx.fillText(
        `Height: ${currentHeight.toFixed(1)}m`,
        currentX,
        currentY - 20,
      );
    }

    // Distance label
    const distance = (currentX - 50) / 5;
    ctx.fillText(`Distance: ${distance.toFixed(1)}m`, currentX, 370);
  };

  // Initialize the canvas
  useEffect(() => {
    const initialPositions = [{ x: 50, y: 350 - height * 5 }];
    setPositions(initialPositions);
    drawProjectile(initialPositions, 50, 350 - height * 5);
  }, [height]);

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
    setPositions([{ x: 50, y: 350 - height * 5 }]);
    drawProjectile([{ x: 50, y: 350 - height * 5 }], 50, 350 - height * 5);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/student/simulations/phy">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Projectile Motion Simulation</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>Simulation</CardTitle>
              <CardDescription>
                Observe how the projectile moves based on the parameters you set
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
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <Pause className="mr-2 h-4 w-4" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {isRunning ? "Running..." : "Launch"}
                </Button>
                <Button onClick={resetSimulation} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Time: {time.toFixed(2)}s
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
              <CardDescription>
                Adjust these values to see how they affect the projectile's
                motion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Initial Velocity
                  </label>
                  <span className="text-sm text-gray-500">{velocity} m/s</span>
                </div>
                <Slider
                  value={[velocity]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVelocity(value[0])}
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Launch Angle</label>
                  <span className="text-sm text-gray-500">{angle}°</span>
                </div>
                <Slider
                  value={[angle]}
                  min={0}
                  max={90}
                  step={1}
                  onValueChange={(value) => setAngle(value[0])}
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Gravity</label>
                  <span className="text-sm text-gray-500">{gravity} m/s²</span>
                </div>
                <Slider
                  value={[gravity]}
                  min={1}
                  max={20}
                  step={0.1}
                  onValueChange={(value) => setGravity(value[0])}
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Initial Height</label>
                  <span className="text-sm text-gray-500">{height} m</span>
                </div>
                <Slider
                  value={[height]}
                  min={0}
                  max={30}
                  step={1}
                  onValueChange={(value) => setHeight(value[0])}
                  disabled={isRunning}
                />
              </div>

              <div className="rounded-md bg-blue-50 p-4">
                <h3 className="mb-2 font-medium">Calculated Values</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Maximum Height:</span>
                    <span className="font-mono">{maxHeight.toFixed(2)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Range:</span>
                    <span className="font-mono">{range.toFixed(2)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flight Time:</span>
                    <span className="font-mono">{flightTime.toFixed(2)} s</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
