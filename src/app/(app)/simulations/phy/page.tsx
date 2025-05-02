import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PhysicsLab() {
  const experiments = [
    {
      id: "pendulum",
      title: "Pendulum Motion",
      description: "Study the oscillatory motion of a pendulum and factors affecting its period",
      image: "/placeholder.svg?height=100&width=200",
      link: "/phy/pendulum",
    },
    {
      id: "projectile",
      title: "Projectile Motion",
      description: "Explore the path of objects launched into the air with different initial conditions",
      image: "/placeholder.svg?height=100&width=200",
      link: "/phy/projectile",
    },
    {
      id: "circuit",
      title: "Circuit Builder",
      description: "Build and analyze electrical circuits with various components",
      image: "/placeholder.svg?height=100&width=200",
      link: "/phy/circuit",
    },
    {
      id: "wave",
      title: "Wave Interference",
      description: "Visualize wave interference patterns and understand superposition",
      image: "/placeholder.svg?height=100&width=200",
      link: "/phy/wave",
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/subjects/physics">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Physics Lab</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((experiment) => (
          <Link href={experiment.link} key={experiment.id}>
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardHeader>
                <CardTitle>{experiment.title}</CardTitle>
                <CardDescription>{experiment.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={experiment.image}
                  alt={experiment.title}
                  className="w-full h-40 object-cover rounded-md"
                />
              </CardContent>
              <CardFooter>
                <span className="text-sm text-muted-foreground">Tap to explore</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
