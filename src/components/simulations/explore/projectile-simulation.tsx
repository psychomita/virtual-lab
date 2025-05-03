"use client";

import { useRef, useEffect } from "react";

interface ProjectileSimulationProps {
  running: boolean;
  initialVelocity: number;
  launchAngle: number;
  gravity: number;
}

export default function ProjectileSimulation({
  running,
  initialVelocity,
  launchAngle,
  gravity,
}: ProjectileSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Constants
    const groundY = canvas.height - 50;
    const launcherX = 50;
    const launcherY = groundY;
    const scale = 5; // Pixels per meter

    // Convert angle from degrees to radians
    const angleInRadians = (launchAngle * Math.PI) / 180;

    // Initial velocity components
    const vx = initialVelocity * Math.cos(angleInRadians);
    const vy = -initialVelocity * Math.sin(angleInRadians); // Negative because y-axis is inverted in canvas

    // Calculate trajectory
    const calculateTrajectory = () => {
      const points = [];
      let x = 0;
      let y = 0;
      let t = 0;
      const dt = 0.1; // Time step in seconds

      while (y <= 0 && x * scale < canvas.width - launcherX) {
        x = vx * t;
        y = vy * t + 0.5 * gravity * t * t; // y = v0y*t + 0.5*g*t^2

        // Convert to canvas coordinates
        const canvasX = launcherX + x * scale;
        const canvasY = launcherY + y * scale;

        if (canvasY <= groundY) {
          points.push({ x: canvasX, y: canvasY });
        }

        t += dt;
      }

      return points;
    };

    // Calculate maximum height and range
    const calculateMaxHeightAndRange = () => {
      // Maximum height: h = (v0y)^2 / (2g)
      const maxHeight = (vy * vy) / (2 * gravity);

      // Range: R = (v0^2 * sin(2θ)) / g
      const range =
        (initialVelocity * initialVelocity * Math.sin(2 * angleInRadians)) /
        gravity;

      // Time of flight: T = (2 * v0y) / g
      const timeOfFlight =
        (2 * initialVelocity * Math.sin(angleInRadians)) / gravity;

      return { maxHeight, range, timeOfFlight };
    };

    // Draw the scene
    const drawScene = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw launcher
      ctx.beginPath();
      ctx.moveTo(launcherX, launcherY);
      ctx.lineTo(
        launcherX + 30 * Math.cos(angleInRadians),
        launcherY + 30 * Math.sin(angleInRadians),
      );
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw trajectory prediction
      const trajectory = calculateTrajectory();
      if (trajectory.length > 0) {
        ctx.beginPath();
        ctx.moveTo(launcherX, launcherY);

        trajectory.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });

        ctx.strokeStyle = "rgba(102, 102, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw information
      const { maxHeight, range, timeOfFlight } = calculateMaxHeightAndRange();

      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        `Initial velocity: ${initialVelocity.toFixed(1)} m/s`,
        20,
        30,
      );
      ctx.fillText(`Launch angle: ${launchAngle}°`, 20, 50);
      ctx.fillText(`Maximum height: ${maxHeight.toFixed(2)} m`, 20, 70);
      ctx.fillText(`Range: ${range.toFixed(2)} m`, 20, 90);
      ctx.fillText(`Time of flight: ${timeOfFlight.toFixed(2)} s`, 20, 110);
    };

    // Animation variables
    let animationFrameId: number;
    let projectileX = launcherX;
    let projectileY = launcherY;
    let time = 0;
    let lastTimestamp: number | null = null;

    // Animate projectile
    const animate = (timestamp: number) => {
      if (!running) {
        drawScene();
        return;
      }

      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
      lastTimestamp = timestamp;

      // Update time
      time += deltaTime;

      // Calculate projectile position
      projectileX = launcherX + vx * time * scale;
      projectileY =
        launcherY + (vy * time + 0.5 * gravity * time * time) * scale;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw launcher
      ctx.beginPath();
      ctx.moveTo(launcherX, launcherY);
      ctx.lineTo(
        launcherX + 30 * Math.cos(angleInRadians),
        launcherY + 30 * Math.sin(angleInRadians),
      );
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw projectile path
      ctx.beginPath();
      ctx.moveTo(launcherX, launcherY);
      ctx.lineTo(projectileX, projectileY);
      ctx.strokeStyle = "rgba(102, 102, 255, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw projectile
      if (projectileY <= groundY) {
        ctx.beginPath();
        ctx.arc(projectileX, projectileY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "hsl(215, 100%, 50%)";
        ctx.fill();
      }

      // Draw information
      const {
        maxHeight,
        range,
        // timeOfFlight
      } = calculateMaxHeightAndRange();

      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        `Initial velocity: ${initialVelocity.toFixed(1)} m/s`,
        20,
        30,
      );
      ctx.fillText(`Launch angle: ${launchAngle}°`, 20, 50);
      ctx.fillText(`Current time: ${time.toFixed(2)} s`, 20, 70);
      ctx.fillText(`Maximum height: ${maxHeight.toFixed(2)} m`, 20, 90);
      ctx.fillText(`Range: ${range.toFixed(2)} m`, 20, 110);

      // Reset if projectile hits ground or goes off screen
      if (projectileY > groundY || projectileX > canvas.width) {
        time = 0;
        lastTimestamp = null;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation or draw static scene
    if (running) {
      time = 0;
      lastTimestamp = null;
      animationFrameId = requestAnimationFrame(animate);
    } else {
      drawScene();
    }

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [running, initialVelocity, launchAngle, gravity]);

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-gray-50"
      style={{ height: "400px" }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />

      {!running && (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center bg-white/50">
          Configure parameters and start the simulation
        </div>
      )}
    </div>
  );
}
