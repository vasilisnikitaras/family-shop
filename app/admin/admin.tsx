import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminUI from "./AdminUI";

export default async function AdminPage() {
  const cookieStore = cookies();
  const cookie = cookieStore.get("admin_session");

  if (!cookie) {
    redirect("/admin/login");
  }

  return <AdminUI />;
}
