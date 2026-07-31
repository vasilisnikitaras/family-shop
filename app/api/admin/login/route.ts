import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

interface AdminLoginPayload {
  username: string;
  password: string;
}

export async function POST(req: Request) {
  console.log("🔥 ADMIN LOGIN ROUTE HIT");

  console.log("🔥 DATABASE_URL:", process.env.DATABASE_URL);

  const sql = neon(process.env.DATABASE_URL!);

  let data: AdminLoginPayload = { username: "", password: "" };

  // ⭐ FIX για Vercel — req.json() αποτυγχάνει
  try {
    const raw = await req.text();
    console.log("🔥 RAW BODY:", raw);
    data = JSON.parse(raw);
  } catch (err) {
    console.log("❌ JSON PARSE ERROR:", err);
    return NextResponse.json({ success: false, message: "Invalid body" });
  }

  const { username, password } = data;

  console.log("🔥 USERNAME:", username);
  console.log("🔥 PASSWORD:", password);

  if (!username || !password) {
    console.log("❌ Missing fields");
    return NextResponse.json({ success: false, message: "Missing fields" });
  }

  let admin;
  try {
    admin = await sql`
      SELECT * FROM admins
      WHERE username = ${username}
        AND password = ${password}
      LIMIT 1;
    `;
    console.log("🔥 ADMIN RESULT:", admin);
  } catch (err) {
    console.log("❌ SQL ERROR:", err);
    return NextResponse.json({ success: false, message: "DB error" });
  }

  if (admin.length === 0) {
    console.log("❌ WRONG CREDENTIALS");
    return NextResponse.json({ success: false, message: "Wrong username or password" });
  }

  console.log("🔥 LOGIN SUCCESS");

  const res = NextResponse.json({ success: true });

  res.cookies.set("admin_token", "valid", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
