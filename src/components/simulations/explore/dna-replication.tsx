"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function DNAReplication() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const steps = [
    "DNA double helix begins to unwind",
    "Helicase enzyme separates the strands",
    "DNA polymerase adds complementary nucleotides",
    "Leading strand is synthesized continuously",
    "Lagging strand is synthesized in fragments",
    "DNA ligase joins Okazaki fragments",
    "Two identical DNA molecules are formed",
  ];

  const toggleSimulation = () => {
    setRunning(!running);
  };

  const resetSimulation = () => {
    setRunning(false);
    setProgress(0);
    setStep(0);
  };

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + speed / 10;

        // Update step based on progress
        const newStep = Math.min(
          Math.floor(newProgress / (100 / steps.length)),
          steps.length - 1,
        );
        setStep(newStep);

        if (newProgress >= 100) {
          setRunning(false);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [running, speed, steps.length]);

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

    // Draw DNA replication based on progress
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dnaLength = Math.min(canvas.width, canvas.height) * 0.8;

    // Define base pair colors
    const baseColors = {
      A: "#ff5252", // Adenine - red
      T: "#2196f3", // Thymine - blue
      G: "#4caf50", // Guanine - green
      C: "#ff9800", // Cytosine - orange
    };

    // Create a DNA sequence
    const createDNASequence = (length: number) => {
      const bases = ["A", "T", "G", "C"];
      const sequence = [];

      for (let i = 0; i < length; i++) {
        sequence.push(bases[Math.floor(Math.random() * bases.length)]);
      }

      return sequence;
    };

    // Get complementary base
    const getComplementaryBase = (base: string) => {
      const pairs: Record<string, string> = {
        A: "T",
        T: "A",
        G: "C",
        C: "G",
      };
      return pairs[base];
    };

    // Draw DNA double helix
    const drawDNA = () => {
      const sequence = createDNASequence(20);
      const segmentLength = dnaLength / sequence.length;

      // Calculate how much of the DNA is unwound based on progress
      const unwoundPoint = Math.floor((progress / 100) * sequence.length);

      // Draw the double helix
      for (let i = 0; i < sequence.length; i++) {
        const base = sequence[i];
        const complementaryBase = getComplementaryBase(base);

        const x = centerX;
        const y = centerY - dnaLength / 2 + i * segmentLength;

        // Draw original strand
        const originalX1 = x - 40 * Math.sin(i * 0.5);
        const originalX2 = x + 40 * Math.sin(i * 0.5);

        // Draw complementary strand
        // const complementaryX1 = originalX1;
        // const complementaryX2 = originalX2;

        // Determine if this segment is unwound
        const isUnwound = i >= unwoundPoint;

        if (!isUnwound) {
          // Draw connected base pairs
          ctx.beginPath();
          ctx.moveTo(originalX1, y);
          ctx.lineTo(originalX2, y);
          ctx.strokeStyle = "#666";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw bases
          ctx.beginPath();
          ctx.arc(originalX1, y, 10, 0, Math.PI * 2);
          ctx.fillStyle = baseColors[base as keyof typeof baseColors];
          ctx.fill();

          ctx.beginPath();
          ctx.arc(originalX2, y, 10, 0, Math.PI * 2);
          ctx.fillStyle =
            baseColors[complementaryBase as keyof typeof baseColors];
          ctx.fill();
        } else {
          // Draw separated strands
          const separation = Math.min(80, (i - unwoundPoint) * 10);

          // Original strand moves left
          const separatedX1 = originalX1 - separation;

          // Complementary strand moves right
          const separatedX2 = originalX2 + separation;

          // Draw bases on original strand
          ctx.beginPath();
          ctx.arc(separatedX1, y, 10, 0, Math.PI * 2);
          ctx.fillStyle = baseColors[base as keyof typeof baseColors];
          ctx.fill();

          // Draw bases on complementary strand
          ctx.beginPath();
          ctx.arc(separatedX2, y, 10, 0, Math.PI * 2);
          ctx.fillStyle =
            baseColors[complementaryBase as keyof typeof baseColors];
          ctx.fill();

          // Draw new complementary bases if replication has progressed to this point
          if (progress > 30 && i <= unwoundPoint + (progress - 30) / 5) {
            // New complementary base for original strand
            ctx.beginPath();
            ctx.arc(separatedX1 + 20, y, 8, 0, Math.PI * 2);
            ctx.fillStyle =
              baseColors[complementaryBase as keyof typeof baseColors];
            ctx.fill();

            // New complementary base for complementary strand
            ctx.beginPath();
            ctx.arc(separatedX2 - 20, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = baseColors[base as keyof typeof baseColors];
            ctx.fill();
          }
        }
      }

      // Draw DNA polymerase if replication has started
      if (progress > 30) {
        const polymeraseY =
          centerY -
          dnaLength / 2 +
          (unwoundPoint + (progress - 30) / 5) * segmentLength;

        // Leading strand polymerase
        ctx.beginPath();
        ctx.arc(centerX - 80, polymeraseY, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#9c27b0";
        ctx.fill();

        // Lagging strand polymerase
        ctx.beginPath();
        ctx.arc(centerX + 80, polymeraseY - 20, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#9c27b0";
        ctx.fill();
      }

      // Draw helicase if unwinding has started
      if (unwoundPoint > 0) {
        const helicaseY =
          centerY - dnaLength / 2 + unwoundPoint * segmentLength;

        ctx.beginPath();
        ctx.arc(centerX, helicaseY, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#ff9800";
        ctx.fill();
      }
    };

    drawDNA();
  }, [progress]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-semibold">DNA Replication Simulation</h2>
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

        <div
          className="relative overflow-hidden rounded-lg bg-gray-50"
          style={{ height: "400px" }}
        >
          <canvas ref={canvasRef} className="h-full w-full" />

          {!running && progress === 0 && (
            <div className="text-muted-foreground absolute inset-0 flex items-center justify-center bg-white/50">
              Start the simulation to view DNA replication
            </div>
          )}

          <div className="absolute right-4 bottom-4 left-4">
            <div className="rounded bg-white/80 p-2 text-sm">
              <div className="mb-2 flex justify-between">
                <span>Progress: {Math.round(progress)}%</span>
                <span>Speed: {speed}x</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
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
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Replication Process</h3>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="text-md mb-2 font-semibold">Current Step</h4>
            <p className="text-sm">{steps[step]}</p>
          </div>

          <div className="space-y-2">
            {steps.map((stepText, index) => (
              <div
                key={index}
                className={`rounded-lg border p-2 ${index === step ? "border-primary bg-primary/10" : "border-gray-200"}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${index === step ? "bg-primary text-white" : "bg-gray-200"}`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm">{stepText}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <h4 className="mb-2 text-sm font-medium">Key Enzymes:</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="font-medium">Helicase:</span> Unwinds the DNA
                double helix
              </li>
              <li>
                <span className="font-medium">DNA Polymerase:</span> Adds
                complementary nucleotides
              </li>
              <li>
                <span className="font-medium">Primase:</span> Creates RNA
                primers
              </li>
              <li>
                <span className="font-medium">DNA Ligase:</span> Joins Okazaki
                fragments
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
