"use server";

import prisma from "@/lib/prisma";

export async function updateUserRole(userId: string, role: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return user;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role.");
  }
}
