"use client";
import { AppSidebar } from "@/components/student/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  BadgeCheck,
  Beaker,
  BrainCircuit,
  ChevronDown,
  ClipboardList,
  FileBarChart2,
  Flame,
  FlaskConical as Flask,
  Gauge,
  Microscope,
  Trophy,
  Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  },
];

const pendingAssessments = [
  {
    id: 1,
    title: "Quantum Mechanics Simulation",
    lab: "Physics",
    due: "2 days remaining",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    status: "pending",
  },
  {
    id: 2,
    title: "Chemical Reactions Lab",
    lab: "Chemistry",
    due: "1 week remaining",
    icon: <Beaker className="h-5 w-5 text-blue-500" />,
    status: "pending",
  },
  {
    id: 3,
    title: "Cell Structure Analysis",
    lab: "Biology",
    due: "No deadline",
    icon: <BrainCircuit className="h-5 w-5 text-purple-500" />,
    status: "available",
  },
];

const performanceMetrics = [
  {
    id: 1,
    title: "Lab Completion",
    value: "68%",
    trend: "↑ 12%",
    icon: <Gauge className="h-5 w-5 text-green-500" />,
    description: "Overall virtual lab progress",
  },
  {
    id: 2,
    title: "Assessment Score",
    value: "B+",
    trend: "↑ 2 grades",
    icon: <FileBarChart2 className="h-5 w-5 text-blue-500" />,
    description: "Average across all labs",
  },
  {
    id: 3,
    title: "Certifications",
    value: "3/8",
    trend: "1 pending",
    icon: <BadgeCheck className="h-5 w-5 text-amber-500" />,
    description: "Completed lab certifications",
  },
];

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Student</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          {/* Original Lab Cards Section (Unchanged) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="group hover:shadow-primary/5 w-full overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${subject.color} ${subject.hoverColor} -z-10 transition-all duration-300`}
                ></div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                    <div
                      className={`rounded-full p-2 ${subject.iconBg} transition-all duration-300 group-hover:scale-110`}
                    >
                      {subject.icon}
                    </div>
                  </div>
                  <CardDescription>
                    {subject.topics} Topics Available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button className="group w-full">
                    <span className="transition-transform duration-300 group-hover:translate-x-[-2px]">
                      Explore Topics
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-[2px]" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Lab Assessments Section */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-red-500" />
                  <CardTitle>Lab Assessments</CardTitle>
                </div>
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </div>
              <CardDescription>
                Pending evaluations for your virtual experiments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {pendingAssessments.map((assessment) => (
                  <Card key={assessment.id} className="hover:border-primary/50">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-medium">
                          {assessment.title}
                        </CardTitle>
                        <CardDescription>{assessment.lab} Lab</CardDescription>
                      </div>
                      <div className="bg-muted rounded-md p-2">
                        {assessment.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-muted-foreground text-xs">
                        {assessment.due}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        {assessment.status === "pending"
                          ? "Complete Assessment"
                          : "Start Assessment"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance & Certification Section */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-amber-300" />
                  <CardTitle>Your Lab Performance</CardTitle>
                </div>
                <Button variant="ghost" className="text-primary">
                  View Details
                </Button>
              </div>
              <CardDescription>
                Progress and certifications from completed labs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {performanceMetrics.map((metric) => (
                  <Card key={metric.id} className="hover:border-primary/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-medium">
                          {metric.title}
                        </CardTitle>
                        <CardDescription>{metric.description}</CardDescription>
                      </div>
                      <div className="bg-muted rounded-md p-2">
                        {metric.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-muted-foreground text-xs">
                          {metric.trend}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
