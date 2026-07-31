import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id, is_online, family_code } = await req.json();

    await sql`
      UPDATE devices
      SET is_online = ${is_online}
      WHERE id = ${id} AND family_code = ${family_code};
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling device:", error);
    return NextResponse.json({ error: "Failed to toggle device" }, { status: 500 });
  }
}
