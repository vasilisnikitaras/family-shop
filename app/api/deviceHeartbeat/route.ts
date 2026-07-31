import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { family_code, device_name } = await req.json();

    if (!family_code || !device_name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO devices (family_code, device_name, last_seen, is_online)
      VALUES (${family_code}, ${device_name}, NOW(), true)
      ON CONFLICT (family_code, device_name)
      DO UPDATE SET last_seen = NOW(), is_online = true;
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Heartbeat error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
