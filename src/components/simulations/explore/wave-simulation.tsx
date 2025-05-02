"use client";

import { useRef, useEffect } from "react";

interface WaveSimulationProps {
  running: boolean;
  amplitude: number;
  frequency: number;
  waveType: string;
}

export default function WaveSimulation({
  running,
  amplitude,
  frequency,
  waveType,
}: WaveSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Wave parameters
    const centerY = canvas.height / 2;
    const wavelength = canvas.width / 4;

    // Animation variables
    let animationFrameId: number;
    let phase = 0;
    let lastTimestamp: number | null = null;

    // Generate wave points
    const generateWavePoints = (currentPhase: number) => {
      const points = [];
      const step = 5; // Pixel step for x-axis

      for (let x = 0; x < canvas.width; x += step) {
        const normalizedX = x / wavelength;
        let y;

        if (waveType === "sine") {
          y =
            centerY -
            amplitude * Math.sin(2 * Math.PI * normalizedX + currentPhase);
        } else if (waveType === "square") {
          const sineValue = Math.sin(2 * Math.PI * normalizedX + currentPhase);
          y = centerY - amplitude * (sineValue >= 0 ? 1 : -1);
        }

        points.push({ x, y: y as number });
      }

      return points;
    };

    // Draw wave
    const drawWave = (points: { x: number; y: number }[]) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw center line
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw amplitude lines
      ctx.beginPath();
      ctx.moveTo(0, centerY - amplitude);
      ctx.lineTo(canvas.width, centerY - amplitude);
      ctx.moveTo(0, centerY + amplitude);
      ctx.lineTo(canvas.width, centerY + amplitude);
      ctx.strokeStyle = "#eee";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw wave
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.strokeStyle = "hsl(215, 100%, 50%)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw information
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        `Wave type: ${waveType === "sine" ? "Sine" : "Square"}`,
        20,
        30,
      );
      ctx.fillText(`Amplitude: ${amplitude}`, 20, 50);
      ctx.fillText(`Frequency: ${frequency.toFixed(1)} Hz`, 20, 70);
      ctx.fillText(`Wavelength: ${(wavelength / 50).toFixed(1)} m`, 20, 90);
      ctx.fillText(`Period: ${(1 / frequency).toFixed(3)} s`, 20, 110);
    };

    // Animate wave
    const animate = (timestamp: number) => {
      if (!running) {
        const points = generateWavePoints(0);
        drawWave(points);
        return;
      }

      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
      lastTimestamp = timestamp;

      // Update phase
      phase += 2 * Math.PI * frequency * deltaTime;

      // Generate and draw wave
      const points = generateWavePoints(phase);
      drawWave(points);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation or draw static wave
    if (running) {
      phase = 0;
      lastTimestamp = null;
      animationFrameId = requestAnimationFrame(animate);
    } else {
      const points = generateWavePoints(0);
      drawWave(points);
    }

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [running, amplitude, frequency, waveType]);

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
