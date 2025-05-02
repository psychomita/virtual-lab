import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function GET() {
  const data = await getSession();
  const userRole = data?.user?.role;

  let redirectUrl = "";

  if (userRole === "ADMIN") {
    redirectUrl = "/dashboard/admin";
  } else if (userRole === "TEACHER") {
    redirectUrl = "/dashboard/teacher";
  } else if (userRole === "STUDENT") {
    redirectUrl = "/dashboard/student";
  } else {
    redirectUrl = "/role-selection";
  }
  return redirect(redirectUrl);
}
