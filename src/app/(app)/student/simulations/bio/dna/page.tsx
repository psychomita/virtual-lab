"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, Pause, RotateCw, RefreshCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ExperimentLayout } from "@/components/simulations/explore/experiment-layout";
import type { QuestionType } from "@/components/simulations/explore/assessment";

export default function DNAReplicationPage() {
  return (
    <ExperimentLayout
      title="DNA Replication Experiment"
      labPath="/student/simulations/bio"
      theory={<DNAReplicationTheory />}
      procedure={<DNAReplicationProcedure />}
      simulation={<DNAReplicationSimulation />}
      assessment={dnaReplicationAssessment}
    />
  );
}

function DNAReplicationTheory() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">DNA Replication Theory</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          Introduction to DNA Replication
        </h3>
        <p>
          DNA replication is the biological process by which a cell makes an
          identical copy of its DNA before cell division. This process occurs in
          all living organisms and is essential for inheritance, growth, and
          repair.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Semi-Conservative Replication</h3>
        <p>
          DNA replication follows a semi-conservative model, where each new DNA
          molecule consists of one original (parental) strand and one newly
          synthesized strand. This mechanism was proven by the Meselson-Stahl
          experiment in 1958.
        </p>
        <div className="my-4 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
          <p className="font-mono text-lg">
            Parent DNA → 2 Daughter DNA molecules (each with 1 old + 1 new
            strand)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Key Enzymes Involved</h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Helicase:</strong> Unwinds and separates the DNA double
            helix by breaking hydrogen bonds between bases
          </li>
          <li>
            <strong>DNA Polymerase:</strong> Synthesizes new DNA strands by
            adding complementary nucleotides
          </li>
          <li>
            <strong>Primase:</strong> Synthesizes short RNA primers to initiate
            DNA synthesis
          </li>
          <li>
            <strong>Ligase:</strong> Joins Okazaki fragments on the lagging
            strand
          </li>
          <li>
            <strong>Topoisomerase:</strong> Prevents DNA from becoming overwound
            ahead of the replication fork
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Replication Fork Structure</h3>
        <p>
          The replication fork is the Y-shaped structure formed when DNA is
          being replicated. It has two distinct strands:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Leading Strand:</strong> Synthesized continuously in the
            5&apos; to 3&apos; direction toward the replication fork
          </li>
          <li>
            <strong>Lagging Strand:</strong> Synthesized discontinuously away
            from the replication fork in short segments called Okazaki fragments
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Base Pairing Rules</h3>
        <p>DNA nucleotides pair according to specific rules:</p>
        <div className="my-4 grid grid-cols-2 gap-4">
          <div className="rounded-md bg-red-50 p-3 text-center dark:bg-red-900/30">
            <p className="font-bold">Adenine (A)</p>
            <p>Pairs with</p>
            <p className="font-bold">Thymine (T)</p>
          </div>
          <div className="rounded-md bg-blue-50 p-3 text-center dark:bg-blue-900/30">
            <p className="font-bold">Guanine (G)</p>
            <p>Pairs with</p>
            <p className="font-bold">Cytosine (C)</p>
          </div>
        </div>
        <p>
          These pairings are maintained by hydrogen bonds (2 between A-T, 3
          between G-C).
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Proofreading and Repair</h3>
        <p>
          DNA polymerase has proofreading ability (3&apos; to 5&apos;
          exonuclease activity) to correct mismatched nucleotides. Additional
          repair mechanisms include:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Mismatch repair</li>
          <li>Nucleotide excision repair</li>
          <li>Base excision repair</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Biological Significance</h3>
        <p>DNA replication is crucial for:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Cell division (mitosis and meiosis)</li>
          <li>Transmission of genetic information to offspring</li>
          <li>Tissue repair and regeneration</li>
          <li>Growth and development of organisms</li>
        </ul>
      </div>
    </div>
  );
}

function DNAReplicationProcedure() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        DNA Replication Experimental Procedure
      </h2>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Objectives</h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>Understand the semi-conservative nature of DNA replication</li>
          <li>Identify the key enzymes involved in DNA replication</li>
          <li>Differentiate between leading and lagging strand synthesis</li>
          <li>Recognize the directionality of DNA synthesis</li>
          <li>Observe the formation of Okazaki fragments</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Materials Needed</h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>Computer with DNA replication simulation software</li>
          <li>Virtual lab notebook</li>
          <li>DNA model kit (optional)</li>
          <li>Animation tools (optional)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Step-by-Step Procedure</h3>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">
            Part 1: Observing DNA Structure
          </h4>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Launch the DNA replication simulation</li>
            <li>Examine the double helix structure of the DNA molecule</li>
            <li>Identify the 5&apos; and 3&apos; ends of each strand</li>
            <li>Note the antiparallel nature of the two strands</li>
            <li>Record the base sequence of a short DNA segment</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">
            Part 2: Initiating Replication
          </h4>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Click &quot;Start Replication&quot; to begin the simulation</li>
            <li>Observe helicase unwinding the DNA double helix</li>
            <li>Note the formation of the replication fork</li>
            <li>
              Watch single-strand binding proteins stabilize the separated
              strands
            </li>
            <li>Identify the RNA primers synthesized by primase</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">
            Part 3: Observing Strand Synthesis
          </h4>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              Follow DNA polymerase adding nucleotides to the leading strand
            </li>
            <li>
              Note the continuous synthesis in the 5&apos; to 3&apos; direction
            </li>
            <li>Observe the discontinuous synthesis on the lagging strand</li>
            <li>Identify Okazaki fragments being formed</li>
            <li>Watch DNA ligase joining the Okazaki fragments</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">Part 4: Analyzing Results</h4>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              Pause the simulation at various stages to examine the structures
            </li>
            <li>Compare the original DNA with the newly synthesized strands</li>
            <li>
              Verify that each new DNA molecule contains one original and one
              new strand
            </li>
            <li>Check for proper base pairing in the new strands</li>
            <li>Measure the time taken for complete replication</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">Part 5: Exploring Variables</h4>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Adjust the simulation speed to observe details</li>
            <li>Introduce mutations and observe repair mechanisms</li>
            <li>Test different DNA sequences to see if replication differs</li>
            <li>Remove specific enzymes and observe the consequences</li>
            <li>Rotate the view to examine the 3D structure</li>
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Data Analysis</h3>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Record the time taken for complete replication at different speeds
          </li>
          <li>Count the number of Okazaki fragments produced</li>
          <li>Calculate the approximate rate of nucleotide addition</li>
          <li>Compare the original and new DNA sequences for accuracy</li>
          <li>
            Diagram the replication fork with all major components labeled
          </li>
        </ol>
      </div>

      <div className="rounded-md bg-purple-50 p-4 dark:bg-purple-900/30">
        <h3 className="text-lg font-semibold">Safety Considerations</h3>
        <ul className="list-disc space-y-1 pl-6">
          <li>This is a virtual experiment - no physical hazards exist</li>
          <li>
            When working with actual DNA in a lab setting, follow proper
            biosafety protocols
          </li>
          <li>
            Wear appropriate personal protective equipment in a real lab
            environment
          </li>
          <li>
            Dispose of biological materials properly according to regulations
          </li>
        </ul>
      </div>
    </div>
  );
}

function DNAReplicationSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const animationRef = useRef<number>(0);

  // DNA base pairs
  const basePairs = [
    { base1: "A", base2: "T" },
    { base1: "T", base2: "A" },
    { base1: "G", base2: "C" },
    { base1: "C", base2: "G" },
    { base1: "A", base2: "T" },
    { base1: "G", base2: "C" },
    { base1: "T", base2: "A" },
    { base1: "A", base2: "T" },
    { base1: "C", base2: "G" },
    { base1: "G", base2: "C" },
  ];

  // Base colors
  const baseColors = {
    A: "#ff5252", // Adenine - red
    T: "#ffeb3b", // Thymine - yellow
    G: "#4caf50", // Guanine - green
    C: "#2196f3", // Cytosine - blue
  };

  // Animation loop
  useEffect(() => {
    let lastTime = 0;

    const animate = (currentTime: number) => {
      if (!isRunning) return;

      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Update progress
      setProgress((prev) => {
        const newProgress = prev + deltaTime * speed * 0.2;
        if (newProgress >= 1) {
          setIsRunning(false);
          return 1;
        }
        return newProgress;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, speed]);

  // Draw the DNA replication
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save the current state
    ctx.save();

    // Translate to center of canvas for rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw DNA double helix
    const centerX = canvas.width / 2;
    const startY = 50;
    const endY = 350;
    const width = 150;
    const basePairHeight = (endY - startY) / basePairs.length;

    // Draw backbone
    ctx.lineWidth = 5;

    // Left backbone
    ctx.beginPath();
    ctx.moveTo(centerX - width / 2, startY);
    ctx.bezierCurveTo(
      centerX - width / 2 - 50,
      startY + (endY - startY) / 3,
      centerX - width / 2 + 50,
      startY + (2 * (endY - startY)) / 3,
      centerX - width / 2,
      endY,
    );
    ctx.strokeStyle = "#9c27b0"; // Purple
    ctx.stroke();

    // Right backbone
    ctx.beginPath();
    ctx.moveTo(centerX + width / 2, startY);
    ctx.bezierCurveTo(
      centerX + width / 2 + 50,
      startY + (endY - startY) / 3,
      centerX + width / 2 - 50,
      startY + (2 * (endY - startY)) / 3,
      centerX + width / 2,
      endY,
    );
    ctx.strokeStyle = "#9c27b0"; // Purple
    ctx.stroke();

    // Calculate replication fork position
    const replicationY = startY + progress * (endY - startY);

    // Draw base pairs
    for (let i = 0; i < basePairs.length; i++) {
      const y = startY + i * basePairHeight;

      // Skip drawing original base pairs above replication fork
      if (y < replicationY) {
        // Draw replicated DNA

        // Left strand (leading strand)
        const leftX1 = centerX - width / 2 - 25 * Math.sin((i * Math.PI) / 5);
        const leftX2 = centerX;

        // Draw original template strand (left)
        ctx.beginPath();
        ctx.moveTo(leftX1, y);
        ctx.lineTo(leftX1 - 30, y);
        ctx.lineWidth = 3;
        ctx.strokeStyle =
          baseColors[basePairs[i].base1 as keyof typeof baseColors];
        ctx.stroke();

        // Draw new complementary strand (left)
        ctx.beginPath();
        ctx.moveTo(leftX1 - 30, y);
        ctx.lineTo(leftX1 - 60, y);
        ctx.lineWidth = 3;
        ctx.strokeStyle =
          baseColors[basePairs[i].base2 as keyof typeof baseColors];
        ctx.stroke();

        // Right strand (lagging strand)
        const rightX1 = centerX + width / 2 + 25 * Math.sin((i * Math.PI) / 5);
        const rightX2 = centerX;

        // Draw original template strand (right)
        ctx.beginPath();
        ctx.moveTo(rightX1, y);
        ctx.lineTo(rightX1 + 30, y);
        ctx.lineWidth = 3;
        ctx.strokeStyle =
          baseColors[basePairs[i].base2 as keyof typeof baseColors];
        ctx.stroke();

        // Draw new complementary strand (right)
        ctx.beginPath();
        ctx.moveTo(rightX1 + 30, y);
        ctx.lineTo(rightX1 + 60, y);
        ctx.lineWidth = 3;
        ctx.strokeStyle =
          baseColors[basePairs[i].base1 as keyof typeof baseColors];
        ctx.stroke();

        // Add base labels if enabled
        if (showLabels) {
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Left strand labels
          ctx.fillStyle = "#000";
          ctx.fillText(basePairs[i].base1, leftX1 - 15, y - 10);
          ctx.fillText(basePairs[i].base2, leftX1 - 45, y - 10);

          // Right strand labels
          ctx.fillText(basePairs[i].base2, rightX1 + 15, y - 10);
          ctx.fillText(basePairs[i].base1, rightX1 + 45, y - 10);
        }
      } else {
        // Draw original double helix below replication fork
        const leftX = centerX - width / 2 - 25 * Math.sin((i * Math.PI) / 5);
        const rightX = centerX + width / 2 + 25 * Math.sin((i * Math.PI) / 5);

        // Draw base pair connection
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#666666";
        ctx.stroke();

        // Draw base pair circles
        ctx.beginPath();
        ctx.arc(leftX, y, 10, 0, Math.PI * 2);
        ctx.fillStyle =
          baseColors[basePairs[i].base1 as keyof typeof baseColors];
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rightX, y, 10, 0, Math.PI * 2);
        ctx.fillStyle =
          baseColors[basePairs[i].base2 as keyof typeof baseColors];
        ctx.fill();

        // Add base labels if enabled
        if (showLabels) {
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#fff";
          ctx.fillText(basePairs[i].base1, leftX, y);
          ctx.fillText(basePairs[i].base2, rightX, y);
        }
      }
    }

    // Draw replication fork
    if (progress > 0 && progress < 1) {
      // Draw helicase enzyme
      ctx.beginPath();
      ctx.arc(centerX, replicationY, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#ff9800"; // Orange
      ctx.fill();
      ctx.strokeStyle = "#e65100";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (showLabels) {
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText("Helicase", centerX, replicationY);
      }

      // Draw DNA polymerase on leading strand
      ctx.beginPath();
      ctx.arc(centerX - width / 4, replicationY - 15, 15, 0, Math.PI * 2);
      ctx.fillStyle = "#8bc34a"; // Light green
      ctx.fill();
      ctx.strokeStyle = "#33691e";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (showLabels) {
        ctx.font = "9px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText("DNA Pol", centerX - width / 4, replicationY - 15);
      }

      // Draw DNA polymerase on lagging strand
      ctx.beginPath();
      ctx.arc(centerX + width / 4, replicationY - 15, 15, 0, Math.PI * 2);
      ctx.fillStyle = "#8bc34a"; // Light green
      ctx.fill();
      ctx.strokeStyle = "#33691e";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (showLabels) {
        ctx.font = "9px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText("DNA Pol", centerX + width / 4, replicationY - 15);
      }
    }

    // Draw legend
    const legendX = 50;
    const legendY = 50;
    const legendSpacing = 25;

    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "#000";
    ctx.fillText("DNA Bases:", legendX, legendY);

    // Adenine
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY + legendSpacing, 8, 0, Math.PI * 2);
    ctx.fillStyle = baseColors["A"];
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillText("A - Adenine", legendX + 25, legendY + legendSpacing + 5);

    // Thymine
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY + 2 * legendSpacing, 8, 0, Math.PI * 2);
    ctx.fillStyle = baseColors["T"];
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillText("T - Thymine", legendX + 25, legendY + 2 * legendSpacing + 5);

    // Guanine
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY + 3 * legendSpacing, 8, 0, Math.PI * 2);
    ctx.fillStyle = baseColors["G"];
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillText("G - Guanine", legendX + 25, legendY + 3 * legendSpacing + 5);

    // Cytosine
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY + 4 * legendSpacing, 8, 0, Math.PI * 2);
    ctx.fillStyle = baseColors["C"];
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillText("C - Cytosine", legendX + 25, legendY + 4 * legendSpacing + 5);

    // Restore the canvas state
    ctx.restore();
  }, [progress, rotation, showLabels, basePairs]);

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
  };

  return (
    <div className="w-full">
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>DNA Replication Simulation</CardTitle>
          <CardDescription>
            Observe how DNA replicates during cell division
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="rounded-md border bg-white"
          />

          <div className="mt-4 flex gap-4">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className="bg-purple-500 hover:bg-purple-600"
              disabled={progress >= 1}
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
            <Button
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              variant="outline"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Rotate View
            </Button>
          </div>

          <div className="mt-4 w-full text-sm text-gray-500">
            <div className="mb-1 flex justify-between">
              <span>Progress:</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-purple-600"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Animation Speed</label>
                <span className="text-sm text-gray-500">{speed}x</span>
              </div>
              <Slider
                value={[speed]}
                min={0.5}
                max={3}
                step={0.1}
                onValueChange={(value) => setSpeed(value[0])}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showLabels"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="showLabels" className="text-sm font-medium">
                Show Base Labels
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const dnaReplicationAssessment: QuestionType[] = [
  {
    id: "dna-q1",
    type: "multiple-choice",
    question:
      "What is the name of the enzyme that unwinds the DNA double helix during replication?",
    options: ["DNA Polymerase", "Helicase", "Ligase", "Primase"],
    correctAnswer: "Helicase",
    explanation:
      "Helicase is the enzyme responsible for unwinding and separating the DNA strands by breaking the hydrogen bonds between base pairs.",
  },
  {
    id: "dna-q2",
    type: "multiple-choice",
    question:
      "Which strand is synthesized continuously during DNA replication?",
    options: [
      "Leading strand",
      "Lagging strand",
      "Both strands",
      "Neither strand",
    ],
    correctAnswer: "Leading strand",
    explanation:
      "The leading strand is synthesized continuously in the 5' to 3' direction toward the replication fork.",
  },
  {
    id: "dna-q3",
    type: "multiple-choice",
    question: "What type of bond connects the complementary bases in DNA?",
    options: [
      "Ionic bonds",
      "Covalent bonds",
      "Hydrogen bonds",
      "Peptide bonds",
    ],
    correctAnswer: "Hydrogen bonds",
    explanation:
      "Complementary bases are connected by hydrogen bonds - 2 between adenine and thymine, and 3 between guanine and cytosine.",
  },
  {
    id: "dna-q4",
    type: "multiple-choice",
    question: "Which of the following correctly pairs DNA bases?",
    options: ["A with G", "T with C", "A with T", "G with T"],
    correctAnswer: "A with T",
    explanation:
      "Adenine (A) always pairs with Thymine (T), and Guanine (G) always pairs with Cytosine (C) in DNA.",
  },
  {
    id: "dna-q5",
    type: "multiple-choice",
    question: "What is the function of DNA ligase in replication?",
    options: [
      "Unwinds the DNA helix",
      "Adds new nucleotides",
      "Joins Okazaki fragments",
      "Synthesizes RNA primers",
    ],
    correctAnswer: "Joins Okazaki fragments",
    explanation:
      "DNA ligase joins the Okazaki fragments on the lagging strand by forming phosphodiester bonds between them.",
  },
  {
    id: "dna-q6",
    type: "multiple-choice",
    question: "What is the direction of DNA synthesis?",
    options: [
      "3' to 5'",
      "5' to 3'",
      "Both directions",
      "Depends on the strand",
    ],
    correctAnswer: "5' to 3'",
    explanation:
      "DNA polymerase can only add nucleotides to the 3' end of a growing strand, so synthesis always proceeds in the 5' to 3' direction.",
  },
  {
    id: "dna-q7",
    type: "open-ended",
    question: "Explain why the lagging strand is synthesized discontinuously.",
    explanation:
      "The lagging strand is synthesized discontinuously because DNA polymerase can only add nucleotides in the 5' to 3' direction. Since the lagging strand runs in the opposite direction (3' to 5') relative to the replication fork, it must be synthesized in short segments (Okazaki fragments) that are later joined together by DNA ligase.",
  },
  {
    id: "dna-q8",
    type: "open-ended",
    question: "Describe the semi-conservative model of DNA replication.",
    explanation:
      "The semi-conservative model of DNA replication states that each new DNA molecule consists of one original (parental) strand and one newly synthesized strand. This was proven by the Meselson-Stahl experiment and ensures genetic continuity while allowing for genetic variation through mutations during replication.",
  },
];
