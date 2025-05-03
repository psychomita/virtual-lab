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

export default function ChemistryLab() {
  const experiments = [
    {
      id: "titration",
      title: "Titration Experiment",
      description:
        "Perform acid-base titrations and observe color changes with different indicators",
      image: "/images/titration.jpg",
    },
    {
      id: "molecular",
      title: "Molecular Structures",
      description:
        "Build and visualize 3D molecular structures and understand chemical bonding",
      image: "/images/molecular.jpg",
    },
    {
      id: "reactions",
      title: "Chemical Reactions",
      description:
        "Mix virtual chemicals and observe different types of reactions",
      image: "/images/reactions.jpg",
    },
    {
      id: "ph",
      title: "pH Measurement",
      description:
        "Test the pH of various solutions and understand the pH scale",
      image: "/images/ph.jpg",
    },
    {
      id: "gas-laws",
      title: "Gas Laws",
      description:
        "Explore the relationships between pressure, volume, temperature, and amount of gas",
      image: "/images/gas-laws.jpg",
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
        <h1 className="text-3xl font-bold">Chemistry Laboratory</h1>
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
                className="h-32 w-full rounded-md bg-green-100 object-cover"
              />
            </CardContent>
            <CardFooter>
              <Link
                href={`/student/simulations/chem/${experiment.id}`}
                className="w-full"
              >
                <Button className="w-full bg-green-500 hover:bg-green-600">
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
