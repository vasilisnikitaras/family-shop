import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);

  let data = {};
  try {
    data = await req.json();
  } catch {
    data = {};
  }

  const family_code = data.family_code || "";
  const device_name = data.device_name || "";

  if (!family_code || !device_name) {
    return NextResponse.json({ success: false, message: "Missing fields" });
  }

  await sql`
    INSERT INTO devices (family_code, device_name, is_online, last_seen)
    VALUES (${family_code}, ${device_name}, true, NOW())
    ON CONFLICT (family_code, device_name)
    DO UPDATE SET 
      is_online = true,
      last_seen = NOW();
  `;

  return NextResponse.json({ success: true });
}
