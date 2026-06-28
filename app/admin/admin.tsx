import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminUI from "./AdminUI";

export default function AdminPage() {
  const cookie = cookies().get("admin_session");

  if (!cookie) {
    redirect("/admin/login");
  }

  return <AdminUI />;
}
