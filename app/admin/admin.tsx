import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("admin_session");

  if (!cookie) {
    redirect("/admin/login");
  }

  return (
    <div>
      <h1>Admin Panel</h1>
    </div>
  );
}
