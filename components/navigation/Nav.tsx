import { mainNav } from "@/config/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { NavChrome } from "@/components/navigation/NavChrome";

export async function Nav() {
  const session = await getAdminSession();

  return <NavChrome mainNav={mainNav} isAdmin={!!session?.user} />;
}
