"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Beaker, Droplets, RotateCcw, Flame } from "lucide-react";

export function ChemistrySimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [liquid1Amount, setLiquid1Amount] = useState(0);
  const [liquid2Amount, setLiquid2Amount] = useState(0);
  const [reactionState, setReactionState] = useState<
    "idle" | "reacting" | "complete"
  >("idle");
  const [bubbles, setBubbles] = useState<
    Array<{
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
    }>
  >([]);
  const [sparkles, setSparkles] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      color: string;
    }>
  >([]);
  const [heat, setHeat] = useState(false);

  // Colors
  const liquid1Color = "#3b82f6"; // blue
  const liquid2Color = "#f59e0b"; // amber
  const reactionColor = "#10b981"; // emerald
  const finalColor = "#8b5cf6"; // violet

  // Reset experiment
  const resetExperiment = () => {
    setLiquid1Amount(0);
    setLiquid2Amount(0);
    setReactionState("idle");
    setBubbles([]);
    setSparkles([]);
    setHeat(false);
  };

  // Add liquid 1 (blue)
  const addLiquid1 = () => {
    if (reactionState === "complete") return;
    if (liquid1Amount < 100) {
      setLiquid1Amount((prev) => Math.min(100, prev + 20));
    }
  };

  // Add liquid 2 (amber)
  const addLiquid2 = () => {
    if (reactionState === "complete") return;
    if (liquid2Amount < 100) {
      setLiquid2Amount((prev) => Math.min(100, prev + 20));
    }
  };

  // Toggle heat
  const toggleHeat = () => {
    if (reactionState === "complete") return;
    setHeat((prev) => !prev);
  };

  // Check if reaction should start
  useEffect(() => {
    if (
      liquid1Amount > 0 &&
      liquid2Amount > 0 &&
      heat &&
      reactionState === "idle"
    ) {
      setReactionState("reacting");

      // Create initial bubbles
      const newBubbles = [];
      for (let i = 0; i < 15; i++) {
        newBubbles.push({
          x: 100 + Math.random() * 200,
          y: 300 + Math.random() * 50,
          radius: 3 + Math.random() * 8,
          speed: 0.5 + Math.random() * 2,
          opacity: 0.7 + Math.random() * 0.3,
        });
      }
      setBubbles(newBubbles);

      // Complete reaction after some time
      setTimeout(() => {
        setReactionState("complete");

        // Create sparkles for completion effect
        const newSparkles = [];
        for (let i = 0; i < 30; i++) {
          newSparkles.push({
            x: 100 + Math.random() * 200,
            y: 200 + Math.random() * 150,
            size: 1 + Math.random() * 3,
            opacity: 0.7 + Math.random() * 0.3,
            color: ["#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#3b82f6"][
              Math.floor(Math.random() * 5)
            ],
          });
        }
        setSparkles(newSparkles);
      }, 5000);
    }
  }, [liquid1Amount, liquid2Amount, heat, reactionState]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Handle window resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Animation variables
    let animationFrameId: number;

    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw beaker
      const beakerWidth = 300;
      const beakerHeight = 350;
      const beakerX = (canvas.width - beakerWidth) / 2;
      const beakerY = (canvas.height - beakerHeight) / 2;

      // Draw beaker outline
      ctx.beginPath();
      ctx.moveTo(beakerX, beakerY);
      ctx.lineTo(beakerX, beakerY + beakerHeight);
      ctx.lineTo(beakerX + beakerWidth, beakerY + beakerHeight);
      ctx.lineTo(beakerX + beakerWidth, beakerY);
      ctx.lineTo(beakerX + beakerWidth - 40, beakerY);
      ctx.lineTo(beakerX + beakerWidth - 60, beakerY - 30);
      ctx.lineTo(beakerX + 60, beakerY - 30);
      ctx.lineTo(beakerX + 40, beakerY);
      ctx.closePath();
      ctx.strokeStyle = "#94a3b8"; // slate-400
      ctx.lineWidth = 3;
      ctx.stroke();

      // Calculate liquid heights
      const maxLiquidHeight = beakerHeight * 0.8;
      const liquid1Height = (liquid1Amount / 100) * maxLiquidHeight;
      const liquid2Height = (liquid2Amount / 100) * maxLiquidHeight;

      // Draw liquids based on reaction state
      if (reactionState === "idle") {
        // Draw liquid 1 (blue)
        if (liquid1Amount > 0) {
          ctx.beginPath();
          ctx.rect(
            beakerX + 3,
            beakerY + beakerHeight - liquid1Height,
            beakerWidth - 6,
            liquid1Height,
          );
          ctx.fillStyle = liquid1Color;
          ctx.fill();
        }

        // Draw liquid 2 (amber) - floats on top if both present
        if (liquid2Amount > 0) {
          ctx.beginPath();
          ctx.rect(
            beakerX + 3,
            beakerY + beakerHeight - liquid1Height - liquid2Height,
            beakerWidth - 6,
            liquid2Height,
          );
          ctx.fillStyle = liquid2Color;
          ctx.fill();
        }
      } else if (reactionState === "reacting") {
        // Draw mixed/reacting liquid
        const totalHeight = liquid1Height + liquid2Height;

        // Create gradient for reacting liquid
        const gradient = ctx.createLinearGradient(
          beakerX,
          beakerY + beakerHeight - totalHeight,
          beakerX,
          beakerY + beakerHeight,
        );
        gradient.addColorStop(0, liquid2Color);
        gradient.addColorStop(0.5, reactionColor);
        gradient.addColorStop(1, liquid1Color);

        ctx.beginPath();
        ctx.rect(
          beakerX + 3,
          beakerY + beakerHeight - totalHeight,
          beakerWidth - 6,
          totalHeight,
        );
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw bubbles
        bubbles.forEach((bubble, index) => {
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`;
          ctx.fill();

          // Move bubble up
          bubbles[index].y -= bubble.speed;

          // Reset bubble if it reaches the top
          if (bubble.y < beakerY + beakerHeight - totalHeight + bubble.radius) {
            bubbles[index].y = beakerY + beakerHeight - bubble.radius;
            bubbles[index].x =
              beakerX + 20 + Math.random() * (beakerWidth - 40);
          }
        });
      } else if (reactionState === "complete") {
        // Draw final liquid
        const totalHeight = liquid1Height + liquid2Height;

        ctx.beginPath();
        ctx.rect(
          beakerX + 3,
          beakerY + beakerHeight - totalHeight,
          beakerWidth - 6,
          totalHeight,
        );
        ctx.fillStyle = finalColor;
        ctx.fill();

        // Draw sparkles
        sparkles.forEach((sparkle, index) => {
          ctx.beginPath();
          ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
          ctx.fillStyle = `${sparkle.color}${Math.floor(sparkle.opacity * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.fill();

          // Fade out sparkle
          sparkles[index].opacity -= 0.005;

          // Move sparkle randomly
          sparkles[index].x += (Math.random() - 0.5) * 2;
          sparkles[index].y += (Math.random() - 0.5) * 2;

          // Create new sparkle if this one fades out
          if (sparkle.opacity <= 0) {
            sparkles[index] = {
              x: beakerX + 20 + Math.random() * (beakerWidth - 40),
              y:
                beakerY +
                beakerHeight -
                totalHeight +
                Math.random() * totalHeight,
              size: 1 + Math.random() * 3,
              opacity: 0.7 + Math.random() * 0.3,
              color: ["#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#3b82f6"][
                Math.floor(Math.random() * 5)
              ],
            };
          }
        });
      }

      // Draw heat source if active
      if (heat) {
        // Draw flame
        const flameX = beakerX + beakerWidth / 2;
        const flameY = beakerY + beakerHeight + 30;

        // Create flame gradient
        const flameGradient = ctx.createRadialGradient(
          flameX,
          flameY,
          5,
          flameX,
          flameY,
          40,
        );
        flameGradient.addColorStop(0, "#f97316"); // orange-500
        flameGradient.addColorStop(0.6, "#ef4444"); // red-500
        flameGradient.addColorStop(1, "rgba(239, 68, 68, 0)"); // transparent red

        ctx.beginPath();
        ctx.arc(flameX, flameY, 40, 0, Math.PI * 2);
        ctx.fillStyle = flameGradient;
        ctx.fill();

        // Draw burner
        ctx.beginPath();
        ctx.rect(flameX - 60, flameY + 10, 120, 10);
        ctx.fillStyle = "#475569"; // slate-600
        ctx.fill();
      }

      // Draw labels
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#1e293b"; // slate-800
      ctx.textAlign = "center";

      if (reactionState === "idle") {
        if (liquid1Amount > 0) {
          ctx.fillText(
            "Copper Sulfate",
            beakerX + beakerWidth / 2,
            beakerY + beakerHeight - liquid1Height / 2,
          );
        }
        if (liquid2Amount > 0) {
          ctx.fillText(
            "Sodium Hydroxide",
            beakerX + beakerWidth / 2,
            beakerY + beakerHeight - liquid1Height - liquid2Height / 2,
          );
        }
      } else if (reactionState === "reacting") {
        ctx.fillText(
          "Reacting...",
          beakerX + beakerWidth / 2,
          beakerY + beakerHeight - (liquid1Height + liquid2Height) / 2,
        );
      } else if (reactionState === "complete") {
        ctx.fillText(
          "Copper Hydroxide",
          beakerX + beakerWidth / 2,
          beakerY + beakerHeight - (liquid1Height + liquid2Height) / 2,
        );
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    liquid1Amount,
    liquid2Amount,
    reactionState,
    bubbles,
    sparkles,
    heat,
    liquid1Color,
    liquid2Color,
    reactionColor,
    finalColor,
  ]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
      <div className="absolute top-4 left-4 z-10 rounded-lg bg-white/80 p-3 shadow-md backdrop-blur-sm dark:bg-slate-800/80">
        <h3 className="mb-1 text-lg font-bold text-blue-600 dark:text-blue-400">
          Chemical Reaction Lab
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {reactionState === "idle"
            ? "Mix chemicals and apply heat to start a reaction"
            : reactionState === "reacting"
              ? "Watch the chemical reaction in progress!"
              : "Reaction complete! Copper Hydroxide formed"}
        </p>
      </div>

      <canvas ref={canvasRef} className="h-full w-full" />

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-blue-500 bg-blue-500/20 hover:bg-blue-500/30"
          onClick={addLiquid1}
          disabled={reactionState === "complete"}
        >
          <Beaker className="mr-1 h-4 w-4 text-blue-600" />
          Add CuSO₄
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500 bg-amber-500/20 hover:bg-amber-500/30"
          onClick={addLiquid2}
          disabled={reactionState === "complete"}
        >
          <Droplets className="mr-1 h-4 w-4 text-amber-600" />
          Add NaOH
        </Button>
        <Button
          size="sm"
          variant={heat ? "default" : "outline"}
          className={
            heat
              ? "bg-red-500 hover:bg-red-600"
              : "border-red-500 bg-red-500/20 hover:bg-red-500/30"
          }
          onClick={toggleHeat}
          disabled={reactionState === "complete"}
        >
          <Flame
            className={`mr-1 h-4 w-4 ${heat ? "text-white" : "text-red-600"}`}
          />
          {heat ? "Heat On" : "Heat Off"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-500 bg-slate-500/20 hover:bg-slate-500/30"
          onClick={resetExperiment}
        >
          <RotateCcw className="mr-1 h-4 w-4 text-slate-600" />
          Reset
        </Button>
      </div>
    </div>
  );
}
