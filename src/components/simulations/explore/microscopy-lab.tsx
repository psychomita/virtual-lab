"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function MicroscopyLab() {
  const [specimenType, setSpecimenType] = useState("blood");
  const [magnification, setMagnification] = useState(100);
  const [focus, setFocus] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [brightness, setBrightness] = useState(50);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const specimens = {
    blood: {
      name: "Blood Smear",
      description: "A thin layer of blood spread on a microscope slide.",
      features: [
        {
          id: "rbc",
          name: "Red Blood Cells",
          description: "Biconcave discs that carry oxygen throughout the body.",
        },
        {
          id: "wbc",
          name: "White Blood Cells",
          description:
            "Immune cells that protect the body against infection and disease.",
        },
        {
          id: "platelets",
          name: "Platelets",
          description: "Cell fragments that help with blood clotting.",
        },
      ],
    },
    cheek: {
      name: "Cheek Cells",
      description: "Epithelial cells collected from the inside of the cheek.",
      features: [
        {
          id: "nucleus",
          name: "Nucleus",
          description: "Contains the cell's genetic material.",
        },
        {
          id: "membrane",
          name: "Cell Membrane",
          description: "Selectively permeable barrier that surrounds the cell.",
        },
        {
          id: "cytoplasm",
          name: "Cytoplasm",
          description: "Gel-like substance that fills the cell.",
        },
      ],
    },
    onion: {
      name: "Onion Skin",
      description: "Thin layer of cells from an onion bulb.",
      features: [
        {
          id: "cell-wall",
          name: "Cell Wall",
          description:
            "Rigid outer layer that provides structure and protection.",
        },
        {
          id: "nucleus",
          name: "Nucleus",
          description: "Contains the cell's genetic material.",
        },
        {
          id: "vacuole",
          name: "Vacuole",
          description:
            "Large, fluid-filled organelle that maintains turgor pressure.",
        },
      ],
    },
    pond: {
      name: "Pond Water",
      description: "Sample of water from a pond containing microorganisms.",
      features: [
        {
          id: "paramecium",
          name: "Paramecium",
          description: "Single-celled organisms with cilia for movement.",
        },
        {
          id: "algae",
          name: "Algae",
          description: "Photosynthetic microorganisms.",
        },
        {
          id: "amoeba",
          name: "Amoeba",
          description: "Single-celled organisms that move using pseudopodia.",
        },
      ],
    },
  };

  // Canvas rendering
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

    // Apply brightness and contrast
    ctx.filter = `brightness(${brightness / 50}) contrast(${contrast / 50})`;

    // Draw microscope view (circular)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;

    // Draw microscope field
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#f5f5f5";
    ctx.fill();
    ctx.clip(); // Clip to the circle

    // Draw specimen based on type and magnification
    if (specimenType === "blood") {
      // Draw blood cells
      const cellCount = Math.floor(magnification / 10);
      const cellSize = Math.max(5, Math.min(20, magnification / 50));

      // Red blood cells
      ctx.fillStyle = "#e57373";
      for (let i = 0; i < cellCount * 5; i++) {
        const x = centerX + (Math.random() - 0.5) * radius * 1.8;
        const y = centerY + (Math.random() - 0.5) * radius * 1.8;

        ctx.beginPath();
        ctx.arc(x, y, cellSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw biconcave shape
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = "#ef9a9a";
        ctx.fill();
      }

      // White blood cells
      ctx.fillStyle = "#b39ddb";
      for (let i = 0; i < cellCount / 5; i++) {
        const x = centerX + (Math.random() - 0.5) * radius * 1.8;
        const y = centerY + (Math.random() - 0.5) * radius * 1.8;
        const size = cellSize * 1.5;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw nucleus
        ctx.beginPath();
        ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "#7e57c2";
        ctx.fill();
      }

      // Platelets
      ctx.fillStyle = "#ffcc80";
      for (let i = 0; i < cellCount; i++) {
        const x = centerX + (Math.random() - 0.5) * radius * 1.8;
        const y = centerY + (Math.random() - 0.5) * radius * 1.8;
        const size = cellSize * 0.4;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (specimenType === "cheek") {
      // Draw cheek cells
      const cellCount = Math.floor(magnification / 50);
      const cellSize = Math.max(30, Math.min(80, magnification / 5));

      for (let i = 0; i < cellCount; i++) {
        const x = centerX + (Math.random() - 0.5) * radius * 1.5;
        const y = centerY + (Math.random() - 0.5) * radius * 1.5;

        // Cell membrane
        ctx.beginPath();
        ctx.arc(x, y, cellSize, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 248, 225, 0.7)";
        ctx.fill();
        ctx.strokeStyle = "#bdbdbd";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nucleus
        const nucleusX = x + cellSize * 0.2 * (Math.random() - 0.5);
        const nucleusY = y + cellSize * 0.2 * (Math.random() - 0.5);

        ctx.beginPath();
        ctx.arc(nucleusX, nucleusY, cellSize * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "#9575cd";
        ctx.fill();
      }
    } else if (specimenType === "onion") {
      // Draw onion cells
      const cellSize = Math.max(20, Math.min(60, magnification / 10));
      const gridSize = Math.ceil((radius * 2) / cellSize);

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = centerX - radius + i * cellSize;
          const y = centerY - radius + j * cellSize;

          // Cell wall
          ctx.beginPath();
          ctx.rect(x, y, cellSize, cellSize);
          ctx.strokeStyle = "#8d6e63";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Cell interior
          ctx.fillStyle = "rgba(255, 248, 225, 0.3)";
          ctx.fillRect(x, y, cellSize, cellSize);

          // Nucleus (only in some cells)
          if (Math.random() > 0.3) {
            const nucleusX = x + cellSize / 2;
            const nucleusY = y + cellSize / 2;

            ctx.beginPath();
            ctx.arc(nucleusX, nucleusY, cellSize * 0.15, 0, Math.PI * 2);
            ctx.fillStyle = "#5d4037";
            ctx.fill();
          }

          // Vacuole
          const vacuoleX = x + cellSize / 2;
          const vacuoleY = y + cellSize / 2;

          ctx.beginPath();
          ctx.arc(vacuoleX, vacuoleY, cellSize * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(224, 224, 224, 0.5)";
          ctx.fill();
        }
      }
    } else if (specimenType === "pond") {
      // Draw pond water microorganisms
      const organismCount = Math.floor(magnification / 30);

      // Background particles
      for (let i = 0; i < 200; i++) {
        const x = centerX + (Math.random() - 0.5) * radius * 2;
        const y = centerY + (Math.random() - 0.5) * radius * 2;
        const size = 1 + Math.random() * 2;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
        ctx.fill();
      }

      // Paramecium
      for (let i = 0; i < organismCount / 3; i++) {
        const x = centerX + (Math.random() - 0.5) * radius * 1.8;
        const y = centerY + (Math.random() - 0.5) * radius * 1.8;
        const length = Math.max(20, Math.min(60, magnification / 10));
        const width = length / 3;

        ctx.beginPath();
        ctx.ellipse(
          x,
          y,
          length,
          width,
          Math.random() * Math.PI,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "rgba(179, 229, 252, 0.7)";
        ctx.fill();
        ctx.strokeStyle = "#81d4fa";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Cilia
        for (let j = 0; j < 20; j++) {
          const angle = (j / 20) * Math.PI * 2;
          const ciliaX = x + Math.cos(angle) * length;
          const ciliaY = y + Math.sin(angle) * width;

          ctx.beginPath();
          ctx.moveTo(ciliaX, ciliaY);
          ctx.lineTo(
            ciliaX + Math.cos(angle) * 5,
            ciliaY + Math.sin(angle) * 5,
          );
          ctx.strokeStyle = "#4fc3f7";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Algae
      for (let i = 0; i < organismCount / 2; i++) {
        const x = centerX + (Math.random() - 0.5) * radius * 1.8;
        const y = centerY + (Math.random() - 0.5) * radius * 1.8;
        const size = Math.max(5, Math.min(15, magnification / 30));

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = "#81c784";
        ctx.fill();

        // Chloroplasts
        for (let j = 0; j < 3; j++) {
          const cpX = x + (Math.random() - 0.5) * size;
          const cpY = y + (Math.random() - 0.5) * size;

          ctx.beginPath();
          ctx.arc(cpX, cpY, size / 3, 0, Math.PI * 2);
          ctx.fillStyle = "#4caf50";
          ctx.fill();
        }
      }

      // Amoeba
      for (let i = 0; i < organismCount / 5; i++) {
        const x = centerX + (Math.random() - 0.5) * radius * 1.8;
        const y = centerY + (Math.random() - 0.5) * radius * 1.8;
        const size = Math.max(15, Math.min(40, magnification / 15));

        // Irregular shape
        ctx.beginPath();
        ctx.moveTo(x + size, y);

        for (let j = 0; j < 10; j++) {
          const angle = (j / 10) * Math.PI * 2;
          const r = size * (0.7 + Math.random() * 0.5);
          const pointX = x + Math.cos(angle) * r;
          const pointY = y + Math.sin(angle) * r;

          ctx.lineTo(pointX, pointY);
        }

        ctx.closePath();
        ctx.fillStyle = "rgba(255, 236, 179, 0.7)";
        ctx.fill();

        // Nucleus
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffb74d";
        ctx.fill();
      }
    }

    // Apply focus effect
    const blurAmount = Math.abs(focus - 50) / 10;
    ctx.filter = `blur(${blurAmount}px)`;

    // Draw microscope edge
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#212121";
    ctx.lineWidth = 10;
    ctx.stroke();
  }, [specimenType, magnification, focus, contrast, brightness]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-semibold">Virtual Microscope</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMagnification(Math.max(50, magnification - 50))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{magnification}x</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setMagnification(Math.min(1000, magnification + 50))
              }
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={specimenType} onValueChange={setSpecimenType}>
          <TabsList className="mb-4 grid w-full grid-cols-4">
            <TabsTrigger value="blood">Blood</TabsTrigger>
            <TabsTrigger value="cheek">Cheek Cells</TabsTrigger>
            <TabsTrigger value="onion">Onion Skin</TabsTrigger>
            <TabsTrigger value="pond">Pond Water</TabsTrigger>
          </TabsList>

          <div
            className="relative overflow-hidden rounded-lg bg-black"
            style={{ height: "400px" }}
          >
            <canvas
              ref={canvasRef}
              className="h-full w-full"
              onClick={() => setSelectedFeature(null)}
            />
          </div>
        </Tabs>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Focus</label>
              <span className="text-sm">{focus}%</span>
            </div>
            <Slider
              value={[focus]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setFocus(value[0])}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Contrast</label>
              <span className="text-sm">{contrast}%</span>
            </div>
            <Slider
              value={[contrast]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setContrast(value[0])}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Brightness</label>
              <span className="text-sm">{brightness}%</span>
            </div>
            <Slider
              value={[brightness]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setBrightness(value[0])}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Specimen Information</h3>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="text-md mb-2 font-semibold">
              {specimens[specimenType as keyof typeof specimens].name}
            </h4>
            <p className="text-sm">
              {specimens[specimenType as keyof typeof specimens].description}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Observable Features</h4>

            {specimens[specimenType as keyof typeof specimens].features.map(
              (feature) => (
                <div
                  key={feature.id}
                  className={`cursor-pointer rounded-lg border p-3 ${
                    selectedFeature === feature.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedFeature(feature.id)}
                >
                  <h5 className="text-sm font-medium">{feature.name}</h5>
                  {selectedFeature === feature.id && (
                    <p className="mt-1 text-xs">{feature.description}</p>
                  )}
                </div>
              ),
            )}
          </div>

          <div className="pt-4">
            <h4 className="mb-2 text-sm font-medium">Microscopy Tips:</h4>
            <ul className="list-disc space-y-1 pl-5 text-xs">
              <li>Adjust the focus to get a clear view of the specimen</li>
              <li>Higher magnification allows you to see smaller details</li>
              <li>Adjust contrast and brightness to improve visibility</li>
              <li>Click on features to learn more about them</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
