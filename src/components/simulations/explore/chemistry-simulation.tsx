"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface ChemistrySimulationProps {
  chemical: string;
  concentration: number;
  temperature: number;
  running: boolean;
  data: number[];
}

export default function ChemistrySimulation({
  chemical,
  concentration,
  temperature,
  running,
  data,
}: ChemistrySimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Map chemicals to colors
  const chemicalColors = useMemo(
    () => ({
      hcl: "#f8e16c",
      naoh: "#6cb4f8",
      h2so4: "#f86c6c",
    }),
    [],
  );

  // Get current color based on selected chemical
  const getChemicalColor = useCallback(() => {
    return chemicalColors[chemical as keyof typeof chemicalColors];
  }, [chemical, chemicalColors]);

  // Animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let bubbles: { x: number; y: number; radius: number; speed: number }[] = [];
    let animationFrameId: number;

    // Create initial bubbles
    const createBubbles = () => {
      bubbles = [];
      const bubbleCount = Math.floor(concentration * 10) + 5;

      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 20,
          radius: Math.random() * 4 + 2,
          speed: Math.random() * 1 + 0.5,
        });
      }
    };

    // Draw beaker
    const drawBeaker = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw beaker
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.2, canvas.height * 0.1);
      ctx.lineTo(canvas.width * 0.2, canvas.height * 0.9);
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.9);
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.1);
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw liquid
      ctx.fillStyle = getChemicalColor();
      ctx.globalAlpha = 0.7;
      ctx.fillRect(
        canvas.width * 0.2,
        canvas.height * 0.3,
        canvas.width * 0.6,
        canvas.height * 0.6,
      );
      ctx.globalAlpha = 1;

      // Draw measurement lines
      for (let i = 1; i <= 5; i++) {
        const y = canvas.height * 0.9 - i * canvas.height * 0.1;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.2, y);
        ctx.lineTo(canvas.width * 0.25, y);
        ctx.stroke();

        ctx.font = "10px Arial";
        ctx.fillStyle = "#666";
        ctx.fillText(`${i * 20}ml`, canvas.width * 0.1, y + 3);
      }

      // Draw temperature indicator
      const tempHeight =
        canvas.height * 0.8 - (temperature / 100) * canvas.height * 0.5;
      ctx.beginPath();
      ctx.arc(canvas.width * 0.9, tempHeight, 5, 0, Math.PI * 2);
      ctx.fillStyle = temperature > 50 ? "#f86c6c" : "#6cb4f8";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.9, tempHeight);
      ctx.lineTo(canvas.width * 0.9, canvas.height * 0.8);
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "10px Arial";
      ctx.fillStyle = "#666";
      ctx.fillText(
        `${temperature}°C`,
        canvas.width * 0.85,
        canvas.height * 0.85,
      );
    };

    // Draw bubbles
    const drawBubbles = () => {
      if (!running) return;

      ctx.fillStyle = "#ffffff";
      bubbles.forEach((bubble) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Move bubble up
        bubble.y -= bubble.speed * (temperature / 25);

        // Reset bubble if it goes off screen
        if (bubble.y < canvas.height * 0.3) {
          bubble.y = canvas.height * 0.9;
          bubble.x = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
        }
      });
    };

    // Animation loop
    const animate = () => {
      drawBeaker();
      drawBubbles();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    createBubbles();
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [chemical, concentration, temperature, running, getChemicalColor]);

  return (
    <div className="relative">
      <div className="mb-4 flex justify-between">
        <h3 className="text-lg font-medium">Chemical Reaction Simulation</h3>
        <Badge variant={running ? "default" : "outline"}>
          {running ? "Experiment Running" : "Ready"}
        </Badge>
      </div>

      <div
        className="relative overflow-hidden rounded-lg bg-gray-50"
        style={{ height: "400px" }}
      >
        <canvas ref={canvasRef} className="h-full w-full" />

        {!running && data.length === 0 && (
          <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
            Configure parameters and start the experiment
          </div>
        )}
      </div>

      <div className="text-muted-foreground mt-4 text-sm">
        <p>
          {chemical === "hcl" && "Hydrochloric Acid (HCl)"}
          {chemical === "naoh" && "Sodium Hydroxide (NaOH)"}
          {chemical === "h2so4" && "Sulfuric Acid (H₂SO₄)"}
          {" at "}
          {concentration.toFixed(1)} mol/L concentration and {temperature}°C
        </p>
      </div>
    </div>
  );
}
