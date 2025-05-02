"use client";
import { AppSidebar } from "@/components/teacher/app-sidebar";
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
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Gauge,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Link from "next/link";

const students = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    progress: 78,
    lastActive: "2 hours ago",
    avatar: "/avatars/01.png",
    courses: ["Physics", "Chemistry"],
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    progress: 92,
    lastActive: "1 day ago",
    avatar: "/avatars/02.png",
    courses: ["Biology", "Chemistry"],
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james.wilson@example.com",
    progress: 65,
    lastActive: "3 days ago",
    avatar: "/avatars/03.png",
    courses: ["Physics", "Biology"],
  },
  {
    id: 4,
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    progress: 84,
    lastActive: "5 hours ago",
    avatar: "/avatars/04.png",
    courses: ["Chemistry"],
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.kim@example.com",
    progress: 71,
    lastActive: "1 week ago",
    avatar: "/avatars/05.png",
    courses: ["Physics", "Biology", "Chemistry"],
  },
];

const pendingEvaluations = [
  {
    id: 1,
    title: "Quantum Mechanics Lab Reports",
    subject: "Physics",
    count: 12,
    due: "Due tomorrow",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 2,
    title: "Chemical Bonding Assessments",
    subject: "Chemistry",
    count: 8,
    due: "Due in 3 days",
    icon: <ClipboardList className="h-5 w-5 text-green-500" />,
  },
  {
    id: 3,
    title: "Cell Biology Experiments",
    subject: "Biology",
    count: 5,
    due: "No deadline",
    icon: <BookOpen className="h-5 w-5 text-purple-500" />,
  },
];

const classMetrics = [
  {
    id: 1,
    title: "Average Completion",
    value: "76%",
    trend: "↑ 8%",
    icon: <Gauge className="h-5 w-5 text-green-500" />,
    description: "Overall lab completion rate",
  },
  {
    id: 2,
    title: "Assignments Graded",
    value: "42/68",
    trend: "12 pending",
    icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
    description: "Graded vs pending",
  },
  {
    id: 3,
    title: "Top Performer",
    value: "Maria Garcia",
    trend: "92% avg",
    icon: <Award className="h-5 w-5 text-amber-500" />,
    description: "Highest average score",
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
                  <BreadcrumbLink href="#">Teacher</BreadcrumbLink>
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
          {/* Class Overview Section */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {classMetrics.map((metric) => (
              <Card key={metric.id} className="hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <CardDescription>{metric.description}</CardDescription>
                  </div>
                  <div className="bg-muted rounded-md p-2">{metric.icon}</div>
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

          {/* Student List Section */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  <CardTitle>Your Students</CardTitle>
                </div>
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </div>
              <CardDescription>
                Students assigned to your classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <Link
                    key={student.id}
                    href={`/teacher/students/${student.id}`}
                  >
                    <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-muted-foreground text-sm">
                              {student.email}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">
                                {student.courses.join(", ")}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={student.progress}
                                className="h-2 w-24"
                              />
                              <span className="text-sm font-medium">
                                {student.progress}%
                              </span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              <span>Last active {student.lastActive}</span>
                            </div>
                          </div>
                          <ChevronRight className="text-muted-foreground h-5 w-5" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Evaluations Section */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-red-500" />
                  <CardTitle>Pending Evaluations</CardTitle>
                </div>
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </div>
              <CardDescription>
                Assignments and lab reports needing your evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {pendingEvaluations.map((evaluation) => (
                  <Card key={evaluation.id} className="hover:border-primary/50">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-medium">
                          {evaluation.title}
                        </CardTitle>
                        <CardDescription>{evaluation.subject}</CardDescription>
                      </div>
                      <div className="bg-muted rounded-md p-2">
                        {evaluation.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">
                            {evaluation.count}
                          </span>{" "}
                          submissions
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {evaluation.due}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Grade Assignments</Button>
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
