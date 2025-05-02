"use client";

import { useState, useEffect } from "react";
import {
  Atom,
  Beaker,
  Dna,
  Microscope,
  FlaskRoundIcon as Flask,
  Lightbulb,
  Rocket,
  Zap,
  Sparkles,
} from "lucide-react";

type FloatingElement = {
  id: number;
  icon: JSX.Element;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  clicked: boolean;
};

export function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Initialize elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      const icons = [
        <Atom key="atom" />,
        <Beaker key="beaker" />,
        <Dna key="dna" />,
        <Microscope key="microscope" />,
        <Flask key="flask" />,
        <Lightbulb key="lightbulb" />,
        <Rocket key="rocket" />,
        <Zap key="zap" />,
      ];

      const colors = [
        "text-blue-500",
        "text-purple-500",
        "text-pink-500",
        "text-green-500",
        "text-yellow-500",
        "text-red-500",
        "text-cyan-500",
        "text-orange-500",
      ];

      const newElements: FloatingElement[] = [];

      for (let i = 0; i < 8; i++) {
        newElements.push({
          id: i,
          icon: icons[i % icons.length],
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: 20 + Math.random() * 20,
          speed: 0.3 + Math.random() * 0.5,
          direction: Math.random() * Math.PI * 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
          color: colors[i % colors.length],
          clicked: false,
        });
      }

      setElements(newElements);

      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Animation loop
  useEffect(() => {
    if (elements.length === 0 || windowSize.width === 0) return;

    const interval = setInterval(() => {
      setElements((prevElements) =>
        prevElements
          .map((element) => {
            if (element.clicked) {
              return {
                ...element,
                rotation: element.rotation + element.rotationSpeed * 2,
                size: Math.max(element.size - 0.5, 0),
              };
            }

            // Calculate new position
            let newX = element.x + Math.cos(element.direction) * element.speed;
            let newY = element.y + Math.sin(element.direction) * element.speed;
            let newDirection = element.direction;

            // Bounce off edges
            if (newX < 0 || newX > windowSize.width) {
              newDirection = Math.PI - newDirection;
              newX = Math.max(0, Math.min(newX, windowSize.width));
            }

            if (newY < 0 || newY > windowSize.height) {
              newDirection = -newDirection;
              newY = Math.max(0, Math.min(newY, windowSize.height));
            }

            // Occasionally change direction slightly
            if (Math.random() < 0.02) {
              newDirection += (Math.random() - 0.5) * 0.5;
            }

            return {
              ...element,
              x: newX,
              y: newY,
              direction: newDirection,
              rotation: element.rotation + element.rotationSpeed,
            };
          })
          .filter((element) => element.size > 0),
      );
    }, 50);

    return () => clearInterval(interval);
  }, [elements, windowSize]);

  // Handle click on element
  const handleClick = (id: number) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id
          ? {
              ...element,
              clicked: true,
              rotationSpeed: element.rotationSpeed * 3,
            }
          : element,
      ),
    );

    // Create sparkle effect
    const clickedElement = elements.find((e) => e.id === id);
    if (clickedElement) {
      const sparkleCount = 5;
      const newElements = [...elements];

      for (let i = 0; i < sparkleCount; i++) {
        newElements.push({
          id: elements.length + i,
          icon: <Sparkles key={`sparkle-${elements.length + i}`} />,
          x: clickedElement.x + (Math.random() - 0.5) * 50,
          y: clickedElement.y + (Math.random() - 0.5) * 50,
          size: 10 + Math.random() * 10,
          speed: 1 + Math.random() * 2,
          direction: Math.random() * Math.PI * 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          color: "text-yellow-400",
          clicked: false,
        });
      }

      setElements(newElements);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`pointer-events-auto absolute cursor-pointer transition-transform ${element.color} ${element.clicked ? "scale-150 opacity-0" : "hover:scale-125"}`}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            transform: `rotate(${element.rotation}deg)`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            transition: element.clicked
              ? "all 0.5s ease-out"
              : "transform 0.2s ease",
          }}
          onClick={() => handleClick(element.id)}
        >
          {element.icon}
        </div>
      ))}
    </div>
  );
}
