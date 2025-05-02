import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function EmailVerifiedPage() {
  return (
    <div className="flex grow flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold text-green-500">
        Email Verified!
      </h1>
      <p className="mb-4 text-zinc-600">
        Your email has been successfully verified.
      </p>
      <Link
        href="/role-selection"
        className={buttonVariants({
          variant: "default",
        })}
      >
        Continue to Role Selection
      </Link>
    </div>
  );
}
