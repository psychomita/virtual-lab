import { RoleSelectionDialog } from "@/components/auth/role-selection-dialog";
import { getSession } from "@/lib/auth/session";

export default async function RoleSelectionPage() {
  const data = await getSession();

  if (!data) {
    return (
      <div className="flex grow flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold text-red-500">Unauthorized</h1>
        <p className="mb-4 text-zinc-600">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }

  const userId = data?.user?.id as string;

  return <RoleSelectionDialog userId={userId} />;
}
