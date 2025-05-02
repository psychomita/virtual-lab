"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, RotateCw, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Molecule data structure
type Atom = {
  element: string;
  position: { x: number; y: number; z: number };
  color: string;
  radius: number;
};

type Bond = {
  from: number;
  to: number;
  type: "single" | "double" | "triple";
};

type Molecule = {
  name: string;
  atoms: Atom[];
  bonds: Bond[];
};

export default function MolecularStructuresSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedMolecule, setSelectedMolecule] = useState<string>("water");
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showBonds, setShowBonds] = useState(true);
  const [bondThickness, setBondThickness] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Molecule library
  const molecules: { [key: string]: Molecule } = {
    water: {
      name: "Water (H₂O)",
      atoms: [
        {
          element: "O",
          position: { x: 0, y: 0, z: 0 },
          color: "#ff0000",
          radius: 15,
        },
        {
          element: "H",
          position: { x: -20, y: 15, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: 20, y: 15, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
      ],
      bonds: [
        { from: 0, to: 1, type: "single" },
        { from: 0, to: 2, type: "single" },
      ],
    },
    methane: {
      name: "Methane (CH₄)",
      atoms: [
        {
          element: "C",
          position: { x: 0, y: 0, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "H",
          position: { x: 20, y: 20, z: 20 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: -20, y: -20, z: 20 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: 20, y: -20, z: -20 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: -20, y: 20, z: -20 },
          color: "#ffffff",
          radius: 8,
        },
      ],
      bonds: [
        { from: 0, to: 1, type: "single" },
        { from: 0, to: 2, type: "single" },
        { from: 0, to: 3, type: "single" },
        { from: 0, to: 4, type: "single" },
      ],
    },
    ammonia: {
      name: "Ammonia (NH₃)",
      atoms: [
        {
          element: "N",
          position: { x: 0, y: 0, z: 0 },
          color: "#3050f8",
          radius: 15,
        },
        {
          element: "H",
          position: { x: 15, y: 15, z: 15 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: -15, y: 15, z: -15 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: 0, y: -20, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
      ],
      bonds: [
        { from: 0, to: 1, type: "single" },
        { from: 0, to: 2, type: "single" },
        { from: 0, to: 3, type: "single" },
      ],
    },
    carbon_dioxide: {
      name: "Carbon Dioxide (CO₂)",
      atoms: [
        {
          element: "C",
          position: { x: 0, y: 0, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "O",
          position: { x: -30, y: 0, z: 0 },
          color: "#ff0000",
          radius: 15,
        },
        {
          element: "O",
          position: { x: 30, y: 0, z: 0 },
          color: "#ff0000",
          radius: 15,
        },
      ],
      bonds: [
        { from: 0, to: 1, type: "double" },
        { from: 0, to: 2, type: "double" },
      ],
    },
    ethanol: {
      name: "Ethanol (C₂H₅OH)",
      atoms: [
        {
          element: "C",
          position: { x: -20, y: 0, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "C",
          position: { x: 20, y: 0, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "O",
          position: { x: 50, y: 0, z: 0 },
          color: "#ff0000",
          radius: 15,
        },
        {
          element: "H",
          position: { x: -20, y: 20, z: 15 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: -20, y: -20, z: 15 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: -40, y: 0, z: -15 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: 20, y: 20, z: -15 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: 20, y: -20, z: -15 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: 70, y: 0, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
      ],
      bonds: [
        { from: 0, to: 1, type: "single" },
        { from: 1, to: 2, type: "single" },
        { from: 0, to: 3, type: "single" },
        { from: 0, to: 4, type: "single" },
        { from: 0, to: 5, type: "single" },
        { from: 1, to: 6, type: "single" },
        { from: 1, to: 7, type: "single" },
        { from: 2, to: 8, type: "single" },
      ],
    },
    benzene: {
      name: "Benzene (C₆H₆)",
      atoms: [
        {
          element: "C",
          position: { x: 0, y: 30, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "C",
          position: { x: 26, y: 15, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "C",
          position: { x: 26, y: -15, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "C",
          position: { x: 0, y: -30, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "C",
          position: { x: -26, y: -15, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "C",
          position: { x: -26, y: 15, z: 0 },
          color: "#808080",
          radius: 15,
        },
        {
          element: "H",
          position: { x: 0, y: 45, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: 39, y: 22.5, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: 39, y: -22.5, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: 0, y: -45, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: -39, y: -22.5, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
        {
          element: "H",
          position: { x: -39, y: 22.5, z: 0 },
          color: "#ffffff",
          radius: 8,
        },
      ],
      bonds: [
        { from: 0, to: 1, type: "double" },
        { from: 1, to: 2, type: "single" },
        { from: 2, to: 3, type: "double" },
        { from: 3, to: 4, type: "single" },
        { from: 4, to: 5, type: "double" },
        { from: 5, to: 0, type: "single" },
        { from: 0, to: 6, type: "single" },
        { from: 1, to: 7, type: "single" },
        { from: 2, to: 8, type: "single" },
        { from: 3, to: 9, type: "single" },
        { from: 4, to: 10, type: "single" },
        { from: 5, to: 11, type: "single" },
      ],
    },
  };

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setRotationY((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate]);

  // Draw the molecule
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const molecule = molecules[selectedMolecule];
    if (!molecule) return;

    // Center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Convert 3D coordinates to 2D with rotation
    const project = (x: number, y: number, z: number) => {
      // Apply rotations
      const radX = (rotationX * Math.PI) / 180;
      const radY = (rotationY * Math.PI) / 180;
      const radZ = (rotationZ * Math.PI) / 180;

      // Rotate around X axis
      const y1 = y * Math.cos(radX) - z * Math.sin(radX);
      const z1 = y * Math.sin(radX) + z * Math.cos(radX);

      // Rotate around Y axis
      const x2 = x * Math.cos(radY) + z1 * Math.sin(radY);
      const z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);

      // Rotate around Z axis
      let x3 = x2 * Math.cos(radZ) - y1 * Math.sin(radZ);
      let y3 = x2 * Math.sin(radZ) + y1 * Math.cos(radZ);

      // Apply zoom
      const scale = zoom / 100;
      x3 *= scale;
      y3 *= scale;

      return {
        x: centerX + x3,
        y: centerY + y3,
        z: z2, // Keep z for depth sorting
      };
    };

    // Project all atoms
    const projectedAtoms = molecule.atoms.map((atom) => {
      const projected = project(
        atom.position.x,
        atom.position.y,
        atom.position.z,
      );
      return {
        ...atom,
        projectedPosition: projected,
        depth: projected.z,
      };
    });

    // Sort atoms by depth (painter's algorithm)
    projectedAtoms.sort((a, b) => b.depth - a.depth);

    // Draw bonds
    if (showBonds) {
      molecule.bonds.forEach((bond) => {
        const atom1 = projectedAtoms.find((_, i) => i === bond.from);
        const atom2 = projectedAtoms.find((_, i) => i === bond.to);

        if (atom1 && atom2) {
          const x1 = atom1.projectedPosition.x;
          const y1 = atom1.projectedPosition.y;
          const x2 = atom2.projectedPosition.x;
          const y2 = atom2.projectedPosition.y;

          // Draw bond
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "#666666";
          ctx.lineWidth = bondThickness;

          if (bond.type === "single") {
            ctx.stroke();
          } else if (bond.type === "double") {
            // Draw double bond
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const offsetX = (-dy * 3) / length;
            const offsetY = (dx * 3) / length;

            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x1 + offsetX, y1 + offsetY);
            ctx.lineTo(x2 + offsetX, y2 + offsetY);
            ctx.stroke();
          } else if (bond.type === "triple") {
            // Draw triple bond
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const offsetX = (-dy * 4) / length;
            const offsetY = (dx * 4) / length;

            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x1 + offsetX, y1 + offsetY);
            ctx.lineTo(x2 + offsetX, y2 + offsetY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x1 - offsetX, y1 - offsetY);
            ctx.lineTo(x2 - offsetX, y2 - offsetY);
            ctx.stroke();
          }
        }
      });
    }

    // Draw atoms
    projectedAtoms.forEach((atom) => {
      const { x, y } = atom.projectedPosition;
      const radius = atom.radius * (zoom / 100);

      // Draw atom
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = atom.color;
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw element label
      if (showLabels) {
        ctx.fillStyle = "#000000";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(atom.element, x, y);
      }
    });

    // Draw molecule name
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(molecule.name, centerX, 20);
  }, [
    selectedMolecule,
    rotationX,
    rotationY,
    rotationZ,
    zoom,
    showLabels,
    showBonds,
    bondThickness,
  ]);

  // Handle mouse events for rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setRotationY((prev) => (prev + dx * 0.5) % 360);
    setRotationX((prev) => {
      const newRotation = prev + dy * 0.5;
      return Math.max(-90, Math.min(90, newRotation)); // Limit vertical rotation
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view
  const resetView = () => {
    setRotationX(0);
    setRotationY(0);
    setRotationZ(0);
    setZoom(100);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/student/simulations/chem">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Molecular Structures</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>3D Molecule Viewer</CardTitle>
              <CardDescription>
                Explore the 3D structure of various molecules
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="rounded-md border bg-gray-50"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />

              <div className="mt-4 flex gap-4">
                <Button
                  onClick={() => setAutoRotate(!autoRotate)}
                  variant={autoRotate ? "default" : "outline"}
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  {autoRotate ? "Stop Rotation" : "Auto Rotate"}
                </Button>
                <Button onClick={resetView} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset View
                </Button>
                <Button
                  onClick={() => setZoom(Math.min(zoom + 20, 200))}
                  variant="outline"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setZoom(Math.max(zoom - 20, 40))}
                  variant="outline"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 w-full text-sm text-gray-500">
                <div className="mb-1 flex justify-between">
                  <span>Zoom:</span>
                  <span>{zoom}%</span>
                </div>
                <Slider
                  value={[zoom]}
                  min={40}
                  max={200}
                  step={10}
                  onValueChange={(value) => setZoom(value[0])}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Molecule Selection</CardTitle>
              <CardDescription>
                Choose a molecule to view its 3D structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Molecule</label>
                <Select
                  value={selectedMolecule}
                  onValueChange={setSelectedMolecule}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a molecule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="water">Water (H₂O)</SelectItem>
                    <SelectItem value="methane">Methane (CH₄)</SelectItem>
                    <SelectItem value="ammonia">Ammonia (NH₃)</SelectItem>
                    <SelectItem value="carbon_dioxide">
                      Carbon Dioxide (CO₂)
                    </SelectItem>
                    <SelectItem value="ethanol">Ethanol (C₂H₅OH)</SelectItem>
                    <SelectItem value="benzene">Benzene (C₆H₆)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Display Options</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showLabels">Show Element Labels</Label>
                  <Switch
                    id="showLabels"
                    checked={showLabels}
                    onCheckedChange={setShowLabels}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showBonds">Show Bonds</Label>
                  <Switch
                    id="showBonds"
                    checked={showBonds}
                    onCheckedChange={setShowBonds}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Bond Thickness
                    </label>
                    <span className="text-sm text-gray-500">
                      {bondThickness}px
                    </span>
                  </div>
                  <Slider
                    value={[bondThickness]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setBondThickness(value[0])}
                    disabled={!showBonds}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Manual Rotation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      X-Axis Rotation
                    </label>
                    <span className="text-sm text-gray-500">{rotationX}°</span>
                  </div>
                  <Slider
                    value={[rotationX]}
                    min={-90}
                    max={90}
                    step={5}
                    onValueChange={(value) => setRotationX(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Y-Axis Rotation
                    </label>
                    <span className="text-sm text-gray-500">{rotationY}°</span>
                  </div>
                  <Slider
                    value={[rotationY]}
                    min={0}
                    max={360}
                    step={5}
                    onValueChange={(value) => setRotationY(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Z-Axis Rotation
                    </label>
                    <span className="text-sm text-gray-500">{rotationZ}°</span>
                  </div>
                  <Slider
                    value={[rotationZ]}
                    min={0}
                    max={360}
                    step={5}
                    onValueChange={(value) => setRotationZ(value[0])}
                  />
                </div>
              </div>

              <div className="rounded-md bg-green-50 p-4">
                <h3 className="mb-2 font-medium">Molecular Geometry</h3>
                <p className="mb-2 text-sm text-gray-700">
                  The 3D arrangement of atoms in a molecule determines its
                  properties:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  <li>
                    <strong>Water:</strong> Bent shape due to oxygen's lone
                    pairs
                  </li>
                  <li>
                    <strong>Methane:</strong> Tetrahedral structure with 109.5°
                    bond angles
                  </li>
                  <li>
                    <strong>Carbon Dioxide:</strong> Linear molecule with double
                    bonds
                  </li>
                  <li>
                    <strong>Benzene:</strong> Planar hexagonal ring with
                    delocalized electrons
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
