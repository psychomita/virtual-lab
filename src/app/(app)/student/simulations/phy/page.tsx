import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PhysicsLab() {
  const experiments = [
    {
      id: "pendulum",
      title: "Pendulum Motion",
      description: "Study the oscillatory motion of a pendulum and factors affecting its period",
      image: "/images/pendulum.jpg",
      tags: ["Mechanics", "Oscillation", "Gravity"],
      difficulty: "Beginner",
    },
    {
      id: "projectile",
      title: "Projectile Motion",
      description: "Explore the path of objects launched into the air with different initial conditions",
      image: "/images/projectile.jpg",
      tags: ["Mechanics", "Kinematics", "Gravity"],
      difficulty: "Beginner",
    },
    {
      id: "circuit",
      title: "Circuit Builder",
      description: "Build and analyze electrical circuits with various components",
      image: "/images/circuit.jpg",
      tags: ["Electricity", "Circuits", "Ohm's Law"],
      difficulty: "Intermediate",
    },
    {
      id: "wave",
      title: "Wave Interference",
      description: "Visualize wave interference patterns and understand superposition",
      image: "/images/wave.jpg",
      tags: ["Wave", "Interference", "Sine"],
      difficulty: "Intermediate",
    },
    {
      id: "gravity",
      title: "Gravity Simulation",
      description: "Observe gravitational interactions between multiple bodies",
      image: "/images/gravity.webp",
      tags: ["Gravity", "Orbit", "Newton's Laws"],
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Physics Laboratory</h1>
      </div>

      <div className="mb-8">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Welcome to the Physics Virtual Laboratory. Here you can perform experiments to explore fundamental physics
          concepts through interactive simulations. Each experiment includes theory, procedure, simulation, and
          assessment sections to provide a complete learning experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((experiment) => (
          <Card key={experiment.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">{experiment.title}</CardTitle>
              <CardDescription className="dark:text-gray-400">{experiment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={experiment.image || "/placeholder.svg"}
                alt={experiment.title}
                className="w-full h-32 object-cover rounded-md bg-amber-100 dark:bg-amber-900/30"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {experiment.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full dark:bg-amber-900/30 dark:text-amber-200"
                  >
                    {tag}
                  </span>
                ))}
                <span
                  className={`ml-auto px-2 py-1 text-xs rounded-full ${
                    experiment.difficulty === "Beginner"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : experiment.difficulty === "Intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {experiment.difficulty}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/student/simulations/phy/${experiment.id}`} className="w-full">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600">
                  Start Experiment
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-amber-50 rounded-lg dark:bg-amber-900/20">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Physics Lab Learning Outcomes</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Understand and apply fundamental physics principles through hands-on virtual experiments</li>
          <li>Analyze the relationships between different physical variables through data collection and graphing</li>
          <li>Develop critical thinking skills by comparing experimental results with theoretical predictions</li>
          <li>Learn to control variables and observe their effects on physical systems</li>
          <li>Gain confidence in solving physics problems through interactive experimentation</li>
        </ul>
      </div>
    </main>
  )
}