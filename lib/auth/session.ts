import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export function getAdminSession() {
  return getServerSession(authOptions);
}

// Use in API route handlers — middleware only guards page navigations to
// /admin/*, not fetches to /api/*, so routes must check for themselves.
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session?.user) {
    return null;
  }
  return session;
}
