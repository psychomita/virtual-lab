import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function GET() {
  const data = await getSession();
  const userRole = data?.user?.role;

  let redirectUrl = "";

  if (userRole === "ADMIN") {
    redirectUrl = "/admin/dashboard";
  } else if (userRole === "TEACHER") {
    redirectUrl = "/teacher/dashboard";
  } else if (userRole === "STUDENT") {
    redirectUrl = "/student/dashboard";
  } else {
    redirectUrl = "/role-selection";
  }
  return redirect(redirectUrl);
}
