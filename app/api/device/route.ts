import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Όποιο device δεν έκανε ping για 30 δευτερόλεπτα → offline
    await sql`
      UPDATE devices
      SET is_online = false
      WHERE last_seen < NOW() - INTERVAL '30 seconds';
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Offline check error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
