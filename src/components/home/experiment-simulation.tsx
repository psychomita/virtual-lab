"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Flame, ThermometerSnowflake } from "lucide-react";

export function ExperimentSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [temperature, setTemperature] = useState(25);
  const [state, setState] = useState<"solid" | "liquid" | "gas">("liquid");
  const [isHeating, setIsHeating] = useState(false);
  const [isCooling, setIsCooling] = useState(false);
  const [particleSpeed, setParticleSpeed] = useState(1);
  const [particleColor, setParticleColor] = useState("#3b82f6"); // blue-500

  // Particle system
  const particles = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; radius: number }>
  >([]);

  // Initialize particles
  useEffect(() => {
    if (particles.current.length === 0) {
      for (let i = 0; i < 100; i++) {
        particles.current.push({
          x: Math.random() * 400,
          y: 200 + Math.random() * 150,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          radius: 3 + Math.random() * 3,
        });
      }
    }
  }, [particleSpeed]);

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

      // Draw container
      ctx.beginPath();
      ctx.roundRect(50, 50, canvas.width - 100, canvas.height - 100, 20);
      ctx.strokeStyle = "#94a3b8"; // slate-400
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw liquid/solid/gas
      if (state === "liquid" || state === "gas") {
        // Draw particles
        particles.current.forEach((particle) => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.fill();

          // Update particle position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off walls
          if (particle.x < 60) {
            particle.x = 60;
            particle.vx *= -1;
          }
          if (particle.x > canvas.width - 60) {
            particle.x = canvas.width - 60;
            particle.vx *= -1;
          }

          if (state === "liquid") {
            // Liquid particles stay at bottom with some movement
            if (particle.y < 200) {
              particle.vy += 0.1; // Gravity
            }
            if (particle.y > canvas.height - 60) {
              particle.y = canvas.height - 60;
              particle.vy *= -0.5;
            }
          } else {
            // Gas particles move everywhere
            if (particle.y < 60) {
              particle.y = 60;
              particle.vy *= -1;
            }
            if (particle.y > canvas.height - 60) {
              particle.y = canvas.height - 60;
              particle.vy *= -1;
            }
          }
        });
      } else {
        // Draw solid
        ctx.beginPath();
        ctx.roundRect(70, canvas.height - 170, canvas.width - 140, 100, 10);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Draw crystal structure
        for (let x = 90; x < canvas.width - 90; x += 20) {
          for (let y = canvas.height - 160; y < canvas.height - 80; y += 20) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          }
        }
      }

      // Draw thermometer
      ctx.beginPath();
      ctx.roundRect(canvas.width - 40, 70, 20, canvas.height - 140, 10);
      ctx.fillStyle = "#f1f5f9"; // slate-100
      ctx.fill();
      ctx.strokeStyle = "#94a3b8"; // slate-400
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw temperature level
      const tempHeight = ((temperature - 0) / 100) * (canvas.height - 160);
      ctx.beginPath();
      ctx.roundRect(
        canvas.width - 35,
        canvas.height - 80 - tempHeight,
        10,
        tempHeight,
        5,
      );

      // Color based on temperature
      let tempColor;
      if (temperature < 30)
        tempColor = "#3b82f6"; // blue-500
      else if (temperature < 70)
        tempColor = "#ef4444"; // red-500
      else tempColor = "#f97316"; // orange-500

      ctx.fillStyle = tempColor;
      ctx.fill();

      // Draw temperature text
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#1e293b"; // slate-800
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(temperature)}°C`, canvas.width - 30, 50);

      // Update temperature based on heating/cooling
      if (isHeating && temperature < 100) {
        setTemperature((prev) => Math.min(100, prev + 0.5));
      } else if (isCooling && temperature > 0) {
        setTemperature((prev) => Math.max(0, prev - 0.5));
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, isHeating, isCooling, particleColor]);

  // Update state and particle behavior based on temperature
  useEffect(() => {
    if (temperature < 20) {
      setState("solid");
      setParticleColor("#3b82f6"); // blue-500
    } else if (temperature > 80) {
      setState("gas");
      setParticleSpeed(3);
      setParticleColor("#f97316"); // orange-500
    } else {
      setState("liquid");
      setParticleSpeed(1);
      setParticleColor("#3b82f6"); // blue-500
    }

    // Update particle velocities
    particles.current.forEach((particle) => {
      particle.vx = (Math.random() - 0.5) * particleSpeed;
      particle.vy = (Math.random() - 0.5) * particleSpeed;
    });
  }, [temperature, particleSpeed]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
      <div className="absolute top-4 left-4 z-10 rounded-lg bg-white/80 p-2 shadow-md backdrop-blur-sm dark:bg-slate-800/80">
        <h3 className="mb-1 text-lg font-bold text-blue-600 dark:text-blue-400">
          States of Matter
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {state === "solid"
            ? "Solid state - molecules are tightly packed"
            : state === "liquid"
              ? "Liquid state - molecules flow freely"
              : "Gas state - molecules move rapidly"}
        </p>
      </div>

      <canvas ref={canvasRef} className="h-full w-full" />

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-2">
        <Button
          size="sm"
          variant="outline"
          className={`border-blue-500 bg-blue-500/20 hover:bg-blue-500/30 ${isCooling ? "ring-2 ring-blue-500" : ""}`}
          onMouseDown={() => setIsCooling(true)}
          onMouseUp={() => setIsCooling(false)}
          onMouseLeave={() => setIsCooling(false)}
          onTouchStart={() => setIsCooling(true)}
          onTouchEnd={() => setIsCooling(false)}
        >
          <ThermometerSnowflake className="mr-1 h-4 w-4 text-blue-600" />
          Cool
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={`border-red-500 bg-red-500/20 hover:bg-red-500/30 ${isHeating ? "ring-2 ring-red-500" : ""}`}
          onMouseDown={() => setIsHeating(true)}
          onMouseUp={() => setIsHeating(false)}
          onMouseLeave={() => setIsHeating(false)}
          onTouchStart={() => setIsHeating(true)}
          onTouchEnd={() => setIsHeating(false)}
        >
          <Flame className="mr-1 h-4 w-4 text-red-600" />
          Heat
        </Button>
      </div>
    </div>
  );
}
