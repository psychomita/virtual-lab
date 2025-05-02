"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function CellStructureExploration() {
  const [cellType, setCellType] = useState("animal");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(
    null,
  );

  const organelles = {
    animal: [
      {
        id: "nucleus",
        name: "Nucleus",
        x: 50,
        y: 50,
        description:
          "Controls cell activities and contains genetic material (DNA).",
      },
      {
        id: "mitochondria",
        name: "Mitochondria",
        x: 75,
        y: 30,
        description:
          "Powerhouse of the cell. Produces energy through cellular respiration.",
      },
      {
        id: "er",
        name: "Endoplasmic Reticulum",
        x: 30,
        y: 70,
        description:
          "Network of membranes involved in protein synthesis and lipid metabolism.",
      },
      {
        id: "golgi",
        name: "Golgi Apparatus",
        x: 70,
        y: 70,
        description:
          "Modifies, sorts, and packages proteins for secretion or use within the cell.",
      },
      {
        id: "lysosome",
        name: "Lysosome",
        x: 25,
        y: 40,
        description:
          "Contains digestive enzymes to break down waste materials and cellular debris.",
      },
    ],
    plant: [
      {
        id: "nucleus",
        name: "Nucleus",
        x: 50,
        y: 50,
        description:
          "Controls cell activities and contains genetic material (DNA).",
      },
      {
        id: "mitochondria",
        name: "Mitochondria",
        x: 75,
        y: 30,
        description: "Produces energy through cellular respiration.",
      },
      {
        id: "chloroplast",
        name: "Chloroplast",
        x: 30,
        y: 30,
        description:
          "Contains chlorophyll and is responsible for photosynthesis.",
      },
      {
        id: "vacuole",
        name: "Central Vacuole",
        x: 50,
        y: 60,
        description:
          "Large, fluid-filled organelle that maintains turgor pressure and stores nutrients.",
      },
      {
        id: "cell-wall",
        name: "Cell Wall",
        x: 10,
        y: 50,
        description:
          "Rigid outer layer that provides structure and protection.",
      },
    ],
  };

  const getOrganelleColor = (id: string) => {
    const colors: Record<string, string> = {
      nucleus: "#8884d8",
      mitochondria: "#ff7300",
      er: "#82ca9d",
      golgi: "#ffc658",
      lysosome: "#ff5252",
      chloroplast: "#4caf50",
      vacuole: "#2196f3",
      "cell-wall": "#795548",
    };
    return colors[id] || "#999";
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-semibold">Cell Structure Exploration</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(zoomLevel * 100)}%</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={cellType} onValueChange={setCellType}>
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="animal">Animal Cell</TabsTrigger>
            <TabsTrigger value="plant">Plant Cell</TabsTrigger>
          </TabsList>

          <div
            className="relative overflow-hidden rounded-lg bg-gray-50"
            style={{ height: "400px" }}
          >
            <div
              className="relative h-full w-full"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center",
                transition: "transform 0.3s ease",
              }}
            >
              {/* Cell background */}
              <div
                className={`absolute inset-0 m-8 rounded-full ${cellType === "plant" ? "bg-green-50" : "bg-blue-50"}`}
              >
                {/* Cell membrane */}
                <div
                  className={`absolute inset-0 rounded-full border-2 ${cellType === "plant" ? "border-green-200" : "border-blue-200"}`}
                ></div>

                {/* Cell wall for plant cells */}
                {cellType === "plant" && (
                  <div className="absolute inset-0 rounded-full border-4 border-green-300"></div>
                )}
              </div>

              {/* Organelles */}
              {organelles[cellType as keyof typeof organelles].map(
                (organelle) => (
                  <div
                    key={organelle.id}
                    className="absolute cursor-pointer transition-transform hover:scale-110"
                    style={{
                      left: `${organelle.x}%`,
                      top: `${organelle.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onClick={() => setSelectedOrganelle(organelle.id)}
                  >
                    <div
                      className={`rounded-full ${selectedOrganelle === organelle.id ? "ring-primary ring-2" : ""}`}
                      style={{
                        width: organelle.id === "nucleus" ? "60px" : "30px",
                        height: organelle.id === "nucleus" ? "60px" : "30px",
                        backgroundColor: getOrganelleColor(organelle.id),
                        opacity: 0.8,
                      }}
                    ></div>
                    <div className="absolute top-full left-1/2 mt-1 -translate-x-1/2 transform text-xs font-medium">
                      {organelle.name}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </Tabs>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Organelle Information</h3>

        {selectedOrganelle ? (
          <div className="space-y-4">
            <h4 className="text-md font-semibold">
              {
                organelles[cellType as keyof typeof organelles].find(
                  (o) => o.id === selectedOrganelle,
                )?.name
              }
            </h4>

            <div
              className="mx-auto h-16 w-16 rounded-full"
              style={{ backgroundColor: getOrganelleColor(selectedOrganelle) }}
            ></div>

            <p className="text-sm">
              {
                organelles[cellType as keyof typeof organelles].find(
                  (o) => o.id === selectedOrganelle,
                )?.description
              }
            </p>

            <div className="pt-4">
              <h5 className="mb-2 text-sm font-medium">Function:</h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {selectedOrganelle === "nucleus" && (
                  <>
                    <li>Stores genetic information (DNA)</li>
                    <li>Controls cellular activities</li>
                    <li>Regulates gene expression</li>
                  </>
                )}
                {selectedOrganelle === "mitochondria" && (
                  <>
                    <li>Produces ATP through cellular respiration</li>
                    <li>Converts glucose to energy</li>
                    <li>Contains its own DNA</li>
                  </>
                )}
                {selectedOrganelle === "er" && (
                  <>
                    <li>Synthesizes proteins and lipids</li>
                    <li>Transports materials within the cell</li>
                    <li>Detoxifies harmful substances</li>
                  </>
                )}
                {selectedOrganelle === "golgi" && (
                  <>
                    <li>Modifies, sorts, and packages proteins</li>
                    <li>Forms secretory vesicles</li>
                    <li>Produces lysosomes</li>
                  </>
                )}
                {selectedOrganelle === "lysosome" && (
                  <>
                    <li>Breaks down waste materials</li>
                    <li>Digests foreign particles</li>
                    <li>Recycles damaged organelles</li>
                  </>
                )}
                {selectedOrganelle === "chloroplast" && (
                  <>
                    <li>Performs photosynthesis</li>
                    <li>Converts light energy to chemical energy</li>
                    <li>Produces oxygen and glucose</li>
                  </>
                )}
                {selectedOrganelle === "vacuole" && (
                  <>
                    <li>Maintains turgor pressure</li>
                    <li>Stores nutrients and waste</li>
                    <li>Helps with plant growth</li>
                  </>
                )}
                {selectedOrganelle === "cell-wall" && (
                  <>
                    <li>Provides structural support</li>
                    <li>Protects the cell</li>
                    <li>Prevents overexpansion</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground py-12 text-center">
            Click on an organelle to view information
          </div>
        )}
      </div>
    </div>
  );
}
