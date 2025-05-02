"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import PendulumSimulation from "@/components/simulations/explore/pendulum-simulation";
import ProjectileSimulation from "@/components/simulations/explore/projectile-simulation";
import WaveSimulation from "@/components/simulations/explore/wave-simulation";

export default function PhysicsLab() {
  const [activeTab, setActiveTab] = useState("pendulum");
  const [running, setRunning] = useState(false);

  // Pendulum parameters
  const [gravity, setGravity] = useState(9.8);
  const [length, setLength] = useState(1);
  const [angle, setAngle] = useState(30);

  // Projectile parameters
  const [initialVelocity, setInitialVelocity] = useState(20);
  const [launchAngle, setLaunchAngle] = useState(45);
  const [projectileGravity, setProjectileGravity] = useState(9.8);

  // Wave parameters
  const [amplitude, setAmplitude] = useState(50);
  const [frequency, setFrequency] = useState(1);
  const [waveType, setWaveType] = useState("sine");

  const toggleSimulation = () => {
    setRunning(!running);
  };

  const resetSimulation = () => {
    setRunning(false);

    if (activeTab === "pendulum") {
      setGravity(9.8);
      setLength(1);
      setAngle(30);
    } else if (activeTab === "projectile") {
      setInitialVelocity(20);
      setLaunchAngle(45);
      setProjectileGravity(9.8);
    } else if (activeTab === "waves") {
      setAmplitude(50);
      setFrequency(1);
      setWaveType("sine");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Physics Virtual Laboratory</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="pendulum">Pendulum</TabsTrigger>
          <TabsTrigger value="projectile">Projectile Motion</TabsTrigger>
          <TabsTrigger value="waves">Wave Simulation</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Experiment Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <TabsContent value="pendulum" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Gravity (m/s²)
                    </label>
                    <span className="text-sm">{gravity.toFixed(1)} m/s²</span>
                  </div>
                  <Slider
                    value={[gravity]}
                    min={1}
                    max={20}
                    step={0.1}
                    onValueChange={(value) => setGravity(value[0])}
                    disabled={running}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Pendulum Length (m)
                    </label>
                    <span className="text-sm">{length.toFixed(1)} m</span>
                  </div>
                  <Slider
                    value={[length]}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setLength(value[0])}
                    disabled={running}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Initial Angle (degrees)
                    </label>
                    <span className="text-sm">{angle}°</span>
                  </div>
                  <Slider
                    value={[angle]}
                    min={5}
                    max={90}
                    step={1}
                    onValueChange={(value) => setAngle(value[0])}
                    disabled={running}
                  />
                </div>
              </TabsContent>

              <TabsContent value="projectile" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Initial Velocity (m/s)
                    </label>
                    <span className="text-sm">
                      {initialVelocity.toFixed(1)} m/s
                    </span>
                  </div>
                  <Slider
                    value={[initialVelocity]}
                    min={5}
                    max={50}
                    step={1}
                    onValueChange={(value) => setInitialVelocity(value[0])}
                    disabled={running}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Launch Angle (degrees)
                    </label>
                    <span className="text-sm">{launchAngle}°</span>
                  </div>
                  <Slider
                    value={[launchAngle]}
                    min={0}
                    max={90}
                    step={1}
                    onValueChange={(value) => setLaunchAngle(value[0])}
                    disabled={running}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Gravity (m/s²)
                    </label>
                    <span className="text-sm">
                      {projectileGravity.toFixed(1)} m/s²
                    </span>
                  </div>
                  <Slider
                    value={[projectileGravity]}
                    min={1}
                    max={20}
                    step={0.1}
                    onValueChange={(value) => setProjectileGravity(value[0])}
                    disabled={running}
                  />
                </div>
              </TabsContent>

              <TabsContent value="waves" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Amplitude</label>
                    <span className="text-sm">{amplitude}</span>
                  </div>
                  <Slider
                    value={[amplitude]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAmplitude(value[0])}
                    disabled={running}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Frequency (Hz)
                    </label>
                    <span className="text-sm">{frequency.toFixed(1)} Hz</span>
                  </div>
                  <Slider
                    value={[frequency]}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setFrequency(value[0])}
                    disabled={running}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Wave Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={waveType === "sine" ? "default" : "outline"}
                      onClick={() => setWaveType("sine")}
                      disabled={running}
                      className="w-full"
                    >
                      Sine Wave
                    </Button>
                    <Button
                      variant={waveType === "square" ? "default" : "outline"}
                      onClick={() => setWaveType("square")}
                      disabled={running}
                      className="w-full"
                    >
                      Square Wave
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={toggleSimulation}>
                  {running ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Pause Simulation
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Start Simulation
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <TabsContent value="pendulum" className="mt-0">
                <PendulumSimulation
                  running={running}
                  gravity={gravity}
                  length={length}
                  initialAngle={angle}
                />
              </TabsContent>

              <TabsContent value="projectile" className="mt-0">
                <ProjectileSimulation
                  running={running}
                  initialVelocity={initialVelocity}
                  launchAngle={launchAngle}
                  gravity={projectileGravity}
                />
              </TabsContent>

              <TabsContent value="waves" className="mt-0">
                <WaveSimulation
                  running={running}
                  amplitude={amplitude}
                  frequency={frequency}
                  waveType={waveType}
                />
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
