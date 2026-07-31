import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminClientPage from "./AdminClientPage";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token || token.value !== "valid") {
    redirect("/admin/login");
  }

  return <AdminClientPage />;
}
