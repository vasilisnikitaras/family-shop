import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminClientPage from "./AdminClientPage";

export default function AdminPage() {
  const token = cookies().get("admin_token");

  if (!token || token.value !== "valid") {
    redirect("/admin/login");
  }

  return <AdminClientPage />;
}
