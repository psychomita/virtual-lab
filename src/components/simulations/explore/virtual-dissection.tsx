"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Scissors,
  Pipette,
  Eye,
  Pin,
} from "lucide-react";

export default function VirtualDissection() {
  const [specimenType, setSpecimenType] = useState("frog");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [dissectionStage, setDissectionStage] = useState(0);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);

  const specimens = {
    frog: {
      name: "Frog",
      stages: [
        { id: 0, name: "Intact Specimen" },
        { id: 1, name: "Skin Removed" },
        { id: 2, name: "Abdominal Cavity Exposed" },
        { id: 3, name: "Organs Visible" },
        { id: 4, name: "Fully Dissected" },
      ],
      organs: [
        {
          id: "heart",
          name: "Heart",
          description:
            "Three-chambered heart that pumps blood throughout the body.",
        },
        {
          id: "lungs",
          name: "Lungs",
          description:
            "Paired respiratory organs that facilitate gas exchange.",
        },
        {
          id: "liver",
          name: "Liver",
          description: "Large organ involved in metabolism and detoxification.",
        },
        {
          id: "stomach",
          name: "Stomach",
          description: "Digestive organ that breaks down food.",
        },
        {
          id: "intestines",
          name: "Intestines",
          description: "Long tube where nutrients are absorbed.",
        },
      ],
    },
    earthworm: {
      name: "Earthworm",
      stages: [
        { id: 0, name: "Intact Specimen" },
        { id: 1, name: "Pinned Specimen" },
        { id: 2, name: "Dorsal Cut" },
        { id: 3, name: "Internal Organs Exposed" },
        { id: 4, name: "Fully Dissected" },
      ],
      organs: [
        {
          id: "crop",
          name: "Crop",
          description: "Storage organ for food before digestion.",
        },
        {
          id: "gizzard",
          name: "Gizzard",
          description: "Muscular organ that grinds food.",
        },
        {
          id: "intestine",
          name: "Intestine",
          description: "Tube where digestion and absorption occur.",
        },
        {
          id: "hearts",
          name: "Aortic Arches",
          description: "Five pairs of 'hearts' that pump blood.",
        },
        {
          id: "nerve-cord",
          name: "Ventral Nerve Cord",
          description: "Main nerve pathway running along the ventral side.",
        },
      ],
    },
  };

  const tools = [
    {
      id: "scissors",
      name: "Scissors",
      icon: Scissors,
      description: "Used to cut through tissue",
    },
    {
      id: "pins",
      name: "Pins",
      icon: Pin,
      description: "Used to secure the specimen",
    },
    {
      id: "forceps",
      name: "Forceps",
      icon: Pipette,
      description: "Used to grasp and manipulate tissue",
    },
    {
      id: "probe",
      name: "Probe",
      icon: Eye,
      description: "Used to examine and identify structures",
    },
  ];

  const handleToolClick = (toolId: string) => {
    setCurrentTool(toolId);

    // If using scissors and not at final stage, advance to next stage
    if (
      toolId === "scissors" &&
      dissectionStage <
        specimens[specimenType as keyof typeof specimens].stages.length - 1
    ) {
      setDissectionStage((prev) => prev + 1);
    }

    // If using probe, allow organ selection
    if (toolId === "probe") {
      setSelectedOrgan(null);
    }
  };

  const handleOrganClick = (organId: string) => {
    if (currentTool === "probe" && dissectionStage >= 3) {
      setSelectedOrgan(organId);
    }
  };

  const resetDissection = () => {
    setDissectionStage(0);
    setCurrentTool(null);
    setSelectedOrgan(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-semibold">Virtual Dissection Lab</h2>
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRotation(rotation - 90)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRotation(rotation + 90)}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={specimenType} onValueChange={setSpecimenType}>
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="frog" onClick={resetDissection}>
              Frog
            </TabsTrigger>
            <TabsTrigger value="earthworm" onClick={resetDissection}>
              Earthworm
            </TabsTrigger>
          </TabsList>

          <div
            className="relative overflow-hidden rounded-lg bg-gray-50"
            style={{ height: "400px" }}
          >
            <div
              className="relative flex h-full w-full items-center justify-center"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transformOrigin: "center",
                transition: "transform 0.3s ease",
              }}
            >
              {/* Specimen visualization */}
              <div className="relative">
                {/* Base specimen image */}
                <div
                  className="h-64 w-64 bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(/placeholder.svg?height=256&width=256)`,
                    opacity: dissectionStage === 0 ? 1 : 0.3,
                  }}
                ></div>

                {/* Dissection stage overlays */}
                {dissectionStage >= 1 && (
                  <div
                    className="absolute inset-0 h-64 w-64 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(/placeholder.svg?height=256&width=256)`,
                    }}
                  ></div>
                )}

                {dissectionStage >= 2 && (
                  <div
                    className="absolute inset-0 h-64 w-64 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(/placeholder.svg?height=256&width=256)`,
                    }}
                  ></div>
                )}

                {dissectionStage >= 3 && (
                  <div
                    className="absolute inset-0 h-64 w-64 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(/placeholder.svg?height=256&width=256)`,
                    }}
                  ></div>
                )}

                {/* Clickable organs (only visible in later stages) */}
                {dissectionStage >= 3 &&
                  specimens[specimenType as keyof typeof specimens].organs.map(
                    (organ, index) => (
                      <div
                        key={organ.id}
                        className={`absolute cursor-pointer transition-transform hover:scale-110 ${
                          currentTool === "probe" ? "opacity-100" : "opacity-70"
                        } ${selectedOrgan === organ.id ? "ring-primary ring-2" : ""}`}
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                          borderRadius: "50%",
                          top: `${80 + index * 30}px`,
                          left: `${80 + (index % 3) * 40}px`,
                        }}
                        onClick={() => handleOrganClick(organ.id)}
                      ></div>
                    ),
                  )}
              </div>

              {/* Current tool indicator */}
              {currentTool && (
                <div className="absolute top-4 right-4 rounded bg-white/80 p-2 text-xs">
                  Using: {tools.find((t) => t.id === currentTool)?.name}
                </div>
              )}
            </div>

            {/* Stage indicator */}
            <div className="absolute right-4 bottom-4 left-4">
              <div className="rounded bg-white/80 p-2 text-sm">
                <div className="mb-2 flex justify-between">
                  <span>
                    Stage:{" "}
                    {
                      specimens[specimenType as keyof typeof specimens].stages[
                        dissectionStage
                      ].name
                    }
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{
                      width: `${(dissectionStage / (specimens[specimenType as keyof typeof specimens].stages.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>

        <div className="mt-4 flex flex-wrap gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={currentTool === tool.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolClick(tool.id)}
              className="flex items-center gap-2"
            >
              <tool.icon className="h-4 w-4" />
              {tool.name}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={resetDissection}
            className="ml-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Specimen Information</h3>

        {selectedOrgan ? (
          <div className="space-y-4">
            <h4 className="text-md font-semibold">
              {
                specimens[specimenType as keyof typeof specimens].organs.find(
                  (o) => o.id === selectedOrgan,
                )?.name
              }
            </h4>

            <div
              className="mx-auto h-16 w-16 rounded-full"
              style={{
                backgroundColor: `hsl(${
                  specimens[
                    specimenType as keyof typeof specimens
                  ].organs.findIndex((o) => o.id === selectedOrgan) * 60
                }, 70%, 60%)`,
              }}
            ></div>

            <p className="text-sm">
              {
                specimens[specimenType as keyof typeof specimens].organs.find(
                  (o) => o.id === selectedOrgan,
                )?.description
              }
            </p>

            <div className="pt-4">
              <h5 className="mb-2 text-sm font-medium">Function:</h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {selectedOrgan === "heart" && (
                  <>
                    <li>Pumps blood throughout the body</li>
                    <li>Maintains blood pressure</li>
                    <li>Ensures oxygen delivery to tissues</li>
                  </>
                )}
                {selectedOrgan === "lungs" && (
                  <>
                    <li>Gas exchange (oxygen in, carbon dioxide out)</li>
                    <li>Provides oxygen for cellular respiration</li>
                    <li>Helps regulate pH balance</li>
                  </>
                )}
                {selectedOrgan === "liver" && (
                  <>
                    <li>Detoxifies harmful substances</li>
                    <li>Produces bile for digestion</li>
                    <li>Stores glycogen for energy</li>
                  </>
                )}
                {(selectedOrgan === "stomach" ||
                  selectedOrgan === "gizzard") && (
                  <>
                    <li>Breaks down food mechanically and chemically</li>
                    <li>Secretes digestive enzymes</li>
                    <li>Temporary food storage</li>
                  </>
                )}
                {(selectedOrgan === "intestines" ||
                  selectedOrgan === "intestine") && (
                  <>
                    <li>Absorbs nutrients from digested food</li>
                    <li>Completes digestion process</li>
                    <li>Forms and stores waste</li>
                  </>
                )}
                {selectedOrgan === "crop" && (
                  <>
                    <li>Stores food temporarily</li>
                    <li>Begins food softening</li>
                    <li>Regulates food passage to gizzard</li>
                  </>
                )}
                {selectedOrgan === "hearts" && (
                  <>
                    <li>Pumps blood through the circulatory system</li>
                    <li>Maintains blood pressure</li>
                    <li>Ensures efficient circulation</li>
                  </>
                )}
                {selectedOrgan === "nerve-cord" && (
                  <>
                    <li>Transmits nerve impulses</li>
                    <li>Coordinates movement</li>
                    <li>Processes sensory information</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-md font-semibold">
              {specimens[specimenType as keyof typeof specimens].name}
            </h4>

            <p className="text-sm">
              {specimenType === "frog"
                ? "Frogs are amphibians known for their jumping abilities, croaking sounds, and bulging eyes. They undergo metamorphosis from tadpoles to adult frogs."
                : "Earthworms are tube-shaped, segmented worms that belong to the phylum Annelida. They play a vital role in soil health through aeration and decomposition."}
            </p>

            <div className="pt-4">
              <h5 className="mb-2 text-sm font-medium">
                Dissection Instructions:
              </h5>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {specimenType === "frog" ? (
                  <>
                    <li>Use pins to secure the specimen</li>
                    <li>Use scissors to carefully cut through the skin</li>
                    <li>Use scissors to open the abdominal cavity</li>
                    <li>Use forceps to carefully separate organs</li>
                    <li>Use the probe to identify and examine organs</li>
                  </>
                ) : (
                  <>
                    <li>Pin the earthworm to the dissection tray</li>
                    <li>Use scissors to make a dorsal cut along the length</li>
                    <li>Use pins to hold open the body wall</li>
                    <li>Use forceps to carefully separate organs</li>
                    <li>Use the probe to identify internal structures</li>
                  </>
                )}
              </ol>
            </div>

            <div className="text-muted-foreground pt-4 text-center">
              {dissectionStage >= 3
                ? "Use the probe tool and click on organs to examine them"
                : "Continue the dissection to reveal internal organs"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
