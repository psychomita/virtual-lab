import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ChemistryLab() {
  const experiments = [
    {
      id: "titration",
      title: "Titration Experiment",
      description: "Perform acid-base titrations and observe color changes with different indicators",
      image: "/images/titration.jpg",
      tags: ["Acid", "Base", "Indicators"],
      difficulty: "Intermediate",
    },
    {
      id: "molecular",
      title: "Molecular Structures",
      description: "Build and visualize 3D molecular structures and understand chemical bonding",
      image: "/images/molecular.jpg",
      tags: ["Molecule", "Bonding", "Atom"],
      difficulty: "Beginner",
    },
    {
      id: "reactions",
      title: "Chemical Reactions",
      description: "Mix virtual chemicals and observe different types of reactions",
      image: "/images/reactions.jpg",
      tags: ["Reactions", "Kinetics", "Heat"],
      difficulty: "Intermediate",
    },
    {
      id: "ph",
      title: "pH Measurement",
      description: "Test the pH of various solutions and understand the pH scale",
      image: "/images/ph.jpg",
      tags: ["Acidity", "Alkalinity", "Indicators"],
      difficulty: "Beginner",
    },
    {
      id: "gas-laws",
      title: "Gas Laws",
      description: "Explore the relationships between pressure, volume, temperature, and amount of gas",
      image: "/images/gas-laws.jpg",
      tags: ["Pressure", "Temperature", "Volume"],
      difficulty: "Advanced",
    },
  ]

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link href="/student/dashboard">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Chemistry Laboratory</h1>
      </div>

      <div className="mb-8">
        <p className="text-lg text-gray-700">
          Welcome to the Chemistry Virtual Laboratory. Here you can conduct chemical experiments safely through
          interactive simulations. Each experiment includes theory, procedure, simulation, and assessment sections to
          provide a comprehensive learning experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((experiment) => (
          <Card key={experiment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{experiment.title}</CardTitle>
              <CardDescription>{experiment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={experiment.image || "/placeholder.svg"}
                alt={experiment.title}
                className="w-full h-32 object-cover rounded-md bg-green-100"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {experiment.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-emerald-950 text-emerald-500 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                <span
                  className={`ml-auto px-2 py-1 text-xs rounded-full ${
                    experiment.difficulty === "Beginner"
                      ? "text-green-100 bg-green-800"
                      : experiment.difficulty === "Intermediate"
                        ? "text-yellow-100 bg-yellow-800"
                        : "text-red-100 bg-red-800"
                  }`}
                >
                  {experiment.difficulty}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/student/simulations/chem/${experiment.id}`} className="w-full">
                <Button className="w-full bg-green-500 hover:bg-green-600">Start Experiment</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-green-50 rounded-lg dark:bg-green-900/20">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Chemistry Lab Learning Outcomes</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Understand fundamental chemical principles through virtual experimentation</li>
          <li>Observe chemical reactions and molecular behavior in a safe environment</li>
          <li>Develop laboratory skills and techniques applicable to real-world chemistry</li>
          <li>Analyze the relationships between different chemical variables</li>
          <li>Apply theoretical knowledge to predict and explain experimental results</li>
        </ul>
      </div>
    </main>
  )
}