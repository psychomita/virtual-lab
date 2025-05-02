"use client";

import { useRef, useEffect } from "react";

interface PendulumSimulationProps {
  running: boolean;
  gravity: number;
  length: number;
  initialAngle: number;
}

export default function PendulumSimulation({
  running,
  gravity,
  length,
  initialAngle,
}: PendulumSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Calculate pendulum properties
    const pivotX = canvas.width / 2;
    const pivotY = 50;
    const bobRadius = 15;
    const pendulumLength = length * 150; // Scale for display

    // Convert angle from degrees to radians
    const angleInRadians = (initialAngle * Math.PI) / 180;

    // Calculate period
    const period = 2 * Math.PI * Math.sqrt(length / gravity);

    // Animation variables
    let angle = angleInRadians;
    let angleVelocity = 0;
    let lastTimestamp: number | null = null;
    let animationFrameId: number;

    // Draw pendulum
    const drawPendulum = (currentAngle: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw pivot
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#666";
      ctx.fill();

      // Calculate bob position
      const bobX = pivotX + Math.sin(currentAngle) * pendulumLength;
      const bobY = pivotY + Math.cos(currentAngle) * pendulumLength;

      // Draw rod
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw bob
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fillStyle = "hsl(215, 100%, 50%)";
      ctx.fill();

      // Draw information
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(`Period: ${period.toFixed(2)} s`, 20, canvas.height - 60);
      ctx.fillText(
        `Angle: ${((currentAngle * 180) / Math.PI).toFixed(1)}°`,
        20,
        canvas.height - 40,
      );
      ctx.fillText(
        `Angular velocity: ${angleVelocity.toFixed(2)} rad/s`,
        20,
        canvas.height - 20,
      );
    };

    // Animate pendulum
    const animate = (timestamp: number) => {
      if (!running) {
        drawPendulum(angleInRadians);
        return;
      }

      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
      lastTimestamp = timestamp;

      // Physics simulation
      const angleAcceleration = (-gravity / length) * Math.sin(angle);
      angleVelocity += angleAcceleration * deltaTime;
      angle += angleVelocity * deltaTime;

      // Add damping
      angleVelocity *= 0.998;

      drawPendulum(angle);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    if (running) {
      angle = angleInRadians;
      angleVelocity = 0;
      lastTimestamp = null;
      animationFrameId = requestAnimationFrame(animate);
    } else {
      drawPendulum(angleInRadians);
    }

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [running, gravity, length, initialAngle]);

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-gray-50"
      style={{ height: "400px" }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />

      {!running && (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center bg-white/50">
          Configure parameters and start the simulation
        </div>
      )}
    </div>
  );
}
