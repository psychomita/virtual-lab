"use client";

import {
  Flame,
  FlaskConical as Flask,
  Microscope,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

const subjects = [
  {
    id: 1,
    name: "Physics",
    icon: <Flame className="h-10 w-10 text-amber-500" />,
    topics: 12,
    progress: 45,
    color: "from-amber-500/20 to-amber-500/5",
    hoverColor: "group-hover:from-amber-500/30 group-hover:to-amber-500/10",
    iconBg: "bg-amber-500/10",
    link: "/student/simulations/phy",
    image: "/images/phycard.png",
  },
  {
    id: 2,
    name: "Chemistry",
    icon: <Flask className="h-10 w-10 text-emerald-500" />,
    topics: 10,
    progress: 70,
    color: "from-emerald-500/20 to-emerald-500/5",
    hoverColor: "group-hover:from-emerald-500/30 group-hover:to-emerald-500/10",
    iconBg: "bg-emerald-500/10",
    link: "/student/simulations/chem",
    image: "/images/chemcard.png",
  },
  {
    id: 3,
    name: "Biology",
    icon: <Microscope className="h-10 w-10 text-purple-500" />,
    topics: 15,
    progress: 30,
    color: "from-purple-500/20 to-purple-500/5",
    hoverColor: "group-hover:from-purple-500/30 group-hover:to-purple-500/10",
    iconBg: "bg-purple-500/10",
    link: "/student/simulations/bio",
    image: "/images/biocard.png",
  },
];

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Vertical Subject Cards Section */}
      <div className="grid grid-cols-1 gap-6">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            className="group hover:shadow-primary/5 w-full overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg relative"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-30"
            >
              <img
                src={subject.image}
                alt="Background"
                className="h-full w-full object-cover"
              />
            </div>

            <div
              className={`absolute inset-0 bg-gradient-to-br ${subject.color} ${subject.hoverColor} -z-10 transition-all duration-300`}
            ></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{subject.name}</CardTitle>
                <div
                  className={`rounded-full p-2 ${subject.iconBg} transition-all duration-300 group-hover:scale-110 relative z-10`}
                >
                  {subject.icon}
                </div>
              </div>
              <CardDescription>
                {subject.topics} Topics Available
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>
            </CardContent>
            <div className="px-6 pb-4 relative z-10">
              <Button
                className="group w-full"
                onClick={() => router.push(`${subject.link}`)}
              >
                <span className="transition-transform duration-300 group-hover:translate-x-[-2px]">
                  Explore Topics
                </span>
                <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-[2px]" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}