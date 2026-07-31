import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(req.url);
    const familyCode = searchParams.get("familyCode");

    const devices = familyCode
      ? await sql`
          SELECT 
            id,
            family_code,
            device_name,
            last_seen,
            is_online
          FROM devices
          WHERE family_code = ${familyCode}
          ORDER BY id DESC;
        `
      : await sql`
          SELECT 
            id,
            family_code,
            device_name,
            last_seen,
            is_online
          FROM devices
          ORDER BY id DESC;
        `;

    return NextResponse.json(devices);
  } catch (error) {
    console.error("Error loading devices:", error);
    return NextResponse.json({ error: "Failed to load devices" }, { status: 500 });
  }
}
