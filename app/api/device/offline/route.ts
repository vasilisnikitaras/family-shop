import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

interface OfflinePayload {
  family_code: string;
  device_name: string;
}

export async function POST(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);

  let data: OfflinePayload = { family_code: "", device_name: "" };

  try {
    data = await req.json();
  } catch {
    // Browser unload event → no JSON body
    data = { family_code: "", device_name: "" };
  }

  const family_code = data.family_code || "";
  const device_name = data.device_name || "";

  if (!family_code || !device_name) {
    return NextResponse.json({ success: false, message: "Missing fields" });
  }

  await sql`
    UPDATE devices
    SET is_online = false
    WHERE family_code = ${family_code}
      AND device_name = ${device_name};
  `;

  return NextResponse.json({ success: true });
}
