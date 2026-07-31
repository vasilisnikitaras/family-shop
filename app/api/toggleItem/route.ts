import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id, is_checked, family_code } = await req.json();

    await sql`
      UPDATE items
      SET is_checked = ${is_checked}
      WHERE id = ${id} AND family_code = ${family_code};
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling item:", error);
    return NextResponse.json({ error: "Failed to toggle item" }, { status: 500 });
  }
}
