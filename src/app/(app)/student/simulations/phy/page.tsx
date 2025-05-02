import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PhysicsLab() {
  const experiments = [
    {
      id: "pendulum",
      title: "Pendulum Motion",
      description:
        "Study the oscillatory motion of a pendulum and factors affecting its period",
      image: "/images/pendulum.jpg",
    },
    {
      id: "projectile",
      title: "Projectile Motion",
      description:
        "Explore the path of objects launched into the air with different initial conditions",
      image: "/images/projectile.jpg",
    },
    {
      id: "circuit",
      title: "Circuit Builder",
      description:
        "Build and analyze electrical circuits with various components",
      image: "/images/circuit.jpg",
    },
    {
      id: "wave",
      title: "Wave Interference",
      description:
        "Visualize wave interference patterns and understand superposition",
      image: "/images/wave.jpg",
    },
    {
      id: "gravity",
      title: "Gravity Simulation",
      description: "Observe gravitational interactions between multiple bodies",
      image: "/images/gravity.webp",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link href="/student/dashboard">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Physics Laboratory</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiments.map((experiment) => (
          <Card
            key={experiment.id}
            className="transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <CardTitle>{experiment.title}</CardTitle>
              <CardDescription>{experiment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={experiment.image || "/placeholder.svg"}
                alt={experiment.title}
                className="h-32 w-full rounded-md bg-blue-100 object-cover"
              />
            </CardContent>
            <CardFooter>
              <Link
                href={`/student/simulations/phy/${experiment.id}`}
                className="w-full"
              >
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Start Experiment
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
