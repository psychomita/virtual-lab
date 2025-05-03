"use client";

import { updateUserRole } from "@/actions/role.action";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Shield, Loader2 } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

const roles: {
  label: string;
  value: UserRole;
  description: string;
  icon: JSX.Element;
}[] = [
  {
    label: "Student",
    value: "STUDENT",
    description: "Access interactive learning materials and experiments",
    icon: (
      <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
    ),
  },
  {
    label: "Teacher",
    value: "TEACHER",
    description: "Create and manage classes, assignments, and experiments",
    icon: (
      <FaChalkboardTeacher className="h-8 w-8 text-green-600 dark:text-green-400" />
    ),
  },
  {
    label: "Admin",
    value: "ADMIN",
    description: "Manage platform settings and user accounts",
    icon: <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />,
  },
];

export function RoleSelectionDialog({ userId }: { userId: string }) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    setLoading(true);
    try {
      await updateUserRole(userId, role);
      toast.success("Role updated successfully!");
      router.push(`${role.toLowerCase()}/dashboard`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 rounded-xl bg-white p-10 shadow-lg dark:bg-zinc-900">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Choose Your Role
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Select your role to get started with SciNapse
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {roles.map((role) => {
          const isSelected = selectedRole === role.value;
          const isLoading = loading && isSelected;

          return (
            <Card
              key={role.value}
              onClick={() => !loading && handleRoleSelect(role.value)}
              className={`group cursor-pointer bg-zinc-800 transition hover:shadow-md ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-400 dark:ring-blue-300"
                  : "hover:border-blue-300"
              } ${loading && !isSelected ? "pointer-events-none opacity-50" : ""}`}
            >
              <CardHeader className="flex items-center justify-center space-y-2">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                ) : (
                  role.icon
                )}
                <CardTitle className="text-center text-lg font-semibold">
                  {role.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                  {role.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
