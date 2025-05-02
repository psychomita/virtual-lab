"use client";
import { AppSidebar } from "@/components/admin/app-sidebar";
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

import { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ClipboardList,
  BarChart4,
  Gauge,
  FileText,
  Activity,
  ShieldCheck,
  ChevronDown,
  BookUser,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Verification data
const pendingStudents = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.j@example.com",
    avatar: "/avatars/01.png",
    submitted: "2 days ago",
    status: "pending",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.g@example.com",
    avatar: "/avatars/02.png",
    submitted: "1 day ago",
    status: "pending",
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james.w@example.com",
    avatar: "/avatars/03.png",
    submitted: "5 hours ago",
    status: "pending",
  },
];

const pendingTeachers = [
  {
    id: 1,
    name: "Dr. Sarah Lee",
    email: "sarah.lee@example.com",
    avatar: "/avatars/04.png",
    submitted: "3 days ago",
    qualification: "PhD in Chemistry",
    status: "pending",
  },
  {
    id: 2,
    name: "Prof. David Kim",
    email: "david.kim@example.com",
    avatar: "/avatars/05.png",
    submitted: "1 week ago",
    qualification: "MSc in Physics",
    status: "pending",
  },
];

const verifiedUsers = [
  {
    id: 1,
    name: "Emma Davis",
    type: "teacher",
    verifiedOn: "2023-10-15",
  },
  {
    id: 2,
    name: "Ryan Smith",
    type: "student",
    verifiedOn: "2023-10-18",
  },
];

const analyticsData = [
  {
    id: 1,
    title: "Total Users",
    value: "1,248",
    trend: "↑ 12%",
    icon: <Users className="h-5 w-5 text-blue-500" />,
    description: "Across all user types",
  },
  {
    id: 2,
    title: "Active Today",
    value: "342",
    trend: "↓ 5%",
    icon: <Activity className="h-5 w-5 text-green-500" />,
    description: "Logged in today",
  },
  {
    id: 3,
    title: "Pending Verifications",
    value: `${pendingStudents.length + pendingTeachers.length}`,
    trend: `${pendingStudents.length} students, ${pendingTeachers.length} teachers`,
    icon: <ShieldCheck className="h-5 w-5 text-amber-500" />,
    description: "Awaiting approval",
  },
];

export default function AdminDashboard() {
  const [students, setStudents] = useState(pendingStudents);
  const [teachers, setTeachers] = useState(pendingTeachers);

  const handleVerification = (
    type: "student" | "teacher",
    id: number,
    action: "approve" | "reject",
  ) => {
    if (type === "student") {
      setStudents(students.filter((student) => student.id !== id));
    } else {
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
    }
    // In a real app, you would call an API here
  };

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
                  <BreadcrumbLink href="#">Admin</BreadcrumbLink>
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
          {/* Analytics Overview Section */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {analyticsData.map((metric) => (
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

          {/* Student Verification Section */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-blue-500" />
                  <CardTitle>Student Verifications</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    {students.length} pending
                  </Badge>
                </div>
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.length > 0 ? (
                  students.map((student) => (
                    <Card key={student.id} className="hover:border-primary/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-muted-foreground text-sm">
                                {student.email}
                              </div>
                              <div className="text-muted-foreground mt-1 text-xs">
                                Submitted {student.submitted}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleVerification(
                                  "student",
                                  student.id,
                                  "reject",
                                )
                              }
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleVerification(
                                  "student",
                                  student.id,
                                  "approve",
                                )
                              }
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    No pending student verifications
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Teacher Verification Section */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookUser className="h-6 w-6 text-purple-500" />
                  <CardTitle>Teacher Verifications</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    {teachers.length} pending
                  </Badge>
                </div>
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <Card key={teacher.id} className="hover:border-primary/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={teacher.avatar} />
                              <AvatarFallback>
                                {teacher.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{teacher.name}</div>
                              <div className="text-muted-foreground text-sm">
                                {teacher.email}
                              </div>
                              <div className="text-muted-foreground mt-1 text-xs">
                                {teacher.qualification} • Submitted{" "}
                                {teacher.submitted}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleVerification(
                                  "teacher",
                                  teacher.id,
                                  "reject",
                                )
                              }
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleVerification(
                                  "teacher",
                                  teacher.id,
                                  "approve",
                                )
                              }
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    No pending teacher verifications
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recently Verified Section */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                  <CardTitle>Recently Verified</CardTitle>
                </div>
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {verifiedUsers.map((user) => (
                  <Card key={user.id} className="hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-muted-foreground text-sm capitalize">
                            {user.type}
                          </div>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Verified on {user.verifiedOn}
                        </div>
                      </div>
                    </CardContent>
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
