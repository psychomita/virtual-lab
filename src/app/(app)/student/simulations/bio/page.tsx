import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BiologyLab() {
  const experiments = [
    {
      id: "enzyme",
      title: "Enzyme Activity Lab",
      description: "Investigate how temperature affects enzyme activity using liver catalase",
      image: "/images/enzyme.jpeg",
    },
    {
      id: "dna",
      title: "DNA Replication",
      description: "Visualize the process of DNA replication and understand its mechanisms",
      image: "/images/dna.jpg",
    },
    {
      id: "microscope",
      title: "Microscope Simulator",
      description: "Observe how plants convert light energy into chemical energy",
      image: "/images/microscope.jpg",
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
        <h1 className="text-3xl font-bold">Biology Laboratory</h1>
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
                className="w-full h-32 object-cover rounded-md bg-red-100"
              />
            </CardContent>
            <CardFooter>
              <Link href={`/student/simulations/bio/${experiment.id}`} className="w-full">
                <Button className="w-full bg-purple-500 hover:bg-purple-600">Start Experiment</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}