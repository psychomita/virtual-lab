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

export default function PendulumSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [length, setLength] = useState(150);
  const [gravity, setGravity] = useState(9.8);
  const [angle, setAngle] = useState(Math.PI / 4); // Initial angle (45 degrees)
  const [isRunning, setIsRunning] = useState(false);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const [time, setTime] = useState(0);
  const [period, setPeriod] = useState(0);

  // Calculate the period of the pendulum
  useEffect(() => {
    // T = 2π * sqrt(L/g)
    const calculatedPeriod = 2 * Math.PI * Math.sqrt(length / 100 / gravity);
    setPeriod(calculatedPeriod);
  }, [length, gravity]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    let animationFrameId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Update time
      setTime((prevTime) => prevTime + deltaTime);

      // Update angular acceleration, velocity, and position
      // Using the pendulum differential equation: d²θ/dt² = -(g/L)sin(θ)
      const angularAcceleration = -(gravity / (length / 100)) * Math.sin(angle);
      setAngularVelocity(
        (prevVelocity) => prevVelocity + angularAcceleration * deltaTime,
      );
      setAngle((prevAngle) => prevAngle + angularVelocity * deltaTime);

      // Draw the pendulum
      drawPendulum();

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, angle, angularVelocity, length, gravity]);

  // Draw the pendulum
  const drawPendulum = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the origin to the center top of the canvas
    const originX = canvas.width / 2;
    const originY = 50;

    // Calculate the position of the bob
    const bobX = originX + length * Math.sin(angle);
    const bobY = originY + length * Math.cos(angle);

    // Draw the string
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the pivot point
    ctx.beginPath();
    ctx.arc(originX, originY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();

    // Draw the bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the angle indicator
    ctx.beginPath();
    ctx.arc(
      originX,
      originY,
      30,
      -Math.PI / 2,
      -Math.PI / 2 + angle,
      angle > 0,
    );
    ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add angle text
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `${((angle * 180) / Math.PI).toFixed(1)}°`,
      originX + 50,
      originY + 10,
    );
  };

  // Initialize the canvas
  useEffect(() => {
    drawPendulum();
  }, [length, angle]);

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setAngle(Math.PI / 4);
    setAngularVelocity(0);
    setTime(0);
    drawPendulum();
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/student/simulations/phy">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Pendulum Motion Simulation</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>Simulation</CardTitle>
              <CardDescription>
                Observe how the pendulum moves based on the parameters you set
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={500}
                height={400}
                className="rounded-md border bg-gray-50"
              />

              <div className="mt-4 flex gap-4">
                <Button
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-blue-500 hover:bg-blue-600"
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

              <div className="mt-4 text-sm text-gray-500">
                Time: {time.toFixed(2)}s | Period: {period.toFixed(2)}s
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
              <CardDescription>
                Adjust these values to see how they affect the pendulum's motion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Pendulum Length</label>
                  <span className="text-sm text-gray-500">{length} cm</span>
                </div>
                <Slider
                  value={[length]}
                  min={50}
                  max={300}
                  step={1}
                  onValueChange={(value) => setLength(value[0])}
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
                  <label className="text-sm font-medium">Initial Angle</label>
                  <span className="text-sm text-gray-500">
                    {((angle * 180) / Math.PI).toFixed(1)}°
                  </span>
                </div>
                <Slider
                  value={[(angle * 180) / Math.PI]}
                  min={-90}
                  max={90}
                  step={1}
                  onValueChange={(value) =>
                    setAngle((value[0] * Math.PI) / 180)
                  }
                  disabled={isRunning}
                />
              </div>

              <div className="rounded-md bg-blue-50 p-4">
                <h3 className="mb-2 font-medium">Theory</h3>
                <p className="text-sm text-gray-700">
                  The period of a pendulum depends on its length and the
                  gravitational acceleration according to:
                </p>
                <div className="my-2 text-center font-mono">
                  T = 2π × √(L/g)
                </div>
                <p className="text-sm text-gray-700">
                  Where T is the period, L is the length, and g is the
                  gravitational acceleration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
