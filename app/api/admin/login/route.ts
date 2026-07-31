import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

interface AdminLoginPayload {
  username: string;
  password: string;
}

export async function POST(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);

  let data: AdminLoginPayload = { username: "", password: "" };

  // ⭐ FIX για Vercel — req.json() αποτυγχάνει
  try {
    const raw = await req.text();
    data = JSON.parse(raw);
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body" });
  }

  const { username, password } = data;

  if (!username || !password) {
    return NextResponse.json({ success: false, message: "Missing fields" });
  }

  const admin = await sql`
    SELECT * FROM admins
    WHERE username = ${username}
      AND password = ${password}
    LIMIT 1;
  `;

  if (admin.length === 0) {
    return NextResponse.json({ success: false, message: "Wrong username or password" });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("admin_token", "valid", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
